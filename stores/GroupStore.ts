import { type Group, type GroupBudgetForMe, type MyBudgetTransaction, type PutTransaction, type UpdateGroup } from "~/utils/types";

export const useGroupsStore = defineStore({
  id: 'groupStore',
  state: () => ({
    groups: [] as Group[],
    budgeting: {} as { [groupId: string]: GroupBudgetForMe },
  }),
  actions: {
    async maybeGetGroup(id: string | string[]): Promise<ComputedRef<Group | undefined>> {
      await this.getGroups();
      return computed(() => this.groups.find((g) => g.id === id));
    },
    async getGroup(id: string | string[]): Promise<ComputedRef<Group>> {
      await this.getGroups();
      return computed(() => this.groups.find((g) => g.id === id)!);
    },
    async getBudgeting(groupId: string): Promise<GroupBudgetForMe> {
      const budgeting = await $fetch<GroupBudgetForMe>(`/api/groups/${groupId}/budgeting`);
      this.budgeting[groupId] = budgeting;
      return this.budgeting[groupId]!;
    },
    async getGroups({ force = false }: { force?: boolean } = {}): Promise<Group[]> {
      if (!force && this.groups.length > 0) {
        return this.groups;
      };
      const groups = await useFetch<Group[]>('/api/groups');
      this.groups = groups.data.value!;
      return this.groups;
    },
    async createGroup(body: CreateGroup): Promise<Group> {
      const [group, _] = await Promise.all([
        $fetch<Group>('/api/groups', {
          method: 'POST',
          body: body,
        }),
        new Promise((resolve) => setTimeout(resolve, 2200)), // Wait for a bit to show the loading screen
      ]);
      this.groups.push(group);
      return group;
    },
    async updateGroup(id: string, body: UpdateGroup): Promise<Group> {
      const [group, _] = await Promise.all([
        $fetch<Group>(`/api/groups/${id}`, {
          method: 'PATCH',
          body: body,
        }),
        new Promise((resolve) => setTimeout(resolve, 700))
      ]);
      const index = this.groups.findIndex((g) => g.id === id);
      this.groups[index] = group;
      return group;
    },
    async onGroupUpdate(group: Group) {
      const index = this.groups.findIndex((g) => g.id === group.id);
      this.groups[index] = group;
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
