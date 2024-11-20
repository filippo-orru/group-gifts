import { getGroupData } from "~/server/utils/groups";
import type { MyBudget, PutBudget } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const body: PutBudget = await readBody(event);

  const targetMemberId = getRouterParams(event).memberId;
  const targetMember = group.members.find((m) => m.id === targetMemberId)
  if (!targetMember) {
    throw new Error("Member not found in group");
  }
  targetMember.budget = targetMember.budget.filter((b) => b.userId !== member.id);
  if (body.amount !== null) {
    targetMember.budget.push({
      userId: member.id,
      amount: body.amount,
      flexible: body.flexible,
    });
  }

  await group.save();

  return await toClientGroup(group, member.id);
})
