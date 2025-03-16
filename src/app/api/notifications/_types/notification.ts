export type FetchNotificationRequest = {
  receiveNewQuestionNotification: boolean;
  receiveUsefulInfoNotification: boolean;
  receiveReminderNotification: boolean;
}

export type UpdateNotificationRequest = {
  receiveNewQuestionNotification?: boolean;
  receiveUsefulInfoNotification?: boolean;
  receiveReminderNotification?: boolean;
};

export type NotificationSettingKey =
| "receiveNewQuestionNotification"
| "receiveReminderNotification"
| "receiveUsefulInfoNotification"