<script lang="ts" setup>
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
  <NavBar :title="group.name" :back="{ href: '/groups', useLogo: true }" />
  <div>
      <slot />
  </div>

  <div class="btm-nav mx-auto max-w-4xl">
    <NuxtLink :to="`/groups/${groupId}`" class="" :class="{
      'active border-primary bg-primary/40 text-primary-content': tab == 'home',
      'text-primary-content': tab != 'home'
    }">
      <SvgoHome class="text-xl" />
      <span class="btm-nav-label">Home</span>
    </NuxtLink>
    <NuxtLink :to="`/groups/${groupId}/wishlist`" :class="{
      'active border-secondary bg-secondary/40 text-secondary-content': tab == 'wishlist',
      'text-secondary-content': tab != 'wishlist'
    }">
      <SvgoWishlist class="text-xl" />
      <span class="btm-nav-label">My Wishlist</span>
    </NuxtLink>
  </div>
</template>

<style></style>