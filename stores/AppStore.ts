export const useMyAppStore = defineStore({
  id: 'myAppStore',
  state: () => ({
    groups: [] as Group[],
  }),
  actions: {
    async fetch({ force = false }: { force?: boolean } = {}) {
      if (!force && this.groups.length > 0) { 
        return
      };
      const groups: Group[] = await $fetch('/api/groups');
      this.groups = groups;
    },
    async createGroup(body: CreateGroup): Promise<Group> {
      const group: Group = await $fetch('/api/groups', {
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
