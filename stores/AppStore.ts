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
    }
  }
})
