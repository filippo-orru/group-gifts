<script lang="ts" setup>
import { vShowModal } from '~/utils/frontend';
export type GroupTab = "home" | "wishlist";

const props = defineProps<{
  tab: GroupTab;
}>();

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const groupsStore = useGroupsStore()
await useAsyncData('groups', () => groupsStore.getGroups().then(() => true))

const group = groupsStore.groups.find(g => g.id === groupId)!;

const showConfirmDeleteDialog = ref(false);
const setShowConfirmDeleteDialog = (show: boolean) => {
  showConfirmDeleteDialog.value = show;
};
const confirmDeleteGroup = async () => {
  await groupsStore.deleteGroup(group.id);
  router.push('/groups');
};

const goToBalance = () => {
  router.push(`/groups/${groupId}/balance`);
};
</script>

<template>
  <dialog class="modal" v-show-modal="showConfirmDeleteDialog" @close="setShowConfirmDeleteDialog(false)">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ $t('groupHome.delete.title') }}
      </h3>
      <p class="py-4">
        <i18n-t keypath="groupHome.delete.description">
          <b>{{ group.name }}</b>
        </i18n-t>
      </p>
      <div class="modal-action">
        <form method="dialog" @submit="setShowConfirmDeleteDialog(false)" class="ml-auto">
          <button class="btn" type="submit">{{ $t('groupHome.delete.cancel') }}</button>
        </form>
        <form method="dialog" @submit="confirmDeleteGroup">
          <button class="btn btn-primary" type="submit">{{ $t('groupHome.delete.confirm') }}</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @submit="setShowConfirmDeleteDialog(false)">
      <button>close</button>
    </form>
  </dialog>

  <div class="h-dvh w-full flex flex-col">
    <NavBar :title="group.name" href='/groups' :useLogo=true>
      <template v-slot:actions>
        <slot name="actions" />
        <li>
          <button @click="goToBalance">
            <i class="las la-coins text-xl"></i>
            {{ $t('groupHome.actions.balance') }}
          </button>
        </li>
        <li>
          <button @click="setShowConfirmDeleteDialog(true)">
            <i class="las la-trash text-xl"></i>
            {{ $t('groupHome.actions.delete') }}
          </button>
        </li>
      </template>
    </NavBar>

    <div class="grow overflow-y-scroll">
      <slot />
    </div>

    <GenericPanel class="">
      <div role="tablist" class="tabs tabs-boxed">
        <NuxtLinkLocale role="tab" class="tab" :class="{ 'bg-primary text-primary-content': tab == 'home' }"
          :to="`/groups/${groupId}`">
          <i class="las la-home text-lg mr-2"></i>
          {{ $t('groupHome.tabs.home') }}
        </NuxtLinkLocale>
        <NuxtLinkLocale role="tab" class="tab" :class="{ 'bg-primary text-primary-content': tab == 'wishlist' }"
          :to="`/groups/${groupId}/wishlist`">
          <i class="las la-gift text-lg mr-2"></i>
          {{ $t('groupHome.tabs.wishlist') }}
        </NuxtLinkLocale>
      </div>
    </GenericPanel>
  </div>
</template>
