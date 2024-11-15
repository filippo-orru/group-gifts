<script lang="ts" setup>
const props = defineProps<{
  group: Group;
}>();
</script>

<template>
  <GroupHome tab="wishlist">
    <h1>My Wishlist</h1>
    <span>{{ group.members.find(m => m.id == group.me.id)!.wishlist.join(", ") }}</span>
  </GroupHome>
</template>

<style></style>