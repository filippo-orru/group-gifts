import { toClientGroup, type DbGroupMember } from "~/server/models/groups.schema";
import { getGroupData } from "~/server/utils/groups";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const ret: GroupBudgeting = calculateBudget(group, member);
  return ret;
});

const calculateBudget = (group: DbGroup, me: DbGroupMember): GroupBudgeting => {
  const membersBudgets = group.members.map((member) => {
    const budgetSum = group.members
      .reduce((acc, m) => acc + (m.budget.find(b => b.userId == member.id)?.amount ?? 0), 0);
    const expensesSum = group.members
      .reduce((acc, m) => {
        return acc + m.gifts.filter(b => b.buyerId == member.id).reduce((acc, b) => acc + b.price, 0);
      }, 0);

    // "member for whom I am responsible"
    const myResponsibleMember = group.members.find(m => m.responsibleMemberId === member.id)!;
    const budgetSumForMyResponsibleMember = myResponsibleMember
      .budget.reduce((acc, b) => acc + b.amount, 0);
    const expensesSumForMyResponsibleMember = myResponsibleMember
      .gifts.filter(b => b.buyerId == member.id)
      .reduce((acc, b) => acc + b.price, 0);

    // If we overspent for [myResponsibleMember], the [member] is responsible for the overspent amount
    // If we underspent, the remaining budget is split in the next step
    const responsibleMemberOverspend = expensesSumForMyResponsibleMember > budgetSumForMyResponsibleMember
      ? expensesSumForMyResponsibleMember - budgetSumForMyResponsibleMember
      : 0;
    return {
      id: member.id,
      budget: budgetSum,
      responsibleMemberOverspend: responsibleMemberOverspend,
      expenses: expensesSum,
    };
  });

  const totalGroupBudget = membersBudgets.reduce((acc, m) => acc + m.budget + m.responsibleMemberOverspend, 0);
  const totalGroupExpenses = membersBudgets.reduce((acc, m) => acc + m.expenses, 0);

  if (totalGroupBudget < totalGroupExpenses) {
    // Should not be possible because the budget is adjusted for overspending
    console.error("Overspent, should never happen", totalGroupBudget, totalGroupExpenses);
  }

  // factor is 1.0 if we spent exactly the budget and < 1.0 if we spent less. 
  // In this case, each member's budget is adjusted by the factor so in the end we spent exactly the budget
  let factor: number;
  if (totalGroupExpenses === 0) {
    factor = 1.0;
  } else {
    factor = totalGroupExpenses / totalGroupBudget;
    console.log("factor", factor);
  }

  const allTransactions: BudgetTransaction[] = [];
  const adjustedMemberBudgets = membersBudgets
    .map(m => {
      const budgetCents = Math.round(100 * m.budget * factor)
      const expensesCents = Math.round(100 * m.expenses);
      return ({
        id: m.id,
        overspendCents: expensesCents - budgetCents,
      });
    });
  const adjustedMemberBudgetsByLargeOverspend = adjustedMemberBudgets
    .toSorted((a, b) => b.overspendCents - a.overspendCents);
  const adjustedMemberBudgetsByLargeUnderspend = adjustedMemberBudgets
    .toSorted((a, b) => a.overspendCents - b.overspendCents);

  adjustedMemberBudgetsByLargeUnderspend.forEach((member) => {
    let preventOverflow = 0;
    while (member.overspendCents < 0 && preventOverflow < 50) {
      preventOverflow++;
      // Finds largest overspender first
      const other = adjustedMemberBudgetsByLargeOverspend.find(m =>
        m.id !== member.id && m.overspendCents > member.overspendCents
      );
      if (!other) {
        break;
      }
      const amountCents = Math.min(-member.overspendCents, other.overspendCents);
      allTransactions.push({
        fromId: member.id,
        toId: other.id,
        amountCents: amountCents,
        completed: false,
      });
      member.overspendCents += amountCents;
      other.overspendCents -= amountCents;
    }

    if (member.overspendCents < 0) {
      console.error("Budget not spent", member);
    }
  });

  // transactions.push({
  //     fromId: member.id,
  //     toId: budget.userId,
  //     amount: budget.amount,
  //     completed: false,
  // });

  const myBudget = membersBudgets.find(m => m.id === me.id)!;

  return {
    budgetSum: myBudget.budget,
    expensesSum: myBudget.expenses,

    responsibleMemberOverspend: myBudget.responsibleMemberOverspend,
    groupUnderspendFactor: factor,
    myTransactions: allTransactions.filter(t => t.fromId === me.id || t.toId === me.id),
  };
};