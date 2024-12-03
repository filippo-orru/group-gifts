<script lang="ts" setup>
import '~/utils/extensions';

definePageMeta({
  layout: 'group-required',
})

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;

const groupsStore = useGroupsStore()
const group = await groupsStore.getGroup(groupId);

const showInviteDialog = computed(() => router.currentRoute.value.query.invite === 'true');

const chatStore = useChatStore();

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

  return (group.value?.members ?? [])
    .filter(member => member.id !== group.value.me.id)
    .map((member) => ({
      member,
      lastMessage: getLastMessage(member),
      unreadMessages: chatMessages.filter((m) => m.authorId !== group.value.me.id && !m.isRead).length,
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

const notJoinedMembers = computed(() => group.value.members.filter(m => !m.joined));
</script>

<template>
  <Transition>
    <InviteFriendsModal v-if="showInviteDialog" :invite-id="group.inviteId" :onClose="hideInviteDialog" />
  </Transition>

  <GroupHome tab="home">
    <template v-slot:actions>
      <li>
        <NuxtLink to="?invite=true">
          <i class="las la-user-plus text-xl"></i>
          {{ $t('groupHome.actions.invite') }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLinkLocale :to="`${baseHref}/settings`">
          <i class="las la-cog text-xl"></i>
          {{ $t('groupHome.actions.settings') }}
        </NuxtLinkLocale>
      </li>
      <li>
        <NuxtLinkLocale :to="`/invite/${group.inviteId}?changeMember=1`">
          <i class="las la-user-times text-xl"></i>
          {{ $t('groupHome.actions.changeMember') }}
        </NuxtLinkLocale>
      </li>
    </template>

    <GenericPanel :disable-padding="true" class="px-3 pt-3 flex flex-col">
      <div v-if="notJoinedMembers.length > 0"
        class="flex items-center gap-3 mb-3 px-3 py-1 rounded-lg bg-base-200 text-start">
        <i class="las la-clock text-xl"></i>
        <i18n-t keypath="groupHome.memberNotJoined" tag="span" :plural="notJoinedMembers.length">
          <b>{{ formatEnumeration(notJoinedMembers.map(m => m.name.capitalize())) }}</b>
        </i18n-t>
      </div>

      <EnableNotifications />

      <!-- todo all-chat -->
      
      <NuxtLinkLocale :to="`${baseHref}/wishlist`" class="rounded-lg hover:bg-base-200">
        <div class="flex gap-4 items-center px-6 py-5">
          <div class="avatar">
            <div class="w-12 rounded-full outline outline-accent outline-offset-2 outline-offset-base-100 bg-accent/30 text-base-content/90">
              <i class="las la-gifts text-3xl h-full flex items-center justify-center"></i>
            </div>
          </div>
          <div class="flex-1 w-0 flex flex-col">
            <div class="flex flex-wrap items-start items-center">
              <span class="mr-2">
                <i18n-t keypath="groupHome.giftForYou">
                  <b>{{ group.me.name }}</b>
                </i18n-t>
              </span>
            </div>
          </div>
        </div>
      </NuxtLinkLocale>
      <NuxtLinkLocale v-for="(memberInGroup, index) in sortedMembers"
        :to="`${baseHref}/members/${memberInGroup.member.id}/gifts`" class="rounded-lg hover:bg-base-200">
        <div class="flex gap-4 items-center px-6 py-5">
          <div class="avatar">
            <div class="w-12 rounded-full outline outline-accent outline-offset-2 outline-offset-base-100"
              :class="{ 'bg-accent/30 text-base-content/90': memberInGroup.member.joined, 'outline-dashed bg-accent/50 text-base-content/50': !memberInGroup.member.joined }">
              <i class="las la-user text-3xl h-full flex items-center justify-center"></i>
            </div>
          </div>
          <div class="flex-1 w-0 flex flex-col">
            <div class="flex flex-wrap items-start items-center">
              <span class="mr-2">
                <i18n-t keypath="groupHome.giftFor">
                  <b>{{ memberInGroup.member.name }}</b>
                </i18n-t>
              </span>
              <span v-if="memberInGroup.member.responsibleMemberId == group.me.id"
                class="badge badge-accent overflow-hidden whitespace-nowrap flex justify-start">
                <i class="las la-gift"></i>&nbsp;
                {{ $t('groupHome.youAreResponsible') }}
              </span>
              <span v-if="memberInGroup.lastMessage" class="ml-auto text-sm"
                :class="{ 'opacity-70': memberInGroup.unreadMessages == 0, 'text-primary font-bold': memberInGroup.unreadMessages > 0 }">
                {{ formatMessageTime(memberInGroup.lastMessage.date) }}
              </span>
            </div>
            <div class="flex flex-col text-sm text-neutral *:flex *:items-center *:gap-1">
              <div v-if="memberInGroup.member.myBudget === null" class="">
                <i class="las la-exclamation-circle text-xl"></i>
                <i18n-t keypath="groupHome.memberNoBudget" tag="span">
                  <b>{{ memberInGroup.member.name.capitalize() }}</b>
                </i18n-t>
              </div>
              <div v-else-if="memberInGroup.lastMessage" class="">
                <i class="las la-comment-dots text-lg"></i>
                <b>
                  {{ memberInGroup.lastMessage.authorId == group.me.id ?
                    $t('general.you') : group.members.find(m => m.id == memberInGroup.lastMessage!.authorId)!.name }}:
                </b>
                <div class="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {{ memberInGroup.lastMessage.content }}
                </div>
                <div v-if="memberInGroup.unreadMessages > 0" class="ml-auto badge badge-accent">
                  {{ memberInGroup.unreadMessages }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </NuxtLinkLocale>
    </GenericPanel>
  </GroupHome>
</template>

<style></style>