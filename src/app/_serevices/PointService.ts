import { PrismaClient, User, PointTransactionKind } from "@prisma/client";

export class PointService {
  private prisma: PrismaClient;

  public constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 購入によるポイントのチャージ
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
        // 失敗の記録
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

  // ポイント残高の取得
  public async getPoints(id: string): Promise<number> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error(`userの取得に失敗しました ${id}`);
    return user.points;
  }
}
