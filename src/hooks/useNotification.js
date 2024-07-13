import notifee, { TimestampTrigger, TriggerType, RepeatFrequency, AndroidImportance, AndroidStyle } from '@notifee/react-native';

export const useNotification = () => {

    async function displayNotification(notification, id) {

        // Create a channel required for Android Notifications
        const channelId = await notifee.createChannel({
            id: id,
            name: 'General',
            importance: AndroidImportance.HIGH,
            sound: 'sound',
        });

        await notifee.requestPermission()

        const notificationId = notifee.displayNotification({
            title: notification?.title,
            body: notification?.description,
            android: {
                channelId,
                smallIcon: "ic_launcher",
                largeIcon: notification?.image,
                style: {
                    type: AndroidStyle.BIGPICTURE,
                    picture: notification.hasOwnProperty('largeImage') && notification?.largeImage ? notification?.largeImage : null
                },
                actions: [
                    {
                        pressAction: { id: 'default' },
                        title: 'Xem ngay!'
                    }
                ]
            },
        });
        return notificationId;
    }

    async function displayTriggerNotification(
        title,
        body,
        timestamp,
        repeatFrequency
    ) {
        // Create a channel required for Android Notifications
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Create a time-based trigger
        const trigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: timestamp, // fire at the provided date
            repeatFrequency: repeatFrequency, // repeat the notification on a hourly/daily/weekly basis
        };
        // Please note, for iOS, a repeating trigger does not work the same as Android - the initial trigger cannot be delayed
        // See https://notifee.app/react-native/docs/triggers

        // You can also use Intervall triggers
        /*
        const trigger: IntervalTrigger = {
          type: TriggerType.INTERVAL,
          interval: 30
          timeUnit: TimeUnit.MINUTES
        };
        */

        // Create a trigger notification
        const triggerNotificationId = await notifee.createTriggerNotification(
            {
                // id: "string" | updates Notification instead if provided id already exists
                title: title,
                body: body,
                android: {
                    channelId,
                },
            },
            trigger, // use displayNotification to update triggerNotifications which trigger already fired
        );
        return triggerNotificationId;
    }

    // get all trigger notifications
    async function getTriggerNotificationIds() {
        const triggerNotificationIds = await notifee.getTriggerNotificationIds();
        return triggerNotificationIds;
    }

    // cancel all or specific trigger notifications
    async function cancelTriggerNotifications(notificationIds) {
        await notifee.cancelTriggerNotifications(notificationIds);
    }

    // cancel all notifications
    async function cancelAllNotifications() {
        await notifee.cancelAllNotifications();
    }

    // cancel notification via notificationId or tag
    async function cancelNotification(notificationId, tag = undefined) {
        await notifee.cancelNotification(notificationId, tag);
    }

    // There are way more methods I didn't cover here that can help you in various scenarios
    // See https://notifee.app/react-native/reference

    return {
        displayNotification,
        displayTriggerNotification,
        getTriggerNotificationIds,
        cancelTriggerNotifications,
        cancelAllNotifications,
        cancelNotification
    }
}