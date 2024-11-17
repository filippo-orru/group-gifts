<script lang="ts" setup>
import { vShowModal } from '~/utils/frontend';

const props = defineProps<{
  groupId: string;
  onClose: () => void;
}>();

const inviteBase = location.origin + "/invite/";
const inviteLink = inviteBase + props.groupId;

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink);
  hasCopiedLink.value = true;
};

const hasCopiedLink = ref(false);


const onLinkFocus = (event: FocusEvent) => {
  (event.target as HTMLInputElement).select();
};

</script>

<template>
  <dialog class="modal" v-show-modal="true" @close="onClose">
    <div class="modal-box">
      <div class="flex">
        <h3 class="text-lg font-bold">Invite your friends!</h3>
        <form method="dialog" @submit="onClose" class="ml-auto">
          <button class="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>
      </div>
      <p class="py-4">Your group has been created. Copy this link and send it to your friends, so they can join
        the group.</p>
      <div class="flex gap-2">
        <input class="input input-bordered grow" readonly :value="inviteLink" @focus="onLinkFocus" />
        <button class="btn" :class="{ 'btn-primary': !hasCopiedLink }" @click="copyLink">
          <template v-if="hasCopiedLink">Copied!</template>
          <template v-else>Copy Link</template>
        </button>
      </div>
      <div class="modal-action">
        <form method="dialog" @submit="onClose">
          <button class="btn" :class="{ 'btn-primary': hasCopiedLink }">Done</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<style></style>