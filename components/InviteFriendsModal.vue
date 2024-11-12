<script lang="ts" setup>
const props = defineProps<{
  inviteLink: string;
  onClose: () => void;
}>();

const copyLink = () => {
  navigator.clipboard.writeText(props.inviteLink!);
  hasCopiedLink.value = true;
};

const hasCopiedLink = useState('hasCopiedLink', () => false);

const vShowModal = {
  mounted(el: HTMLDialogElement, binding: { value: any }) {
    el.showModal();
  },
}


const onLinkFocus = (event: FocusEvent) => {
  (event.target as HTMLInputElement).select();
};

</script>

<template>
  <dialog class="modal" v-show-modal>
    <div class="modal-box">
      <h3 class="text-lg font-bold">Invite your friends!</h3>
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
          <button class="btn" :class="{ 'btn-primary': hasCopiedLink }">Next</button>
        </form>
      </div>
    </div>
    <!--form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form-->
  </dialog>
</template>

<style></style>