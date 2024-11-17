import { H3Event } from 'h3';
import type { DbGroup, DbGroupMember } from '../models/groups.schema';
import type { Document, Types } from 'mongoose';

export type GroupData =
  Promise<{ group: DbGroup & Document<Types.ObjectId>; member: DbGroupMember; }>;

export const getGroupData = async (event: H3Event): GroupData => {
  const groupId = getRouterParams(event).groupId;
  const token = getToken(event);

  return getGroupDataByTokenAndGroupId(token, groupId);
}

export const getGroupDataByTokenAndGroupId = async (token: string, groupId: string): GroupData => {
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