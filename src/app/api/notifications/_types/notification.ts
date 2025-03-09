export type FetchNotificationRequest = {
  receiveNewQuestionNotification: boolean;
  receiveUsefulInfoNotification: boolean;
  receiveReminderNotification: boolean;
} | undefined;

export type UpdateNotificationRequest = {
  receiveNewQuestionNotification: boolean;
  receiveUsefulInfoNotification: boolean;
  receiveReminderNotification: boolean;
};

export type UpdateNotificationResponse = {
  receiveNewQuestionNotification: boolean;
  receiveUsefulInfoNotification: boolean;
  receiveReminderNotification: boolean;
};