import { getMessaging, getToken } from "firebase/messaging";

export const usePush = () => {
  const messaging = getMessaging();
  // Add the public key generated from the console here.


  const requestPermission = async () => {
    console.log('Requesting permission...');
    try {
      const vapidKey = "BPIu2uHJWXOYBju64ikLSAAI2pM2jLbvW18O5wvbweM8Hx2v8ozPS0u5bLHaH2-xmur9Mgezx4eV0X4v5CRpz54";
      const currentToken = await getToken(messaging, { vapidKey: vapidKey });
      if (currentToken) {
        console.log('Token already available:', currentToken);

        // Send the token to the server
        await $fetch('/api/notifications/token', {
          method: 'POST',
          body: { token: currentToken },
        });
        // update the UI if necessary
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');

        // Request permission to generate token
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // Call getToken to get the token generated
          const token = await getToken(messaging, { vapidKey: vapidKey });
          console.log('Token generated:', token);
          // Send the token to your server and update the UI if necessary
        } else {
          console.log('Unable to get permission to notify.');
        }
      }
    } catch (e) {
      console.log('An error occurred while retrieving token. ', e);
    };
  };

  return { requestPermission };
}
