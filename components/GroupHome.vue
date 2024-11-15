<script lang="ts" setup>
export type GroupTab = "home" | "wishlist";

const props = defineProps<{
  tab: GroupTab;
}>();

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const store = useMyAppStore()
await useAsyncData('groups', () => store.fetch().then(() => true))

const group = store.groups.find(g => g.id === groupId)!;

</script>

<template>
  <div class="h-screen w-full flex flex-col">
    <NavBar :title="group.name" :back="{ href: '/groups', useLogo: true }" />
    <div class="grow overflow-y-scroll">
      <slot />
    </div>

    <GenericPanel class="">
      <div role="tablist" class="tabs tabs-boxed">
        <NuxtLink role="tab" class="tab" :class="{ 'bg-primary text-primary-content': tab == 'home' }"
          :to="`/groups/${groupId}`">
          <i class="las la-home text-lg mr-2"></i>
          Home
        </NuxtLink>
        <NuxtLink role="tab" class="tab" :class="{ 'bg-primary text-primary-content': tab == 'wishlist' }"
          :to="`/groups/${groupId}/wishlist`">
          <i class="las la-gift text-lg mr-2"></i>
          My Wishlist
        </NuxtLink>
      </div>
    </GenericPanel>
  </div>
</template>

<style></style>