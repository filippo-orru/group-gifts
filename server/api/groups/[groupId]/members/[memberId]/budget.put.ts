import { getGroupData } from "~/server/utils/groups";
import type { PutBudget } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const body: PutBudget = await readBody(event);

  const targetMemberId = getRouterParams(event).memberId;
  const targetMember = group.members.find((m) => m.id === targetMemberId)
  if (!targetMember) {
    throw new Error("Member not found in group");
  }
  const myBudgetForTarget = targetMember.budget.find((b) => b.userId === member.id);
  if (!myBudgetForTarget) {
    if (body.budget) {
      targetMember.budget.push({
        userId: member.id,
        amount: body.budget,
      });
    }
  } else {
    if (body.budget) {
      myBudgetForTarget.amount = body.budget;
    } else {
      targetMember.budget = targetMember.budget.filter((b) => b.userId !== member.id);
    }
  }

  await group.save();

  return toClientGroup(group._id, group, member.id);
})
