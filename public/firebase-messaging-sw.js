// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDqLgiOyZOsME9lDie0qRQwAxf-bfc7kUY",
    authDomain: "group-gifts-4b208.firebaseapp.com",
    projectId: "group-gifts-4b208",
    storageBucket: "group-gifts-4b208.firebasestorage.app",
    messagingSenderId: "530776730060",
    appId: "1:530776730060:web:7791cd422580be9d31d569",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
});

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/favicon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});