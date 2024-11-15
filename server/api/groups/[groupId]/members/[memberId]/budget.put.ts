import { getGroupData } from "~/server/utils/groups";
import type { PutBudget } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const body: PutBudget = await readBody(event);

  await MongoGroups.updateOne(
    { _id: group._id },
    { $set: { "members.$[elem].budget": body.budget } },
    { arrayFilters: [{ "elem.id": member.id }] }
  ).exec();

  return toClientGroup(group._id, group, member.id);
})
