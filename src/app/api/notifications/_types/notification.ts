export type NotificationRequest = {
  receiveNewQuestionNotification: boolean;
  receiveUsefulInfoNotification: boolean;
  receiveReminderNotification: boolean;
};

export type NotificationResponse = {
  receiveNewQuestionNotification: boolean;
  receiveUsefulInfoNotification: boolean;
  receiveReminderNotification: boolean;
} | undefined;