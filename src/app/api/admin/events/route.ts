import { UserRole } from "@prisma/client";
import {
  parse,
  startOfMonth,
  endOfMonth,
} from "date-fns";
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
    let dateCondition = "";
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    if (!isAllPeriods && monthParam) {
      // 月のフォーマットを解析 (例: 2025/3)
      const parsedDate = parse(monthParam, "yyyy/M", new Date());
      startDate = startOfMonth(parsedDate);
      endDate = endOfMonth(parsedDate);
      dateCondition = "AND created_at >= $1 AND created_at <= $2";
    }

    // イベント名ごとの集計を取得
    const queryParams = !isAllPeriods && monthParam ? [startDate, endDate] : [];
    
    // イベント名ごとの集計を取得
    const eventCountsQuery = `
      SELECT name, COUNT(*) as count
      FROM events
      WHERE 1=1 ${dateCondition}
      GROUP BY name
      ORDER BY count DESC
    `;
    
    const eventCounts = await prisma.$queryRawUnsafe(eventCountsQuery, ...queryParams);

    // イベント名ごとの詳細情報を取得
    type EventCount = { name: string; count: string | number };
    const events: EventCountByName[] = await Promise.all(
      (eventCounts as EventCount[]).map(async (event) => {
        // そのイベント名におけるタイプ別の集計
        const typeBreakdownQuery = `
          SELECT type, COUNT(*) as count
          FROM events
          WHERE name = $1 ${dateCondition}
          GROUP BY type
        `;
        
        const typeBreakdownParams: Array<string | Date> = [event.name];
        if (!isAllPeriods && monthParam) {
          typeBreakdownParams.push(startDate!, endDate!);
        }
        
        const typeBreakdown = await prisma.$queryRawUnsafe(typeBreakdownQuery, ...typeBreakdownParams);

        return {
          name: event.name,
          count: Number(event.count),
          typeBreakdown: (typeBreakdown as Array<{ type: string; count: string | number }>).map((tb) => ({
            type: tb.type as EventType,
            count: Number(tb.count)
          }))
        };
      })
    );

    // 合計イベント数
    const totalCount = events.reduce((sum, event) => sum + event.count, 0);

    return NextResponse.json({ events, totalCount });
  } catch (error) {
    console.error("イベントデータの取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "データの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
