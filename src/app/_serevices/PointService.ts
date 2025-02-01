import { PrismaClient, User, PointTransactionKind } from "@prisma/client";

/**
 * ユーザーのポイント管理を行うサービスクラス
 * ポイントの購入処理やポイント残高の照会など、ポイントに関する操作を提供
 *
 * @remarks
 * すべてのポイント操作はトランザクションで保護され、
 * 失敗時は PointTransactionKind.FAILED として記録される
 */
export class PointService {
  private prisma: PrismaClient;

  /**
   * コンストラクタ
   * @param prisma - buildPrisma() で生成した PrismaClient
   */
  public constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Stripeによる支払い完了後のポイントチャージ処理
   *
   * @param userId - ポイントをチャージするユーザーのID
   * @param points - チャージするポイント数（呼出し側で正の整数を保証）
   * @param stripePaymentId - Stripeの支払いID（Webhookから取得）
   * @returns ポイントチャージ後のユーザー情報
   * @throws DBに対するポイントチャージ処理に失敗した場合
   */
  public async chargePointByPurchase(
    userId: string,
    points: number,
    stripePaymentId: string
  ): Promise<User> {
    await this.prisma
      .$transaction(async (tx) => {
        // ポイントの更新
        await tx.user.update({
          where: { id: userId },
          data: { points: { increment: points } },
        });
        // 取引履歴の作成
        await tx.pointTransaction.create({
          data: {
            userId,
            stripePaymentId,
            points,
            kind: PointTransactionKind.PURCHASE,
          },
        });
      })
      .catch(async (e) => {
        // ポイントチャージに失敗した場合の記録
        await this.prisma.pointTransaction.create({
          data: {
            userId,
            stripePaymentId,
            points: 0,
            kind: PointTransactionKind.FAILED,
            detail: `${points}ptのチャージ処理に失敗`,
          },
        });
        throw new Error(
          `ポイントのチャージに失敗しました ${userId} ${points} ${e.message} ${stripePaymentId}`
        );
      });

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    return user;
  }

  /**
   * idで指定したユーザーの現在のポイント残高を取得
   *
   * @param id - ポイント残高を確認したいユーザーのID
   * @returns 現在のポイント残高（0以上の整数）
   * @throws idで指定されたユーザーが存在しない場合
   */
  public async getPoints(id: string): Promise<number> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error(`userの取得に失敗しました ${id}`);
    return user.points;
  }
}
