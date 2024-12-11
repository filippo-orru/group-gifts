<script lang="ts" setup>
const router = useRouter();

const groupId = router.currentRoute.value.params.groupId;
const memberId = router.currentRoute.value.params.memberId;

const groupsStore = useGroupsStore();
const group = await groupsStore.getGroup(groupId);
</script>

<template>
  <WithLocaleHead>
    <GroupHomeNotFound v-if="!group" />
    <div v-else-if="!group.members.find(m => m.id === memberId)">
      <div>
        <NavBar title="Member" />
        <GenericPanel>
          <div class="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div class="text-center">Member not found</div>
            <NuxtLinkLocale :to="`/groups/${groupId}`" class="btn btn-primary">
              <i class="las la-arrow-right"></i>
              Back to group
            </NuxtLinkLocale>
          </div>
        </GenericPanel>
      </div>
    </div>
    <div v-else>
      <slot />
    </div>
  </WithLocaleHead>
</template>
