<script lang="ts" setup>

const props = defineProps<{
  activeTab: MemberTabs;
}>();

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;
const memberId = router.currentRoute.value.params.memberId;

const groupsStore = useGroupsStore()
const group = await groupsStore.getGroup(groupId);
const member = group.value.members.find(m => m.id === memberId)!;

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
    <NavBar :title="$t('memberHome.title', [member.name])" :href="`/groups/${groupId}`" />

    <GenericPanel>
      <div role="tablist" class="tabs tabs-boxed">
        <NuxtLinkLocale role="tab" class="tab flex items-center gap-2"
          :class="{ 'bg-primary text-primary-content': props.activeTab === 'gifts' }" :to="tabs.gifts.href">
          <i class="las la-gift text-xl"></i>
          {{ tabs.gifts.title }}
        </NuxtLinkLocale>
        <NuxtLinkLocale role="tab" class="tab flex items-center gap-2"
          :class="{ 'bg-primary text-primary-content': props.activeTab === 'chat' }" :to="tabs.chat.href">
          <i class="las la-comments text-xl"></i>
          {{ tabs.chat.title }}
        </NuxtLinkLocale>
      </div>
    </GenericPanel>

    <GenericPanel :disable-padding="true" class="overflow-hidden flex flex-col h-full relative">
      <slot />
    </GenericPanel>

  </div>
</template>
