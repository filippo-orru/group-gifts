import { type UpdateGroup } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const body = await readBody<UpdateGroup>(event);
  if (body.name !== undefined) {
    group.name = body.name;
  }
  if (body.maxBudget !== undefined) {
    group.maxBudget = body.maxBudget;
  }

  await group.save();

  return toClientGroup(group, member.id);
})
