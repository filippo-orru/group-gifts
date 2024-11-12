<script lang="ts" setup>
import type { GroupInfo } from '~/utils/common-types';

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const store = useMyAppStore()
await useAsyncData('groups', () => store.fetch().then(() => true))

const groups: GroupInfo[] = store.groups;
const group = groups.find(g => g.id === groupId)!;
const baseHref = `/groups/${groupId}`;

</script>

<template>
  <GroupHome tab="home">
    <GenericPanel :disable-padding="true">
      <div class="flex flex-col">
        <!-- todo all-chat -->
        <NuxtLink v-for="(member, index) in group.members" :to="`${baseHref}/members/${member.id}`"
          class="hover:bg-base-200">
          <div class="flex gap-4 items-center px-6 py-4">
            <div class="rounded-full border border-primary bg-primary/30 w-8 h-8 flex items-center justify-center">
              <i class="las la-user text-xl"></i>
            </div>
            <div>{{ member.name }}</div>
          </div>
          <hr class="border" v-if="index < (group.members.length - 1)" />
        </NuxtLink>
      </div>
    </GenericPanel>
  </GroupHome>
</template>

<style></style>