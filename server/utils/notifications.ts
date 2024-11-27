import { getMessaging, type BaseMessage, type Notification } from "firebase-admin/messaging";


export async function sendNotificationForToken(token: string, notification: Notification) {
  const messagingToken = await MongoMessagingTokens.findOne({ _id: token }).exec();

  if (!messagingToken) {
    console.error("No messaging token found for token", token);
    return;
  }
  return sendNotification(messagingToken.messagingToken, notification);
}

export async function sendNotification(messagingToken: string | string[], notification: Notification) {
  const message: BaseMessage = {

    notification: notification,
    webpush: {
      notification: {
        icon: "/favicon/favicon.png",
        ...notification,
      }
    }
  };
  
  try {
    const messaging = getMessaging();
    if (Array.isArray(messagingToken)) {
      await messaging.sendEachForMulticast({ tokens: messagingToken, ...message });
    } else {
      await messaging.send({ token: messagingToken, ...message });
    }
  } catch (error) {
    console.log('Error sending message:', error);
  }
}