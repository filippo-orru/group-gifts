import { H3Event } from 'h3';
import type { DbGroup, DbGroupMember } from '../models/groups.schema';
import type { Document, Types } from 'mongoose';

export async function getGroupData(event: H3Event): Promise<{ group: DbGroup & Document<Types.ObjectId>; member: DbGroupMember; }> {
  const groupId = getRouterParams(event).groupId;

  const token = getToken(event);

  const userGroups = await MongoUserGroups.find({ token: token }).exec();
  const userInGroup = userGroups.find((g) => g.groupId.toHexString() === groupId);
  if (!userInGroup) {
    throw new Error("User not in group");
  }

  const group = await MongoGroups.findOne({ _id: groupId }).exec();
  if (!group) {
    throw new Error("Group not found");
  }

  const member = group.members.find((m) => m.id === userInGroup.memberId);
  if (!member) {
    console.error("Member not found in group. This should not happen, I think?",
      userInGroup.memberId, group.members);
    throw new Error("Member not found in group");
  }

  return { group, member };
}