import type { DbUserInGroup } from "~/server/models/userGroups.schema";
import type { AcceptInviteBody } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const inviteId = getRouterParams(event).inviteId;
  const body: AcceptInviteBody = await readBody(event);
  const token = getToken(event);

  const group = await MongoGroups.findOne({
    inviteId: inviteId
  }).exec();
  if (!group) {
    throw new Error("Invite not found");
  }
  if (group.members.every((m) => m.id !== body.memberId)) {
    throw new Error("Member id not found in group");
  }

  const userGroup = await MongoUserGroups.findOne({
    token: token,
    groupId: group._id,
  }).exec();
  if (userGroup) {
    throw new Error("User has already joined this group with this device");
  }

  const userGroupAssociation: DbUserInGroup = {
    token: token,
    groupId: group._id,
    memberId: body.memberId,
  };

  await MongoUserGroups.create(userGroupAssociation);
})
