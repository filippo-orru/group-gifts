import type { GroupForInvite } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const inviteId = getRouterParams(event).inviteId;
  const group = await MongoGroups.findOne({
    inviteId: inviteId
  }).exec();

  if (!group) {
    throw new Error("Invite not found");
  }

  const userInGroup = await MongoUserGroups.findOne({
    token: getToken(event),
    groupId: group._id
  }).exec();

  if (userInGroup) {
    const ret: GroupForInvite = {
      state: "already-joined",
      groupId: group._id.toHexString()
    };
    return ret;
  }

  const ret: GroupForInvite = {
    state: "can-join",
    group: {
      id: group._id.toHexString(),
      name: group.name,
      date: group.date.getTime(),
      members: group.members.map((m) => ({ id: m.id, name: m.name }))
    }
  };

  return ret;
})