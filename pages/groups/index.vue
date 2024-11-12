<script lang="ts" setup>
const store = useMyAppStore()
await useAsyncData('groups', () => store.fetch({ force: true }).then(() => true))
const groups = store.groups;
</script>

<template>
  <NavBar title="Groups" />
  <GenericPanel :disable-padding="true">
    <NuxtLink v-for="(group, index) in groups" :to="`/groups/${group.id}`" class="hover:bg-base-200">
      <div class="flex gap-4 items-center px-6 py-4">
        <div class="rounded-full border border-primary bg-primary/30 w-8 h-8 flex items-center justify-center">
          <i class="las la-users text-xl"></i>
        </div>
        <div>{{ group.name }}</div>
        <div v-if="group.newMessages > 0" class="ml-auto badge badge-secondary">{{ group.newMessages }}</div>
      </div>
      <hr class="border" v-if="index < (groups.length - 1)" />
    </NuxtLink>
  </GenericPanel>
  <GenericPanel class="fixed left-0 right-0 bottom-0">
    <button class="btn btn-secondary btn-circle absolute bottom-4 right-4 shadow-lg hover:shadow-xl">
      <i class="las la-plus text-xl"></i>
    </button>
  </GenericPanel>
</template>

<style></style>