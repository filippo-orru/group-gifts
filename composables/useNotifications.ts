import { getMessaging, getToken as getMessagingToken } from "firebase/messaging";

export type NotificationsState = 'initializing' | 'must-give-permission' | 'permission-denied' | 'error' | 'okay';

export const useNotifications = async () => {

  const state = ref<NotificationsState>('initializing');

  async function initialize() {
    async function getToken(): Promise<string> {
      const messaging = getMessaging();
      const vapidKey = "BPIu2uHJWXOYBju64ikLSAAI2pM2jLbvW18O5wvbweM8Hx2v8ozPS0u5bLHaH2-xmur9Mgezx4eV0X4v5CRpz54";
      try {
        return await getMessagingToken(messaging, { vapidKey: vapidKey });
      } catch (e) {
        console.log('An error occurred while getting the notification token. ', e);
        state.value = 'error';
        throw e;
      };
    }

    async function sendToken(token: string): Promise<void> {
      await $fetch('/api/notifications/token', {
        method: 'POST',
        body: { token: token! },
      });
    }

    const permission = Notification.permission;
    switch (permission) {
      case 'default':
        state.value = 'must-give-permission';
        break;

      case 'denied':
        state.value = 'permission-denied';
        break;

      case 'granted':
        const token = await getToken();
        sendToken(token);
        state.value = 'okay';
        break;
    }
  }

  const requestPermission = async (): Promise<void> => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await initialize();
    } else {
      console.log('Notification permission denied.');
      state.value = 'permission-denied';
    }
  };

  await initialize();

  // Make read-only
  const computedState = computed(() => state.value);

  return {
    state: computedState,
    requestPermission,
  };
}
