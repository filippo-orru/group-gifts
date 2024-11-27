import type { ChatMessage } from "~/utils/types";
import { Types } from 'mongoose';
import { toClientMessage, type DbChatMessage } from "~/server/models/messages.schema";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const messages: (DbChatMessage & { _id: Types.ObjectId })[] = await MongoMessages.find({
    groupId: group.id,
    memberId: member.id,
  }).exec();

  return messages.map(m => toClientMessage(m));
})
