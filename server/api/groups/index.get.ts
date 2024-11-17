import { getToken } from "~/server/utils/auth";

export default defineEventHandler(async (event): Promise<Group[]> => {
  const token = getToken(event);

  const userGroups = await MongoUserGroups.find({ token: token }).exec();

  const groups = await MongoGroups.find({
    _id: {
      "$in": userGroups.map((g) => g.groupId)
    }
  }).exec();

  const clientGroups = await Promise.all(groups.map(async (dbGroup) => {
    const userInGroup = userGroups.find((g) => g.groupId.toHexString() === dbGroup._id.toHexString());
    if (!userInGroup) {
      console.error("User not found in group. This should not happen, I think?", userGroups, dbGroup);
      throw new Error("User not found in group");
    }

    return await toClientGroup(dbGroup._id, dbGroup, userInGroup.memberId);
  }));

  return clientGroups;
})
