<script lang="ts" setup>
const props = defineProps<{
  chatMessages: ChatMessage[],
  group: Group,
}>();

const chatStore = useChatStore();

const messagesByDayByAuthor = computed(() => {
  const messages = props.chatMessages.sort((a, b) => a.date - b.date);
  // console.log("messages", messages);
  const messagesByDayByAuthor: ChatMessage[][][] = [];

  let messageClusters: ChatMessage[][] = [];
  let messageGroupSingleAuthor: ChatMessage[] = [];
  for (const message of messages) {
    if (messageGroupSingleAuthor.length === 0) {
      messageGroupSingleAuthor.push(message);
    } else {
      const messageDate = new Date(message.date);

      const firstMessage = messageGroupSingleAuthor[0];
      const firstMessageDate = new Date(firstMessage.date);

      if (firstMessageDate.toDateString() !== messageDate.toDateString()) {
        // Different day
        messageClusters.push(messageGroupSingleAuthor);
        messagesByDayByAuthor.push(messageClusters);
        messageClusters = [];

        messageGroupSingleAuthor = [message];
      } else if (firstMessage.authorId === message.authorId) {
        // Same author
        if (messageDate.getTime() - firstMessageDate.getTime() < 1000 * 60 * 10) {
          // Only group messages that were sent within 10 minutes
          messageGroupSingleAuthor.push(message);
        } else {
          messageClusters.push(messageGroupSingleAuthor);
          messageGroupSingleAuthor = [message];
        }
      } else {
        messageClusters.push(messageGroupSingleAuthor);
        messageGroupSingleAuthor = [message];
      }
    }
  }

  if (messageGroupSingleAuthor.length > 0) {
    messageClusters.push(messageGroupSingleAuthor);
  }
  if (messageClusters.length > 0) {
    messagesByDayByAuthor.push(messageClusters);
  }

  // console.log("messagesByDayByAuthor", messagesByDayByAuthor);
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
  <div class="flex-1 overflow-hidden">
    <div class="flex flex-col gap-6 h-full overflow-y-scroll" :class="{ 'invisible': !viewportReady }"
      ref="scrollViewport">
      <div class="px-1 py-3">
        <div v-for="day in messagesByDayByAuthor" class="flex flex-col">
          <span class="text-sm mx-auto bg-base-300/60 rounded-md mt-3 p-2 opacity-70">
            {{ formatMessageDay(day[0][0].date) }}
          </span>
          <div v-for="messagesBySameAuthor in day" class="chat"
            :class="isMe(messagesBySameAuthor[0].authorId) ? 'chat-end': 'chat-start'">
            <div class="chat-header">
              {{
                isMe(messagesBySameAuthor[0].authorId)
                  ? 'You'
                  : group.members.find(m => m.id == messagesBySameAuthor[0].authorId)!.name
              }}
              <time class="text-xs opacity-50">{{ formatTime(messagesBySameAuthor[0].date) }}</time>
            </div>

            <div v-for="(message, index) in messagesBySameAuthor" class="chat-bubble" :class="{
              'chat-bubble-primary': isMe(message.authorId),
              'before:hidden mb-1': index < messagesBySameAuthor.length - 1,
              
              '!rounded-se-md': isMe(message.authorId) && messagesBySameAuthor.length > 1 && index > 0, // Top right (me)
              '!rounded-ee-md': isMe(message.authorId) && messagesBySameAuthor.length > 1 && index < messagesBySameAuthor.length - 1, // Bottom right (me)

              '!rounded-ss-md': !isMe(message.authorId) && messagesBySameAuthor.length > 1 && index > 0, // Top left (other)
              '!rounded-es-md': !isMe(message.authorId) && messagesBySameAuthor.length > 1 && index < messagesBySameAuthor.length - 1, // Bottom left (other)
            }">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="chatStore.connectionState !== 'OPEN' && chatStore.retryCount > 1"
        class="absolute top-0 left-0 right-0 flex justify-center">
        <div class="rounded-full bg-accent text-accent-content shadow-lg px-4 py-2 text-center">
          <i class="las la-exclamation-triangle text-lg"></i>
          <span class="ml-2">No connection. Retrying...</span>
        </div>
      </div>
    </Transition>
  </div>
</template>
