import { getGroupData } from "~/server/utils/groups";
import type { PutBudget } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const body: PutBudget = await readBody(event);

  group.members.forEach((m) => {
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
