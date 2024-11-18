<script lang="ts" setup>
const props = defineProps<{
  chatMessages: ChatMessage[],
  group: Group,
}>();

const chatStore = useChatStore();
chatStore.connect();

const messagesByDayByAuthor = computed(() => {
  const messages = props.chatMessages.sort((a, b) => a.date - b.date);
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

const isMe = (id: string) => id === props.group.me.id;

onMounted(() => {
  scrollToBottom();
});

onActivated(() => {
  scrollToBottom();
});

const previousMessages = ref<ChatMessage[]>([]);

onUpdated(() => {
  if (previousMessages.value.length !== props.chatMessages.length) {
    scrollToBottom();
    previousMessages.value = props.chatMessages;
  }
});
</script>

<template>
  <div>
    <div class="flex-1 flex flex-col gap-6 h-full overflow-y-scroll" :class="{ 'invisible': !viewportReady }"
      ref="scrollViewport">
      <div class="px-1 py-3">
        <div v-for="day in messagesByDayByAuthor" class="flex flex-col">
          <span class="text-sm mx-auto bg-base-300/60 rounded-md mt-3 p-2 opacity-70">
            {{ formatMessageDay(day[0][0].date) }}
          </span>
          <div v-for="messagesBySameAuthor in day" class="chat"
            :class="{ 'chat-start': !isMe(messagesBySameAuthor[0].authorId), 'chat-end': isMe(messagesBySameAuthor[0].authorId) }">
            <div class="chat-header">
              {{
                isMe(messagesBySameAuthor[0].authorId)
                  ? 'You'
                  : group.members.find(m => m.id == messagesBySameAuthor[0].authorId)!.name
              }}
              <time class="text-xs opacity-50">{{ formatTime(messagesBySameAuthor[0].date) }}</time>
            </div>

            <div v-for="(message, index) in messagesBySameAuthor" class="chat-bubble"
              :class="{ 'chat-bubble-primary': isMe(message.authorId), 'mb-1': index < messagesBySameAuthor.length - 1 }">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="chatStore.connectionState !== 'OPEN'" class="absolute top-0 left-0 right-0 flex justify-center">
        <div class="rounded-full bg-accent text-accent-content shadow-lg px-4 py-2 text-center">
          <i class="las la-exclamation-triangle text-lg"></i>
          <span class="ml-2">No connection. Retrying...</span>
        </div>
      </div>
    </Transition>
  </div>
</template>
