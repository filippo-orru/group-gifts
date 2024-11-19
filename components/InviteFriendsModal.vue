<script lang="ts" setup>
import { vShowModal } from '~/utils/frontend';

const props = defineProps<{
  inviteId: string;
  onClose: () => void;
}>();

const inviteBase = location.origin + "/invite/";
const inviteLink = inviteBase + props.inviteId;

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
        <h3 class="text-lg font-bold">{{ $t('invite.title') }}</h3>
        <form method="dialog" @submit="onClose" class="ml-auto">
          <button class="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>
      </div>
      <p class="py-4">{{ $t('invite.description') }}</p>
      <div class="flex gap-2">
        <input class="input input-bordered grow min-w-0" dir="rtl" readonly :value="inviteLink" @focus="onLinkFocus" />
        <button class="btn" :class="{ 'btn-primary': !hasCopiedLink }" @click="copyLink">
          <template v-if="hasCopiedLink">{{ $t('invite.copied') }}</template>
          <template v-else>{{ $t('invite.copy') }}</template>
        </button>
      </div>
      <div class="modal-action">
        <form method="dialog" @submit="onClose">
          <button class="btn" :class="{ 'btn-primary': hasCopiedLink }">{{ $t('invite.done') }}</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<style></style>