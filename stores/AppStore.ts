import { wsSend } from "~/utils/websocket-client";

export const useMyAppStore = defineStore({
  id: 'myAppStore',
  state: () => ({
    groups: [] as Group[],
    chatMessages: [] as ChatMessage[],
  }),
  actions: {
    async init() {
      // TODO reconnect on fail
      await wsConnect({force: false});
    },
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
    receivedChatMessage(message: ChatMessage) {
      this.chatMessages.push(message);
    },
    sendChatMessage(message: ChatMessage) { 
      wsSend({ id: 'sendChatMessage', message });
    }
  }
})
