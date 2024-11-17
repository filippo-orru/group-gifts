<script lang="ts" setup>
import type { ChatMessage } from '~/utils/types';

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;
const memberId = router.currentRoute.value.params.memberId as string;

const store = useMyAppStore();
await useAsyncData('groups', () => store.fetch().then(() => true));

await store.init();

const group = store.groups.find(g => g.id === groupId)!;
const myId = group.me.id;

const formatTime = (date: number) => {
  const givenDate = new Date(date);
  const hours = givenDate.getHours().toString().padStart(2, '0');
  const minutes = givenDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const messagesByDayByAuthor = computed(() => {
  const chatMessages: ChatMessage[] = store.chatMessages.filter(m => m.groupId === groupId && m.memberId === memberId);

  const messages = chatMessages.sort((a, b) => a.date - b.date);
  // console.log("messages", messages);
  const messagesByDayByAuthor: ChatMessage[][][] = [];

  let day: ChatMessage[][] = [];
  let messagesByAuthor: ChatMessage[] = [];
  for (const message of messages) {
    if (messagesByAuthor.length === 0) {
      messagesByAuthor.push(message);
    } else {
      const messageDate = new Date(message.date);
      const lastMessage = messagesByAuthor[messagesByAuthor.length - 1];
      const lastMessageDate = new Date(lastMessage.date);
      if (lastMessageDate.toDateString() === messageDate.toDateString() && // Same day
        messageDate.getTime() - lastMessageDate.getTime() < 1000 * 60 * 60) { // Less than an hour apart

        if (lastMessage.authorId === message.authorId) {
          messagesByAuthor.push(message);
        } else {
          day.push(messagesByAuthor);
          messagesByAuthor = [message];
        }
      } else {
        day.push(messagesByAuthor);
        messagesByDayByAuthor.push(day);
        day = [];

        messagesByAuthor = [message];
      }
    }
  }
  if (messagesByAuthor.length > 0) {
    day.push(messagesByAuthor);
  }
  if (day.length > 0) {
    messagesByDayByAuthor.push(day);
  }
  return messagesByDayByAuthor;
});

const scrollViewport: Ref<HTMLElement | null> = ref(null);
const viewportReady = ref(false);

const scrollToBottom = () => {
  nextTick(() => {
    const element = scrollViewport.value;
    if (element) {
      element.scrollTop = element.scrollHeight;
      viewportReady.value = true;
    } else {
      console.error('scrollViewport is not ready');
    }
  });
}

onMounted(() => {
  scrollToBottom();
});

onActivated(() => {
  scrollToBottom();
});

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

  store.sendChatMessage(message);
  messageInput.value = '';
  scrollToBottom();
};

</script>

<template>
  <MemberHome activeTab="chat">
    <div class="flex-1 flex flex-col gap-6 h-full overflow-y-scroll" :class="{ 'invisible': !viewportReady }"
      ref="scrollViewport">
      <div class="px-1 py-3">
        <div v-for="day in messagesByDayByAuthor" class="flex flex-col">
          <span class="text-sm mx-auto bg-base-300/60 rounded-md mt-3 p-2 opacity-70">
            {{ formatMessageDay(day[0][0].date) }}
          </span>
          <div v-for="messagesBySameAuthor in day" class="chat"
            :class="{ 'chat-start': messagesBySameAuthor[0].authorId !== myId, 'chat-end': messagesBySameAuthor[0].authorId === myId }">
            <div class="chat-header">
              {{ messagesBySameAuthor[0].authorId === myId ? 'You' :
                group.members.find(m => m.id == messagesBySameAuthor[0].authorId)!.name }}
              <time class="text-xs opacity-50">{{ formatTime(messagesBySameAuthor[0].date) }}</time>
            </div>

            <div v-for="(message, index) in messagesBySameAuthor" class="chat-bubble"
              :class="{ 'chat-bubble-primary': message.authorId === myId, 'mb-1': index < messagesBySameAuthor.length - 1 }">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
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
