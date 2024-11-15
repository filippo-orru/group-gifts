<script lang="ts" setup>
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const props = defineProps<{
  group: Group;
}>();
const group = props.group;

const baseHref = `/groups/${groupId}`;

type MemberInOverview = {
  member: GroupMember;
  lastMessage: ChatMessage | null;
  unreadMessages: number;
}

const getLastMessage = (member: GroupMember): ChatMessage | null => {
  const chatMessages: ChatMessage[] = []; // TODO

  const sortedMessages = chatMessages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const lastMessage = sortedMessages[chatMessages.length - 1];
  if (!lastMessage) return null;

  return lastMessage;
};

const sortedMembers: ComputedRef<MemberInOverview[]> = computed(() => {
  const chatMessages: ChatMessage[] = []; // TODO

  return (group?.members ?? [])
    .filter(member => member.id !== group.me.id)
    .map((member) => ({
      member: member,
      lastMessage: getLastMessage(member),
      unreadMessages: chatMessages.filter((m) => m.authorId !== group.me.id && !m.isRead).length
    }))
    .sort((a, b) => a.lastMessage && b.lastMessage ?
      b?.lastMessage.date - a?.lastMessage.date :
      a.lastMessage ? -1 : b.lastMessage ? 1 : 0
    );
}
);

const formatMessageTime = (date: number) => {
  const givenDate = new Date(date);
  const now = new Date();
  if (givenDate.getDate() === now.getDate()) {
    const givenDate = new Date(date);
    const hours = givenDate.getHours().toString().padStart(2, '0');
    const minutes = givenDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } else if (new Date(now.setDate(now.getDate() - 1)).toDateString() === givenDate.toDateString()) {
    return 'Yesterday';
  } else {
    return givenDate.toLocaleDateString();
  }
};
</script>

<template>
  <GroupHome tab="home">
    <GenericPanel :disable-padding="true">
      <div class="flex flex-col">
        <!-- todo all-chat -->
        <NuxtLink v-for="(memberInGroup, index) in sortedMembers" :to="`${baseHref}/members/${memberInGroup.member.id}`"
          class="hover:bg-base-200">
          <div class="flex gap-4 items-center px-6 py-4">
            <div
              class="rounded-full border border-secondary bg-secondary/30 w-8 h-8 flex items-center justify-center flex-shrink-0">
              <i class="las la-user text-xl"></i>
            </div>
            <div class="flex-1 w-0 flex flex-col">
              <div class="flex items-center justify-between">
                <span>Gift for {{ memberInGroup.member.name }}</span>
                <span v-if="memberInGroup.lastMessage" class="text-sm"
                  :class="{ 'opacity-70': memberInGroup.unreadMessages == 0, 'text-primary font-bold': memberInGroup.unreadMessages > 0 }">
                  {{ formatMessageTime(memberInGroup.lastMessage.date) }}
                </span>
              </div>
              <div v-if="memberInGroup.lastMessage" class="text-sm text-neutral flex items-center gap-1">
                <i class="las la-comment-dots"></i>
                <b>
                  {{ memberInGroup.lastMessage.authorId == group.me.id ?
                    'You' : group.members.find(m => m.id == memberInGroup.lastMessage!.authorId)!.name }}:
                </b>
                <div class="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {{ memberInGroup.lastMessage.content }}
                </div>
                <div v-if="memberInGroup.unreadMessages > 0" class="ml-auto badge badge-secondary">
                  {{ memberInGroup.unreadMessages }}
                </div>
              </div>
            </div>
          </div>
          <hr class="border" v-if="index < (group.members.length - 1)" />
        </NuxtLink>
      </div>
    </GenericPanel>
  </GroupHome>
</template>

<style></style>