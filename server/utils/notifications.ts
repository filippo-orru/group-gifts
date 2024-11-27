import { getMessaging, type Message } from "firebase-admin/messaging";

export const sendNotification = async (token: string, messageText: string) => {
  const messagingToken = await MongoMessagingTokens.findOne({ _id: token }).exec();

  if (!messagingToken) {
    console.error("No messaging token found for token", token);
    return;
  }

  const message: Message = {
    token: messagingToken.messagingToken,
    webpush: {
      notification: {
        title: "New message",
        body: messageText,
        icon: "/favicon/favicon.png",
      },
    }
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  try {
    const response = await getMessaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
};