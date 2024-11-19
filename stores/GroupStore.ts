export const useGroupsStore = defineStore({
  id: 'groupStore',
  state: () => ({
    groups: [] as Group[],
    budgeting: {} as { [groupId: string]: GroupBudgeting },
  }),
  actions: {
    async getGroup(id: string): Promise<Group | undefined> {
      await useAsyncData('groups', () => this.getGroups());
      return this.groups.find((g) => g.id === id);
    },
    async getBudgeting(groupId: string): Promise<GroupBudgeting> {
      const budgeting = await $fetch<GroupBudgeting>(`/api/groups/${groupId}/budgeting`);
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
  }
})
