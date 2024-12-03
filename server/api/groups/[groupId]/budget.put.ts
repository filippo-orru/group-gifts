import { getGroupData } from "~/server/utils/groups";
import type { PutBudget } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const body: PutBudget = await readBody(event);

  if (group.maxBudget !== null && body.amount !== null && body.amount > group.maxBudget) {
    throw new Error("Amount exceeds group budget");
  }

  group.members.forEach((m) => {
    if (m.id === member.id) {
      return; // Don't set budget for the member making the request
    }
    m.budget = m.budget.filter((b) => b.userId !== member.id);

    if (body.amount !== null) {
      m.budget.push({
        userId: member.id,
        amount: body.amount,
        flexible: body.flexible,
      });
    }
  });

  await group.save();

  return await toClientGroup(group, member.id);
})
