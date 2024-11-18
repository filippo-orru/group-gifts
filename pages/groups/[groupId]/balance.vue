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
  <div v-else class="h-dvh w-full flex flex-col">
    <NavBar title="Balance" :back="{ href: `/groups/${groupId}` }">
    </NavBar>

    <div class="grow overflow-y-scroll">
      <div class="p-4">
        <h2 class="text-2xl font-bold">Balance</h2>
        <p class="text-gray-500">Here you can see the balance of the group.</p>
      </div>

      <div class="p-4">
        <h3 class="text-lg font-bold">Members</h3>
        <ul class="divide-y divide-gray-200">
          <li v-for="member in group.members" :key="member.id" class="py-4">
            <div class="flex items-center justify-between">
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
