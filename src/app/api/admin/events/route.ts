import { UserRole } from "@prisma/client";
import { parse, startOfMonth, endOfMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

// EventType enum from schema.prisma
type EventType = "VIEW" | "CLICK" | "KEY_PRESS" | "SCROLL" | "HOVER";

// APIレスポンスの型定義
export type EventCountByName = {
  name: string;
  count: number;
  typeBreakdown: {
    type: EventType;
    count: number;
  }[];
};

export type EventsResponse = {
  events: EventCountByName[];
  totalCount: number;
};

// 処理時間を延長（60秒）
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser({ request });

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    // クエリパラメータから月または全期間を取得
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get("month");
    const isAllPeriods = searchParams.get("all") === "true";

    const prisma = await buildPrisma();

    // 日付範囲の設定
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (!isAllPeriods && monthParam) {
      // 月のフォーマットを解析 (例: 2025/3)
      const parsedDate = parse(monthParam, "yyyy/M", new Date());
      startDate = startOfMonth(parsedDate);
      endDate = endOfMonth(parsedDate);
    }

    // イベント名ごとの集計を取得
    const eventCountsQuery = `
      SELECT name, COUNT(*) as count
      FROM events
      WHERE 1=1 ${
        !isAllPeriods && monthParam && startDate && endDate
          ? "AND created_at >= $1::timestamp AND created_at <= $2::timestamp"
          : ""
      }
      GROUP BY name
      ORDER BY count DESC
    `;

    const queryParams =
      !isAllPeriods && monthParam && startDate && endDate
        ? [startDate.toISOString(), endDate.toISOString()]
        : [];

    const eventCounts = await prisma.$queryRawUnsafe(
      eventCountsQuery,
      ...queryParams
    );

    // イベント名ごとの詳細情報を取得
    const events: EventCountByName[] = [];

    if (eventCounts && Array.isArray(eventCounts)) {
      type EventCount = { name: string; count: string | number };
      for (const event of eventCounts as EventCount[]) {
        // そのイベント名におけるタイプ別の集計
        let typeBreakdownQuery = `
          SELECT type, COUNT(*) as count
          FROM events
          WHERE name = $1
        `;

        const typeBreakdownParams: Array<string> = [event.name];

        if (!isAllPeriods && monthParam && startDate && endDate) {
          typeBreakdownQuery +=
            " AND created_at >= $2::timestamp AND created_at <= $3::timestamp";
          typeBreakdownParams.push(
            startDate.toISOString(),
            endDate.toISOString()
          );
        }

        typeBreakdownQuery += " GROUP BY type";

        const typeBreakdown = await prisma.$queryRawUnsafe(
          typeBreakdownQuery,
          ...typeBreakdownParams
        );

        events.push({
          name: event.name,
          count: Number(event.count),
          typeBreakdown: (
            typeBreakdown as Array<{ type: string; count: string | number }>
          ).map((tb) => ({
            type: tb.type as EventType,
            count: Number(tb.count),
          })),
        });
      }
    }

    // 合計イベント数
    const totalCount = events.reduce((sum, event) => sum + event.count, 0);

    return NextResponse.json({ events, totalCount });
  } catch (error) {
    if (error instanceof Error) {
      console.log("イベントデータの取得中にエラーが発生しました:", error.stack);
    } else {
      console.log("イベントデータの取得中にエラーが発生しました:", error);
    }
    return NextResponse.json(
      {
        error: "データの取得中にエラーが発生しました",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
