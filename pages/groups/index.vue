<script lang="ts" setup>
const groupsStore = useGroupsStore()
await useAsyncData('groups', () => groupsStore.getGroups({ force: true }).then(() => true))
const groups = computed(() => groupsStore.groups);
</script>

<template>
  <NavBar title="Groups">
  </NavBar>
  <GenericPanel :disable-padding="true" class="flex flex-col gap-4 p-4">
    <div v-if="groups.length === 0" class="mt-6 text-neutral">
      <p>You are not in any groups yet. Create one now!</p>
      <p>To view a group you joined on another device, you need to open the invite link again <i>on this device</i>.</p>
    </div>

    <NuxtLink v-for="(group, index) in groups" :key="group.id" :to="`/groups/${group.id}`"
      class="flex flex-col border-2 border-accent rounded-xl overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div class="bg-accent h-16 relative overflow-hidden">
        <div class="relative -left-4 -top-4  *:text-xl *:text-neutral/50"
          style="height: calc(100% + 2rem); width: calc(100% + 2rem)">
          <i v-for="i in 150" class="las" :class="{
            'la-gift': i % 3 == 0, 'la-candy-cane': i % 3 == 1, 'la-holly-berry': i % 3 == 2,
            'translate-y-3': i % 2 == 0
          }"></i>
        </div>
      </div>

      <div class="flex flex-col overflow-hidden px-6 py-4">
        <div class="flex items-center gap-2 ">
          <i class="las la-users text-xl"></i>
          <span class="font-bold">{{ group.name }}</span>
        </div>
        <span class="text-sm text-neutral overflow-hidden whitespace-nowrap text-ellipsis">
          {{ group.members.map(m => m.name).join(", ") }}</span>
      </div>
      <!--div v-if="group.newMessages > 0" class="ml-auto badge badge-secondary">{{ group.newMessages }}</div-->
    </NuxtLink>
  </GenericPanel>
  <GenericPanel class="fixed left-0 right-0 bottom-0">
    <NuxtLink to="/groups/new" class="btn btn-primary absolute bottom-4 right-4">
      <i class="las la-plus text-xl"></i>
      Create Group
    </NuxtLink>
  </GenericPanel>
</template>

<style></style>