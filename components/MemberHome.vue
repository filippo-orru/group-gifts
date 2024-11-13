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
  <div class="relative h-screen w-full flex flex-col items-stretch">
    <NavBar :title="'Gift for ' + member.name" :back="{ 'href': `/groups/${groupId}` }" />
    <GenericPanel>
      <div role="tablist" class="tabs tabs-boxed">
        <NuxtLink role="tab" class="tab" :class="{ 'bg-primary text-primary-content': props.activeTab === 'gifts' }" :to="tabs.gifts.href">
          {{ tabs.gifts.title }}
        </NuxtLink>
        <NuxtLink role="tab" class="tab" :class="{ 'bg-primary text-primary-content': props.activeTab === 'chat' }" :to="tabs.chat.href">
          {{ tabs.chat.title }}
        </NuxtLink>
      </div>
    </GenericPanel>

    <GenericPanel :disable-padding="true" class="overflow-hidden flex flex-col h-full">
      <slot />
    </GenericPanel>
  </div>
</template>
