<script lang="ts" setup>

import type { ChatMessage } from '~/utils/common-types';
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;
const memberId = router.currentRoute.value.params.memberId;

const store = useMyAppStore();
await useAsyncData('groups', () => store.fetch().then(() => true));

const group = store.groups.find(g => g.id === groupId)!;
const member = group.members.find(m => m.id === memberId)!;

const myId = store.myId;

const formatTime = (date: string) => {
  const givenDate = new Date(date);
  const hours = givenDate.getHours().toString().padStart(2, '0');
  const minutes = givenDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const messagesByDay = computed(() => {
  const messages = member.chat.messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const messagesByDay: ChatMessage[][] = [];

  let day: ChatMessage[] = []
  for (const message of messages) {
    if (day.length === 0 || new Date(day[0].date).getDate() === new Date(message.date).getDate()) {
      day.push(message);
    } else {
      messagesByDay.push(day);
      day = [message];
    }
  }
  return messagesByDay;
});

const formatMessageDay = (date: string) => {
  const givenDate = new Date(date);
  const now = new Date();
  if (givenDate.getDate() === now.getDate()) {
    return 'Today';
  } else if (givenDate.getDate() === now.getDate() - 1) {
    return 'Yesterday';
  } else {
    return givenDate.toLocaleDateString();
  }
};

</script>

<template>
  <MemberHome activeTab="chat">
    <div class="flex flex-col gap-6">
      <div v-for="day in messagesByDay" class="flex flex-col gap-4">
        <span class="text-sm mx-auto bg-base-300/60 rounded-md p-2 opacity-70">
          {{ formatMessageDay(day[0].date) }}
        </span>
        <div v-for="message in day" class="chat"
          :class="{ 'chat-start': message.authorId !== myId, 'chat-end': message.authorId === myId }">
          <div class="chat-header">
            {{ message.authorId === myId ? 'You' : member.name }}
            <time class="text-xs opacity-50">{{ formatTime(message.date) }}</time>
          </div>
          <div class="chat-bubble" :class="{ 'chat-bubble-primary': message.authorId === myId }">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
  </MemberHome>
</template>
