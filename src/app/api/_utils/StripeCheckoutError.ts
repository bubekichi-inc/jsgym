export class StripeCheckoutError extends Error {
  public readonly userId: string | null;
  public readonly stripePaymentId: string;
  public readonly occurredAt: Date;
  public forwardToSlack: boolean = true; // Slack通知の有無
  constructor(
    message: string,
    stripePaymentId: string,
    userId: string | null = null
  ) {
    super(message);
    this.userId = userId;
    this.stripePaymentId = stripePaymentId;
    this.occurredAt = new Date(); // UTC
    Error.captureStackTrace(this, this.constructor);
  }
}
