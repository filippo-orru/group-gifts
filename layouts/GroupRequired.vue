<script lang="ts" setup>
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const groupsStore = useGroupsStore();
const group = await groupsStore.maybeGetGroup(groupId);
</script>

<template>
  <WithLocaleHead>
    <GroupHomeNotFound v-if="!group" />
    <div v-else>
      <slot />
    </div>
  </WithLocaleHead>
</template>
