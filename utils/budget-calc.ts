interface GroupBudget {
    membersBudgets: GroupMemberBudget[];
    allTransactions: BudgetTransaction[];
}

interface GroupMemberBudget {
    id: string;

    budget: number;
    expenses: number;

    overspend: AmountForMembers,
    underspend: AmountForMembers,
};

export interface BudgetTransaction {
    fromId: string;
    toId: string;
    amountCents: number;
}

export default function calculateGroupBudget(group: DbGroup): GroupBudget {
    // For each channel (= target member), calculate underspending and overspending
    const unevenBudgetCalculation: {
        forMemberId: string,
        underspending: {
            amount: number, // e.g. if the budget for this member was 100 and we spent 90, this is 10
            memberPortions: Map<string, number>, // userId -> fraction of the total budget, e.g. { "user1": 0.5, "user2": 0.5 }. Must sum to 1
        },
        overspending: {
            flexibleMembers: string[], // If I am in one of these lists, I cover (1/length) of the overspending
        },
    }[] = group.members.map((member) => {
        // Calculate underspending
        const budgetForMember = member.budget.reduce((acc, b) => acc + b.amount, 0);
        const expensesForMember = member.gifts.reduce((acc, b) => acc + b.price, 0);

        // Calculate overspending
        const membersWithFlexibleBudgetForMember = member.budget.filter(b => b.flexible).map(b => b.userId);
        if (membersWithFlexibleBudgetForMember.length === 0) {
            membersWithFlexibleBudgetForMember.push(member.responsibleMemberId);
        }

        return {
            forMemberId: member.id,
            underspending: {
                amount: Math.max(0, budgetForMember - expensesForMember), // Don't count overspending
                memberPortions: new Map(member.budget.map(b => [
                /* userId: */ b.userId,
                /* fraction: */ b.amount / budgetForMember
                ])),
            },
            overspending: {
                flexibleMembers: membersWithFlexibleBudgetForMember,
            }
        };
    });


    const membersBudgets: GroupMemberBudget[] = group.members.map((member) => {
        // Calculate overspending
        // If the group overspent for this member, this is covered by members with a flexible budget, 
        // or the one responsible member if noone has a flexible budget.

        const overspend = unevenBudgetCalculation
            .filter(m => m.overspending.flexibleMembers.includes(member.id))
            .map(({ overspending: { flexibleMembers }, forMemberId }) => {
                // If we overspent for [forMember], the group of [flexibleMembers] members covers the overspent amount.
                // This includes [member]

                const forMember = group.members.find(m => m.id == forMemberId)!;
                const budgetSumForMember = forMember
                    .budget
                    .reduce((acc, b) => acc + b.amount, 0);
                const expensesSumForMember = forMember
                    .gifts
                    // .filter(b => b.buyerId == member.id) // TODO i think this isn't necessary
                    .reduce((acc, b) => acc + b.price, 0);

                const overspendForMember = expensesSumForMember > budgetSumForMember
                    ? expensesSumForMember - budgetSumForMember
                    : 0; // Don't count underspending, it will be handled later

                const sharedOverspendAmount = overspendForMember / flexibleMembers.length;
                return {
                    amount: sharedOverspendAmount,
                    forMemberId: forMemberId,
                };
            });

        // Calculate underspending.
        // If the budget for any member is not fully spent, 
        // the remaining amount is split between all members, with respect to their budgets 
        const underspend = unevenBudgetCalculation
            .filter(m => m.underspending.memberPortions.has(member.id))
            .map(u => {
                const fraction = u.underspending.memberPortions.get(member.id)!;
                return {
                    amount: u.underspending.amount * fraction,
                    forMemberId: u.forMemberId,
                };
            });

        const memberBudget = group.members
            .reduce((acc, m) => acc + (m.budget.find(b => b.userId == member.id)?.amount ?? 0), 0);
        const memberExpenses = group.members
            .reduce((acc, m) => {
                return acc + m.gifts.filter(b => b.buyerId == member.id).reduce((acc, b) => acc + b.price, 0);
            }, 0);

        const memberBudgetInfo: GroupMemberBudget = {
            id: member.id,
            budget: memberBudget,
            expenses: memberExpenses,
            overspend: {
                amount: overspend.reduce((acc, u) => acc + u.amount, 0),
                forMemberIds: overspend.map(u => u.forMemberId),
            },
            underspend: {
                amount: underspend.reduce((acc, u) => acc + u.amount, 0),
                forMemberIds: underspend.map(u => u.forMemberId),
            }
        };
        return memberBudgetInfo;
    });

    // Sanity check
    const totalGroupBudget = membersBudgets.reduce((acc, m) => acc + m.budget + m.overspend.amount - m.underspend.amount, 0);
    const totalGroupExpenses = membersBudgets.reduce((acc, m) => acc + m.expenses, 0);

    if (Math.abs(totalGroupExpenses - totalGroupBudget) > 0.01) {
        // Should not be possible because the budget is adjusted for overspending and underspending
        console.error("Imbalanced budget, should never happen!", totalGroupBudget, totalGroupExpenses);
    }

    // Calculate transactions
    const allTransactions: BudgetTransaction[] = [];
    const adjustedMemberBudgets = membersBudgets
        .map(m => {
            const budgetCents = Math.round(100 * (m.budget - m.underspend.amount + m.overspend.amount));
            const expensesCents = Math.round(100 * m.expenses);
            return ({
                id: m.id,
                overspendCents: expensesCents - budgetCents,
            });
        });
    const adjustedMemberBudgetsByLargeUnderspend = adjustedMemberBudgets
        .toSorted((a, b) => a.overspendCents - b.overspendCents);

    adjustedMemberBudgetsByLargeUnderspend.forEach((member) => {
        let preventInfiniteLoop = 0;
        while (member.overspendCents < 0 && preventInfiniteLoop < 50) {
            preventInfiniteLoop++;
            // Finds largest overspender first
            const other = adjustedMemberBudgets
                .toSorted((a, b) => b.overspendCents - a.overspendCents)
                .find(m => m.id !== member.id && m.overspendCents > 0);
            if (!other) {
                break;
            }
            const amountCents = Math.min(-member.overspendCents, other.overspendCents);
            allTransactions.push({
                fromId: member.id,
                toId: other.id,
                amountCents: amountCents,
            });
            member.overspendCents += amountCents;
            other.overspendCents -= amountCents;
        }

        if (member.overspendCents < 0) {
            console.error("Budget not spent", member);
        }
    });

    return {
        membersBudgets,
        allTransactions,
    };
};