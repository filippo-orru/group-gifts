import { MongoMessagingTokens, type DbMessagingToken } from "~/server/models/messagingTokens.schema";

export default defineEventHandler(async (event) => {
  // Save FCM token
  const ggToken = getToken(event);
  const body: { token: string } = await readBody(event);

  const existingToken = await MongoMessagingTokens.findOne({ _id: ggToken }).exec();
  
  if (!existingToken) {
    const messagingToken: DbMessagingToken = {
      _id: ggToken,
      messagingToken: body.token,
    };
    await MongoMessagingTokens.create(messagingToken);
    console.log("inserted messaging token", messagingToken);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } else if (existingToken.messagingToken !== body.token) {
    existingToken.messagingToken = body.token;
    await existingToken.save();
    console.log("updated messaging token", existingToken);
  }
})
