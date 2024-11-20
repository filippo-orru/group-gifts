import { expect, test, describe } from 'vitest'
import type { DbGroupMember } from '~/server/models/groups.schema';
import calculateGroupBudget, { type BudgetTransaction } from '../utils/budget-calc';

const demoMember = (index: number, length: number): DbGroupMember => {
    const others = Array.from({ length: length - 1 }, (_, i) => (index + i + 1) % length);
    return ({
        id: index.toString(),
        name: index.toString(),
        responsibleMemberId: ((index + 1) % length).toString(),
        wishlist: [],
        budget: others.map(i => ({
            userId: i.toString(),
            amount: 100,
            flexible: false,
        })),
        gifts: others.map(i => ({
            id: 'g-' + i.toString(),
            name: 'g-' + i.toString(),
            date: new Date(0),
            buyerId: i.toString(),
            price: 100,
        })),
    });
};

const demoGroup = (): DbGroup => ({
    name: 'demo',
    inviteId: '',
    date: new Date(0),
    members: [
        demoMember(0, 3),
        demoMember(1, 3),
        demoMember(2, 3),
    ]
});

describe('budget calculation', () => {
    test('basic', () => {
        const group = demoGroup();
        const budget = calculateGroupBudget(group);

        for (const member of budget.membersBudgets) {
            expect(member.budget).toBe(member.expenses);
            expect(member.overspend.amount).toBe(0);
            expect(member.underspend.amount).toBe(0);
        }
    })

    test('overspending', () => {
        const group = demoGroup();
        group.members[0].gifts[0].price = 200;
        const budget = calculateGroupBudget(group);

        expect(budget.membersBudgets[0].overspend.amount).toBe(0);
        expect(budget.membersBudgets[1].overspend.amount).toBe(100);
        expect(budget.membersBudgets[2].overspend.amount).toBe(0);
    })

    test('underspending', () => {
        const group = demoGroup();
        group.members[0].gifts[0].price = 50;
        const budget = calculateGroupBudget(group);

        expect(budget.membersBudgets[0].underspend.amount).toBe(0);
        expect(budget.membersBudgets[1].underspend.amount).toBe(25);
        expect(budget.membersBudgets[2].underspend.amount).toBe(25);
    });

    test('overspending with one flexible budget', () => {
        const group = demoGroup();
        group.members[0].budget[1].flexible = true; // member '2' has a flexible budget for member '0'
        group.members[0].gifts[0].price = 200;
        const budget = calculateGroupBudget(group);

        expect(budget.membersBudgets[0].overspend.amount).toBe(0);
        expect(budget.membersBudgets[1].overspend.amount).toBe(0);
        expect(budget.membersBudgets[2].overspend.amount).toBe(100);
    })

    test('overspending with two flexible budgets', () => {
        const group = demoGroup();
        group.members[0].budget[0].flexible = true; // member '1' has a flexible budget for member '0'
        group.members[0].budget[1].flexible = true; // member '2' has a flexible budget for member '0'
        group.members[0].gifts[0].price = 200;
        const budget = calculateGroupBudget(group);

        expect(budget.membersBudgets[0].overspend.amount).toBe(0);
        expect(budget.membersBudgets[1].overspend.amount).toBe(100 / 2);
        expect(budget.membersBudgets[2].overspend.amount).toBe(100 / 2);
    })

    test('overspending with underspending', () => {
        const group = demoGroup();
        group.members[0].gifts[0].price = 50;
        group.members[1].gifts[0].price = 200;
        const budget = calculateGroupBudget(group);

        expect(budget.membersBudgets[0].overspend.amount).toBe(0); // not responsible for overspending of member 1
        expect(budget.membersBudgets[0].underspend.amount).toBe(0); // does not get any underspending for itself
        expect(budget.membersBudgets[1].overspend.amount).toBe(0); // not responsible for overspending on itself
        expect(budget.membersBudgets[1].underspend.amount).toBe(50 / 2); // gets half of the underspending of member 0
        expect(budget.membersBudgets[2].overspend.amount).toBe(100); // not responsible for overspending of member 1
        expect(budget.membersBudgets[2].underspend.amount).toBe(50 / 2); // gets half of the underspending of member 0
    })

    test('uneven underspending', () => {
        const group = demoGroup();
        group.members[0].gifts[0].price = 50; // total expenses of 150
        group.members[0].budget[0].amount = 900; // member 1 has a high budget and should get 90% of the underspending
        group.members[0].budget[1].amount = 100; // member 2 has a low budget and should get 10% of the underspending
        // total budget is 1000

        const budget = calculateGroupBudget(group);

        expect(budget.membersBudgets[0].overspend.amount).toBe(0);
        expect(budget.membersBudgets[0].underspend.amount).toBe(0);

        expect(budget.membersBudgets[1].overspend.amount).toBe(0);
        expect(budget.membersBudgets[1].underspend.amount).toBe((1000 - 150) * 0.9);
        expect(budget.membersBudgets[2].overspend.amount).toBe(0);
        expect(budget.membersBudgets[2].underspend.amount).toBe((1000 - 150) * 0.1);
    });

    test('overspending with underspending and flexible budgets', () => {
        const group = demoGroup();
        group.members[0].gifts[0].price = 50; // total expenses 150, budget 200
        group.members[0].budget[0].flexible = true; // member '1' has a flexible budget for member '0'

        group.members[1].gifts[0].price = 200; // total expenses 300, budget 200

        const budget = calculateGroupBudget(group);

        expect(budget.membersBudgets[0].overspend.amount).toBe(0);
        expect(budget.membersBudgets[0].underspend.amount).toBe(0);
        expect(budget.membersBudgets[1].overspend.amount).toBe(0);
        expect(budget.membersBudgets[1].underspend.amount).toBe(50 / 2);
        expect(budget.membersBudgets[2].overspend.amount).toBe(100);
        expect(budget.membersBudgets[2].underspend.amount).toBe(50 / 2);
    });

    test('floats', () => {
        const group = demoGroup();
        group.members[0].gifts[0].price = 50.5; // bought by '1' for '0'
        group.members[0].budget[1].amount = 66;

        const budget = calculateGroupBudget(group);

        console.log(budget.membersBudgets); // TODO

        expect(budget.membersBudgets[0].overspend.amount).toBe(0); 
        expect(budget.membersBudgets[0].underspend.amount).toBe(0);
        expect(budget.membersBudgets[1].overspend.amount).toBe(0);
        expect(budget.membersBudgets[1].underspend.amount).toBe((66 - 50.5) / 2);
        expect(budget.membersBudgets[2].overspend.amount).toBe(0);
        expect(budget.membersBudgets[2].underspend.amount).toBe((66 - 50.5) / 2);
    });
});

