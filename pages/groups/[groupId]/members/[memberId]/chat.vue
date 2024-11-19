<script lang="ts" setup>
import type { ChatMessage } from '~/utils/types';

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;
const memberId = router.currentRoute.value.params.memberId as string;

const groupsStore = useGroupsStore();
await useAsyncData('groups', () => groupsStore.getGroups().then(() => true)); // TODO test if we need useAsyncData herei
const chatStore = useChatStore();
chatStore.connect();

const group = groupsStore.groups.find(g => g.id === groupId)!;
const myId = group.me.id;

const member = group.members.find(m => m.id === memberId)!;

const { data: chatMessages, error } = await useAsyncData(
  `chatMessages-${groupId}-${memberId}`,
  () => chatStore.getChatMessages(groupId, memberId),
  { lazy: true }
);

const messageInput = useState(`messageInput-${groupId}-${memberId}`, () => '');

const sendMessage = (event: Event) => {
  if (event) event.preventDefault();

  if (messageInput.value.trim() === '') return;

  const message: ChatMessage = {
    id: 'placeholder',
    groupId: groupId,
    memberId: memberId,
    authorId: myId,
    content: messageInput.value,
    date: new Date().getTime(),
    isRead: true,
  };

  chatStore.sendChatMessage(message);
  messageInput.value = '';
  // TODO fix
  // scrollToBottom();
};
</script>

<template>
  <MemberHome activeTab="chat">
    <Transition name="fade" mode="out-in">
      <ChatView v-if="chatMessages" :chatMessages="chatMessages.value" :group="group"/>
      <div v-else class="flex-1 flex h-full items-center justify-center">
        <span v-if="error">
          <i class="las la-exclamation-triangle text-2xl"></i>
          <span class="ml-2">Failed to load chat messages. Please try again.</span>
        </span>
        <span v-else class="loading loading-spinner loading-lg text-neutral"></span>
      </div>
    </Transition>
    <div class="mx-5 mt-1 p-1 rounded-lg bg-base-200 text-center">
      <span class="hidden sm:block" >Don't worry, <b>{{ member.name }}</b> can't see this chat.</span>
      <span class="block sm:hidden"><b>{{ member.name.capitalize() }}</b> can't see this chat.</span>
    </div>
    <form @submit="sendMessage">
      <div class="flex gap-4 px-2 pt-2 pb-4">
        <input class="input input-bordered flex-grow" placeholder="Type a message..." v-model="messageInput" />
        <button class="btn btn-primary" @click="sendMessage">
          <i class="las la-paper-plane text-xl"></i>
        </button>
      </div>
    </form>
  </MemberHome>
</template>
