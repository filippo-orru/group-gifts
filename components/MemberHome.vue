<script lang="ts" setup>

const props = defineProps<{
  activeTab: MemberTabs;
}>();

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;
const memberId = router.currentRoute.value.params.memberId;

const groupsStore = useGroupsStore()
await useAsyncData('groups', () => groupsStore.getGroups().then(() => true))

const group = groupsStore.groups.find(g => g.id === groupId)!;
const member = group.members.find(m => m.id === memberId)!;

type MemberTabs = 'gifts' | 'chat';

const baseHref = `/groups/${groupId}/members/${memberId}/`;

const i18n = useI18n();
const tabs = {
  gifts:
  {
    title: i18n.t('memberHome.tabs.gifts'),
    href: baseHref + 'gifts',
  },
  chat: {
    title: i18n.t('memberHome.tabs.chat'),
    href: baseHref + 'chat',
  }
};


</script>

<template>
  <div class="relative h-dvh w-full flex flex-col items-stretch">
    <NavBar :title="$t('memberHome.title', [member.name])" :back="{ 'href': `/groups/${groupId}` }" />

    <GenericPanel>
      <div role="tablist" class="tabs tabs-boxed">
        <NuxtLink role="tab" class="tab flex items-center gap-2"
          :class="{ 'bg-primary text-primary-content': props.activeTab === 'gifts' }" :to="tabs.gifts.href">
          <i class="las la-gift text-xl"></i>
          {{ tabs.gifts.title }}
        </NuxtLink>
        <NuxtLink role="tab" class="tab flex items-center gap-2"
          :class="{ 'bg-primary text-primary-content': props.activeTab === 'chat' }" :to="tabs.chat.href">
          <i class="las la-comments text-xl"></i>
          {{ tabs.chat.title }}
        </NuxtLink>
      </div>
    </GenericPanel>

    <GenericPanel :disable-padding="true" class="overflow-hidden flex flex-col h-full relative">
      <slot />
    </GenericPanel>

  </div>
</template>
