<script lang="ts" setup>

const props = defineProps<{
  activeTab: MemberTabs;
}>();

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;
const memberId = router.currentRoute.value.params.memberId;

const store = useMyAppStore()
await useAsyncData('groups', () => store.fetch().then(() => true))

const group = store.groups.find(g => g.id === groupId)!;
const member = group.members.find(m => m.id === memberId)!;

type MemberTabs = 'gifts' | 'chat';

const baseHref = `/groups/${groupId}/members/${memberId}/`;

const tabs = {
  gifts:
  {
    title: 'Gifts',
    href: baseHref + 'gifts',
  },
  chat: {
    title: 'Chat',
    href: baseHref + 'chat',
  }
};


</script>

<template>
  <NavBar :title="member.name" :back="{ 'href': `/groups/${groupId}` }" />
  <GenericPanel class="flex flex-col gap-4 mb-12">
    <div role="tablist" class="tabs tabs-boxed">
      <NuxtLink role="tab" class="tab" :class="{ 'tab-active': props.activeTab === 'gifts' }" :to="tabs.gifts.href">
        {{ tabs.gifts.title }}
      </NuxtLink>
      <NuxtLink role="tab" class="tab" :class="{ 'tab-active': props.activeTab === 'chat' }" :to="tabs.chat.href">
        {{ tabs.chat.title }}
      </NuxtLink>
    </div>
    
    <slot />
  </GenericPanel>
</template>
