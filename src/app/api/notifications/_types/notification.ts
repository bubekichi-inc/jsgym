export type FetchNotificationRequest = {
  receiveNewQuestionNotification: boolean;
  receiveUsefulInfoNotification: boolean;
  receiveReminderNotification: boolean;
}

export type UpdateNotificationRequest = {
  receiveNewQuestionNotification?: true,
  receiveUsefulInfoNotification?: true,
  receiveReminderNotification?: true,
};

export type NotificationSettingKey =
| "receiveNewQuestionNotification"
| "receiveReminderNotification"
| "receiveUsefulInfoNotification"