<script lang="ts" setup>
import { vShowModal } from '~/utils/frontend';
export type GroupTab = "home" | "wishlist";

const props = defineProps<{
  tab: GroupTab;
}>();

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const store = useMyAppStore()
await useAsyncData('groups', () => store.fetch().then(() => true))

const group = store.groups.find(g => g.id === groupId)!;

const showConfirmDeleteDialog = ref(false);
const setShowConfirmDeleteDialog = (show: boolean) => {
  showConfirmDeleteDialog.value = show;
};
const confirmDeleteGroup = async () => {
  await store.deleteGroup(group.id);
  router.push('/groups');
};
</script>

<template>
  <dialog class="modal" v-show-modal="showConfirmDeleteDialog" @close="setShowConfirmDeleteDialog(false)">
    <div class="modal-box">
      <div class="flex">
        <h3 class="text-lg font-bold">
          Delete Group
        </h3>
        <form method="dialog" @submit="setShowConfirmDeleteDialog(false)" class="ml-auto">
          <button class="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>
      </div>
      <p class="py-4">
        Are you sure you want to delete the group <b>'{{ group.name }}'</b>?
      </p>
      <div class="modal-action">
        <form method="dialog" @submit="confirmDeleteGroup">
          <button class="btn btn-primary" type="submit">Delete Group</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @submit="setShowConfirmDeleteDialog(false)">
      <button>close</button>
    </form>
  </dialog>

  <div class="h-screen w-full flex flex-col">
    <NavBar :title="group.name" :back="{ href: '/groups', useLogo: true }">
      <template v-slot:actions>
        <li>
          <button @click="setShowConfirmDeleteDialog(true)">
            <i class="las la-trash text-xl"></i>
            Delete Group
          </button>
        </li>
        <slot name="actions" />
      </template>
    </NavBar>
    <div class="grow overflow-y-scroll">
      <slot />
    </div>

    <GenericPanel class="">
      <div role="tablist" class="tabs tabs-boxed">
        <NuxtLink role="tab" class="tab" :class="{ 'bg-primary text-primary-content': tab == 'home' }"
          :to="`/groups/${groupId}`">
          <i class="las la-home text-lg mr-2"></i>
          Home
        </NuxtLink>
        <NuxtLink role="tab" class="tab" :class="{ 'bg-primary text-primary-content': tab == 'wishlist' }"
          :to="`/groups/${groupId}/wishlist`">
          <i class="las la-gift text-lg mr-2"></i>
          My Wishlist
        </NuxtLink>
      </div>
    </GenericPanel>
  </div>
</template>

<style></style>