import { type UpdateGroup } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const body = await readBody<UpdateGroup>(event);
  if (body.name !== undefined) {
    group.name = body.name;
  }
  if (body.fixedBudget !== undefined) {
    group.fixedBudget = body.fixedBudget;
    group.maxBudget = null; // fixed budget and max budget are mutually exclusive
  } else if (body.maxBudget !== undefined) {
    group.maxBudget = body.maxBudget;
    group.fixedBudget = null; // fixed budget and max budget are mutually exclusive
  }
  if (body.secretMode !== undefined) {
    group.secretMode = body.secretMode;
  }

  await group.save();

  return toClientGroup(group, member.id);
})
