<script lang="ts" setup>
const groupsStore = useGroupsStore()
await useAsyncData('groups', () => groupsStore.getGroups({ force: true }).then(() => true))
const groups = computed(() => groupsStore.groups);
</script>

<template>
  <NavBar title="Groups" href="/" :use-logo="true">
  </NavBar>
  <GenericPanel :disable-padding="true" class="flex flex-col gap-4 p-4">
    <div v-if="groups.length === 0"
      class="min-h-[80vh] flex flex-col gap-2 items-center justify-center text-center text-neutral">
      <i class="mt-24 las la-users text-6xl"></i>
      <h2 class="text-lg">
        {{ $t('groups.noGroupsYet.0') }}
      </h2>
      <h2 class="mt-8 text-lg">
        {{ $t('groups.noGroupsYet.1.title') }}
      </h2>
      <p class="max-w-md">
        {{ $t('groups.noGroupsYet.1.content') }}
      </p>
    </div>

    <NuxtLinkLocale v-for="(group, index) in groups" :key="group.id" :to="`/groups/${group.id}`"
      class="flex flex-col border-2 border-accent rounded-xl overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div class="bg-accent h-16 relative overflow-hidden">
        <div class="relative -left-4 -top-4  *:text-xl *:text-neutral/50"
          style="height: calc(100% + 2rem); width: calc(100% + 2rem)">
          <i v-for="i in 550" class="las" :class="{
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
    </NuxtLinkLocale>
  </GenericPanel>
  <GenericPanel class="fixed left-0 right-0 bottom-0">
    <NuxtLinkLocale to="/groups/new" class="btn btn-primary absolute bottom-4 right-4">
      <i class="las la-plus text-xl"></i>
      {{ $t('newGroup.createGroup') }}
    </NuxtLinkLocale>
  </GenericPanel>
</template>

<style></style>