// MARK: Transactions

describe('transactions', () => {
    test('basic', () => {
        const group = demoGroup();
        const budget = calculateGroupBudget(group);
        expect(budget.allTransactions).toHaveLength(0);
    });

    test('overspending', () => {
        const group = demoGroup();
        group.members[0].gifts[0].price = 200;
        const budget = calculateGroupBudget(group);

        expect(budget.allTransactions).toHaveLength(0);
    });

    test('underspending', () => {
        const group = demoGroup();
        group.members[0].gifts[0].price = 50; // bought by '1' for '0'
        // total expenses 150, budget 200 -> 50 underspending split between '1' and '2'
        const budget = calculateGroupBudget(group);


        expect(budget.allTransactions).toHaveLength(1);
        expect(budget.allTransactions).toContainEqual<BudgetTransaction>({
            fromId: '1', toId: '2', amountCents: 2500
        });
    });

    test('overspending with one flexible budget', () => {
        const group = demoGroup();
        group.members[0].budget[1].flexible = true; // member '2' has a flexible budget for member '0'
        group.members[0].gifts[0].price = 200; // bought by '1' for '0'
        const budget = calculateGroupBudget(group);

        expect(budget.allTransactions).toHaveLength(1);
        expect(budget.allTransactions).toContainEqual<BudgetTransaction>({
            fromId: '2', toId: '1', amountCents: 100 * 100
        });
    });

    test('overspending with two flexible budgets', () => {
        const group = demoGroup();
        group.members[0].budget[0].flexible = true; // member '1' has a flexible budget for member '0'
        group.members[0].budget[1].flexible = true; // member '2' has a flexible budget for member '0'
        group.members[0].gifts[0].price = 200; // bought by '1' for '0'
        // total expenses 300, budget 200 -> 100 overspending split between '1' and '2'
        const budget = calculateGroupBudget(group);

        expect(budget.allTransactions).toHaveLength(1);
        expect(budget.allTransactions).toContainEqual<BudgetTransaction>({
            fromId: '2', toId: '1', amountCents: 50 * 100
        });
    });

    test('circular transactions', () => {
        const group = demoGroup();
        group.members[0].gifts[0].buyerId = '1';
        group.members[0].gifts[1].buyerId = '1';
        group.members[1].gifts[0].buyerId = '0';
        group.members[1].gifts[1].buyerId = '0';
        group.members[2].gifts.pop();
        group.members[2].gifts.pop();

        const budget = calculateGroupBudget(group);

        expect(budget.allTransactions).toHaveLength(2);
        expect(budget.allTransactions).toContainEqual<BudgetTransaction>({
            fromId: '2', toId: '0', amountCents: 100 * 100
        });
        expect(budget.allTransactions).toContainEqual<BudgetTransaction>({
            fromId: '2', toId: '1', amountCents: 100 * 100
        });
    });

    test('floats', () => {
        const group = demoGroup();
        group.members[0].gifts[0].price = 50.5; // bought by '1' for '0'
        group.members[0].budget[1].amount = 66;
        // total expenses 150.5, budget 166 -> 15.5 underspending split between '1' and '2'

        const budget = calculateGroupBudget(group);

        console.log(budget.allTransactions);  // TODO

        expect(budget.allTransactions).toHaveLength(1);
        expect(budget.allTransactions).toContainEqual<BudgetTransaction>({
            fromId: '1', toId: '2', amountCents: (66 - 50.5) / 2 * 100
        });
    });
});