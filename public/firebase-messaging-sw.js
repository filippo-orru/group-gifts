importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

// Keep in sync with the one in nuxt.config.js!
firebase.initializeApp({
    apiKey: "AIzaSyDqLgiOyZOsME9lDie0qRQwAxf-bfc7kUY",
    authDomain: "group-gifts-4b208.firebaseapp.com",
    projectId: "group-gifts-4b208",
    storageBucket: "group-gifts-4b208.firebasestorage.app",
    messagingSenderId: "530776730060",
    appId: "1:530776730060:web:7791cd422580be9d31d569",
});

console.log("Service worker loading!"); 

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // Hm this doesnt work... Whatever
});

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    self.registration.showNotification(payload.notification.title, payload.notification);
});