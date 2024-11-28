<script lang="ts" setup>
import { SvgoWishlist } from '#build/components';
import { vShowModal } from '~/utils/frontend';

const notifications = await useNotifications();
const state = notifications.state;

// If the notification state is initially not okay, show the info so 
//  once the user enables notifications, the info shows 'success!'
const showEvenIfOkay = ref(state.value !== 'okay');

const dismissed = ref(document.cookie.includes('dontAskForNotifications=true'));

const showDialog = ref(false);
const onClose = () => showDialog.value = false;
const promptLoading = ref(false);

const showIosTooltip = ref(false);
onMounted(() => {
  if (isIos && !isPwaInstalled) {
    showIosTooltip.value = true;
  }
});

const showPrompt = async () => {
  promptLoading.value = true;

  await Promise.all([
    notifications.requestPermission(),
    new Promise(resolve => setTimeout(resolve, 1000)) // minimum time to show loading spinner
  ]);

  promptLoading.value = false;

  if (state.value === 'okay') {
    showDialog.value = false;
  }
}

const clickInfo = () => {
  if (state.value === 'okay') {
    showEvenIfOkay.value = false;
  } else {
    showDialog.value = true;
  }
}

const dontAskAgain = (event: Event) => {
  // save dismissal in cookie
  document.cookie = `dontAskForNotifications=true; path=/; max-age=${60 * 60 * 24 * 14}`; // 14 days
  dismissed.value = true;
  showDialog.value = false;
}

const isIos = navigator.userAgent.match(/(iPod|iPhone|iPad)/) != null;

const isPwaInstalled = (window.navigator as any).standalone === true;
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="!dismissed && state !== 'initializing' && (showEvenIfOkay || state !== 'okay')" @click="clickInfo"
      class="w-full mb-3">

      <button class="w-full flex items-center gap-4 px-6 py-3 rounded-lg border-2 break-all" :class="{
        'border-red-800/60 bg-red-700/20 hover:bg-red-800/30': state !== 'okay',
        'border-green-800/60 bg-green-700/20': state === 'okay'
      }">
        <i class="las text-3xl shrink-0 sm:w-12" :class="{
          'la-exclamation-circle text-red-800': state !== 'okay',
          'la-check text-green-800': state === 'okay'
        }"></i>
        <div class="flex flex-col items-start text-start gap-1">
          <p class="font-bold" v-if="state !== 'okay'">{{ $t(`notifications.enable.title`) }}</p>
          <p class="font-bold" v-else>{{ $t(`notifications.enable.titleSuccess`) }}</p>
          
          <div class="hidden sm:block">
            <p v-if="state !== 'okay'">{{ $t(`notifications.enable.description`) }}</p>
            <p v-else>{{ $t(`notifications.enable.descriptionSuccess`) }}</p>
          </div>
        </div>
        <span class="ml-auto" v-if="state === 'okay'">✕</span>
      </button>
    </div>
  </Transition>

  <Transition>
    <dialog class="modal" v-show-modal="showDialog" @close="onClose">
      <div class="modal-box">
        <div class="flex">
          <h3 class="text-lg font-bold">{{ $t('notifications.enable.dialog.title') }}</h3>
          <button class="ml-auto btn btn-sm btn-circle btn-ghost" @click="onClose">✕</button>
        </div>

        <p class="pt-4">{{ $t('notifications.enable.dialog.description') }}</p>

        <p class="pt-2 text-red-800">
          <i class="las la-exclamation-circle text-lg mr-1"
            v-if="state === 'permission-denied' || state === 'error'"></i>

          <span v-if="state === 'permission-denied'">
            {{ $t('notifications.enable.dialog.permissionDenied') }}
          </span>
          <span v-else-if="state === 'error'">
            {{ $t('notifications.enable.dialog.error') }}
          </span>
        </p>

        <div class="py-2">
          <p class="px-2 bg-warning rounded-lg ring ring-8 ring-warning" v-if="isIos && !isPwaInstalled">
            <i class="las la-exclamation-circle text-lg mr-1"></i>

            <i18n-t keypath="notifications.enable.dialog.iosMustInstall">
              <p class="py-1"></p>
              <i class="las la-hand-point-right text-lg"></i>
              <SvgoShare class="inline" />
            </i18n-t>
          </p>
        </div>

        <div class="mt-5 flex flex-col gap-3">

          <button :disabled="isIos && !isPwaInstalled" class="btn btn-primary" @click="showPrompt">
            <span class="flex items-center gap-2" :class="{ 'invisible': promptLoading }">
              <i class="las la-bell text-xl"></i>
              {{ $t('notifications.enable.dialog.enable') }}
            </span>
            <span v-if="promptLoading" class="loading loading-spinner absolute"></span>
          </button>

          <button class="btn items-center gap-2" @click="dontAskAgain">
            <i class="las la-bell-slash text-xl"></i>
            {{ $t('notifications.enable.dialog.dontAskAgain') }}
          </button>

          <button class="btn" @click="onClose">
            {{ $t('notifications.enable.dialog.close') }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @submit="onClose">
        <button>close</button>
      </form>
    </dialog>
  </Transition>
</template>

<style></style>