import {
  Prisma,
  PrismaClient,
  User,
  PointTransactionKind,
} from "@prisma/client";

/**
 * chargePointByPurchase における2重チャージ検出エラー
 *
 * @remarks
 * `stripe listen --forward-to` が複数PCで実行されている場合など、
 * chargePointByPurchase で、同一 stripePaymentId による
 * 2回目以降のポイントチャージを検出した際にスローされるエラー
 *
 */
export class DuplicatePointChargeError extends Error {
  public readonly stripePaymentId: string;
  public readonly occurredAt: Date;
  constructor(message: string, stripePaymentId: string) {
    super(message);
    this.stripePaymentId = stripePaymentId;
    this.occurredAt = new Date(); // UTC
    Error.captureStackTrace(this, this.constructor);
  }
}

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
    return await this.prisma
      .$transaction(
        async (tx) => {
          //
          // 1. pointTransaction に、既に stripePaymentId が記録されていないことを確認
          const existingTransaction = await tx.pointTransaction.findFirst({
            where: { stripePaymentId },
          });
          // 既に記録が存在する場合は DuplicatePointChargeError をスロー
          if (existingTransaction)
            throw new DuplicatePointChargeError(
              `PaymentId '${stripePaymentId}' による AppUserID '${userId}' に対する '${points}pt' のチャージ要求をキャンセルしました`,
              stripePaymentId
            );

          // 2. ポイントの更新
          const updatedUser = await tx.user.update({
            where: { id: userId },
            data: { points: { increment: points } },
          });

          // 3. 取引履歴の作成
          await tx.pointTransaction.create({
            data: {
              userId,
              stripePaymentId,
              points,
              kind: PointTransactionKind.PURCHASE,
            },
          });
          return updatedUser;
        },
        {
          // 厳格なトランザクション分離レベルとタイムアウトを設定
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000, // 最大待機時間: 5秒
          timeout: 10000, // トランザクションタイムアウト: 10秒
        }
      )
      .catch(async (e) => {
        const isDuplicatePointChargeError =
          e instanceof DuplicatePointChargeError;

        // ポイントチャージ失敗を記録
        await this.prisma.pointTransaction.create({
          data: {
            userId,
            stripePaymentId,
            points: 0,
            kind: PointTransactionKind.FAILED,
            detail: isDuplicatePointChargeError
              ? "当該 PaymentId による要求は処理済のためキャンセル"
              : `${points}pt のチャージ処理に失敗`,
          },
        });
        if (isDuplicatePointChargeError) throw e; // 2重チャージエラーは再スロー
        throw new Error(
          `${points}pt のチャージ処理に失敗: ${JSON.stringify(e.message)}`
        );
      });
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
