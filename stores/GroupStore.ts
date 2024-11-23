import { type GroupBudgetForMe, type MyBudgetTransaction, type PutTransaction } from "~/utils/types";

export const useGroupsStore = defineStore({
  id: 'groupStore',
  state: () => ({
    groups: [] as Group[],
    budgeting: {} as { [groupId: string]: GroupBudgetForMe },
  }),
  actions: {
    async getGroup(id: string): Promise<Group | undefined> {
      await useAsyncData('groups', () => this.getGroups());
      return this.groups.find((g) => g.id === id);
    },
    async getBudgeting(groupId: string): Promise<GroupBudgetForMe> {
      const budgeting = await $fetch<GroupBudgetForMe>(`/api/groups/${groupId}/budgeting`);
      this.budgeting[groupId] = budgeting;
      return this.budgeting[groupId]!;
    },
    async getGroups({ force = false }: { force?: boolean } = {}) {
      if (!force && this.groups.length > 0) {
        return
      };
      const groups = await $fetch<Group[]>('/api/groups');
      this.groups = groups;
      return groups;
    },
    async createGroup(body: CreateGroup): Promise<Group> {
      const group = await $fetch<Group>('/api/groups', {
        method: 'POST',
        body: body,
      });
      this.groups.push(group);
      return group;
    },
    async deleteGroup(id: string): Promise<void> {
      await $fetch(`/api/groups/${id}`, {
        method: 'DELETE',
      });
      this.groups = this.groups.filter((g) => g.id !== id);
    },
    async updateMemberBudget(groupId: string, memberId: string, body: PutBudget) {
      const group = await $fetch<Group>(`/api/groups/${groupId}/members/${memberId}/budget`, {
        method: 'PUT',
        body: body,
      });
      const index = this.groups.findIndex((g) => g.id === groupId);
      this.groups[index] = group;
    },
    async toggleTransactionCompleted(groupId: string, transaction: MyBudgetTransaction) {
      const transactionId = getTransactionId(transaction);
      const body: PutTransaction = {
        completed: !transaction.completed
      };
      await $fetch<Group>(`/api/groups/${groupId}/transactions/${transactionId}`, {
        method: 'PUT',
        body: body,
      });
      transaction.completed = !transaction.completed;
    },
    async updateBudgetForAll(groupId: string, body: PutBudget) {
      const group = await $fetch<Group>(`/api/groups/${groupId}/budget`, {
        method: 'PUT',
        body: body,
      });
      const index = this.groups.findIndex((g) => g.id === groupId);
      this.groups[index] = group;
    }
  }
})
