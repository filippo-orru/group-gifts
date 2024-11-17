<script lang="ts" setup>
const store = useMyAppStore()
await useAsyncData('groups', () => store.fetch({ force: true }).then(() => true))
const groups = computed(() => store.groups);
</script>

<template>
  <NavBar title="Groups">
  </NavBar>
  <GenericPanel :disable-padding="true">
    <NuxtLink v-for="(group, index) in groups" :key="group.id" :to="`/groups/${group.id}`">
      <div class="flex gap-4 items-center px-6 py-4 hover:bg-base-200">
        <div
          class="flex-shrink-0 rounded-full border border-secondary bg-secondary/30 w-8 h-8 flex items-center justify-center">
          <i class="las la-users text-xl"></i>
        </div>
        <div class="flex flex-col overflow-hidden">
          <span>{{ group.name }}</span>
          <span class="text-sm text-neutral overflow-hidden whitespace-nowrap text-ellipsis">{{ group.members.map(m =>
            m.name).join(", ") }}</span>
        </div>
        <!--div v-if="group.newMessages > 0" class="ml-auto badge badge-secondary">{{ group.newMessages }}</div-->
      </div>
      <hr class="border" v-if="index < (groups.length - 1)" />
    </NuxtLink>
  </GenericPanel>
  <GenericPanel class="fixed left-0 right-0 bottom-0">
    <NuxtLink to="/groups/new" class="btn btn-secondary btn-circle absolute bottom-4 right-4">
      <i class="las la-plus text-xl"></i>
    </NuxtLink>
  </GenericPanel>
</template>

<style></style>