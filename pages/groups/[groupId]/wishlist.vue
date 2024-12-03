<script lang="ts" setup>
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const groupsStore = useGroupsStore()
const group = await groupsStore.maybeGetGroup(groupId)
</script>

<template>
  <GroupHomeNotFound v-if="!group" />
  <GroupHomeWishlist v-else :group="group" />
</template>
