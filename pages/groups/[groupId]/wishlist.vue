<script lang="ts" setup>
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const groupsStore = useGroupsStore()
await useAsyncData('groups', () => groupsStore.getGroups().then(() => true))

const groups: Group[] = groupsStore.groups;
const group = groups.find(g => g.id === groupId);

</script>

<template>
  <GroupHomeNotFound v-if="!group" />
  <GroupHomeWishlist v-else :group="group" />
</template>
