import { type DbGroupMember } from "~/server/models/groups.schema";
import calculateGroupBudget from "~/utils/budget-calc";
import { getGroupData } from "~/server/utils/groups";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const ret: GroupBudgetForMe = calculateBudgetForMe(group, member);
  return ret;
});

const calculateBudgetForMe = (group: DbGroup, me: DbGroupMember): GroupBudgetForMe => {
  const groupBudget = calculateGroupBudget(group);

  const myBudget = groupBudget.membersBudgets.find(m => m.id === me.id)!;

  return {
    budgetSum: myBudget.budget,
    expensesSum: myBudget.expenses,

    overspend: myBudget.overspend,
    underspend: myBudget.underspend,

    remainder: - myBudget.expenses + myBudget.budget - myBudget.underspend.amount + myBudget.overspend.amount,

    myTransactions: groupBudget.allTransactions
      .filter(t => t.fromId === me.id || t.toId === me.id)
      .map<MyBudgetTransaction>(t => ({
        fromId: t.fromId,
        toId: t.toId,
        amountCents: t.amountCents,
        completed: false, // TODO
      })),
  };
};