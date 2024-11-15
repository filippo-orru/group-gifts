<script lang="ts" setup>
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const store = useMyAppStore()
await useAsyncData('groups', () => store.fetch().then(() => true))

const groups: Group[] = store.groups;
const group = groups.find(g => g.id === groupId);

</script>

<template>
  <GroupHomeNotFound v-if="!group" />
  <GroupHomeIndex v-else :group="group" />
</template>
