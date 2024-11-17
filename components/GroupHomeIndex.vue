<script lang="ts" setup>
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;

const showInviteDialog = computed(() => router.currentRoute.value.query.invite === 'true');

const props = defineProps<{
  group: Group;
}>();
const group = props.group;

const baseHref = `/groups/${groupId}`;

interface MemberInOverview {
  member: GroupMember;

  lastMessage: ChatMessage | null; // preview
  unreadMessages: number; // badge
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
      member,
      lastMessage: getLastMessage(member),
      unreadMessages: chatMessages.filter((m) => m.authorId !== group.me.id && !m.isRead).length,
    }))
    .sort((a, b) => {
      // Compare member.joined
      if (a.member.joined < b.member.joined) return -1;
      if (a.member.joined > b.member.joined) return 1;

      // If member.joined is the same, compare lastMessage.date
      if ((a.lastMessage?.date || 0) < (b.lastMessage?.date || 0)) return -1;
      if ((a.lastMessage?.date || 0) > (b.lastMessage?.date || 0)) return 1;

      // Both are the same
      return 0;
    });
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

const hideInviteDialog = () => {
  router.push({ query: {} });
};
</script>

<template>
  <InviteFriendsModal v-if="showInviteDialog" :groupId="groupId" :onClose="hideInviteDialog" />

  <GroupHome tab="home">
    <template v-slot:actions>
      <li>
        <NuxtLink to="?invite=true">
          <i class="las la-user-plus text-xl"></i>
          Invite Friends
        </NuxtLink>
      </li>
    </template>
    <GenericPanel :disable-padding="true">
      <div class="flex flex-col">
        <!-- todo all-chat -->
        <NuxtLink v-for="(memberInGroup, index) in sortedMembers" :to="`${baseHref}/members/${memberInGroup.member.id}`"
          class="hover:bg-base-200">
          <div class="flex gap-4 items-center px-6 py-5">
            <div class="avatar">
              <div class="w-12 rounded-full outline outline-accent outline-offset-2 outline-offset-base-100"
                :class="{ 'bg-accent/30': memberInGroup.member.joined, 'outline-dashed bg-accent/50': !memberInGroup.member.joined }">
                <i class="las la-user text-3xl h-full flex items-center justify-center"></i>
              </div>
            </div>
            <div class="flex-1 w-0 flex flex-col">
              <div class="flex items-center justify-between">
                <span>
                  Gift for
                  <b>{{ memberInGroup.member.name }}</b>
                </span>
                <span v-if="memberInGroup.lastMessage" class="text-sm"
                  :class="{ 'opacity-70': memberInGroup.unreadMessages == 0, 'text-primary font-bold': memberInGroup.unreadMessages > 0 }">
                  {{ formatMessageTime(memberInGroup.lastMessage.date) }}
                </span>
              </div>
              <div class="flex flex-col text-sm text-neutral *:flex *:items-center *:gap-1">
                <div v-if="!memberInGroup.member.joined" class="">
                  <i class="las la-clock text-xl"></i>
                  <span><b>{{ memberInGroup.member.name }}</b> has not joined the group yet</span>
                </div>
                <div v-else-if="!memberInGroup.member.myBudget" class="">
                  <i class="las la-exclamation-circle text-xl"></i>
                  <span>You need to set your budget for <b>{{ memberInGroup.member.name }}</b></span>
                </div>
                <div v-else-if="memberInGroup.lastMessage" class="">
                  <i class="las la-comment-dots text-lg"></i>
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
          </div>
        </NuxtLink>
      </div>
    </GenericPanel>
  </GroupHome>
</template>

<style></style>