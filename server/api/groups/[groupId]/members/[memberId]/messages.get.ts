import type { ChatMessage } from "~/utils/types";
import { Types } from 'mongoose';
import { toClientMessage, type DbChatMessage } from "~/server/models/messages.schema";

export default defineEventHandler(async (event) => {
  const token = getToken(event);

  // await new Promise((resolve) => setTimeout(resolve, 600));

  const groupId = getRouterParams(event).groupId;
  const memberId = getRouterParams(event).memberId;

  const userGroup = await MongoUserGroups.findOne({
    token: token,
    groupId: groupId,
  }).exec();
  if (!userGroup) {
    throw new Error("User not in group"); // TODO do this also for other endpoints
  }

  const messages: (DbChatMessage & { _id: Types.ObjectId })[] = await MongoMessages.find({
    groupId: groupId,
    memberId: memberId,
  }).exec();

  return messages.map(m => toClientMessage(m));
})
