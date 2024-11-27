import { Types } from 'mongoose';
import { toClientMessage, type DbChatMessage } from "~/server/models/messages.schema";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);
  const targetMemberId = getRouterParams(event).memberId;
  if (!group.members.some(m => m.id === targetMemberId)) {
    throw new Error("Target member not found in group");
  }

  const messages: (DbChatMessage & { _id: Types.ObjectId })[] = await MongoMessages.find({
    groupId: group.id,
    memberId: targetMemberId,
  }).exec();

  return messages.map(m => toClientMessage(m));
})
