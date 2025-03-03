import { WebClient } from "@slack/web-api";

export class SlackService {
  web: WebClient;

  constructor() {
    this.web = new WebClient(process.env.SLACK_API_TOKEN);
  }

  async postMessage({
    channel,
    message,
  }: {
    channel: string;
    message: string;
  }) {
    try {
      await this.web.chat.postMessage({
        text: message,
        channel,
      });
    } catch (error) {
      console.error("SlackAPIError: ", error);
    }
  }
}
