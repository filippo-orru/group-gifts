export const useMyAppStore = defineStore({
  id: 'myAppStore',
  state: () => ({
    myId: 'mem-0',
    groups: [] as GroupInfo[],
  }),
  actions: {
    async fetch({ force = false }: { force?: boolean } = {}) {
      if (!force && this.groups.length > 0) { 
        return
      };
      const groups: GroupInfo[] = await $fetch('/api/me/groups');
      this.groups = groups;
    }
  }
})
