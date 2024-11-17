<template>
  <div class="navbar fixed bg-base-100 z-40 shadow-sm">
    <div class="navbar-start pl-4">
      <NuxtLink class="font-bold" href="/">Group Gifts</NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <!-- TODO: You can add menu here -->
    </div>
    <div class="navbar-end">
      <NuxtLink class="btn btn-secondary" to="/groups">
        → Login
      </NuxtLink>
    </div>
  </div>

  <div class="hero min-h-[80vh]">
    <div class="hero-content text-center max-w-2xl mx-auto">
      <div class="">
        <h1 data-aos="fade-down" class="text-5xl md:text-6xl font-bold mb-6">Christmas Gift Giving,<br>made easy</h1>
        <p data-aos="fade-down" data-aos-delay="300" class="md:text-lg mb-6">
          Create a wishlist, set your budget and organize gifts in a group.
        </p>
        <div class="flex justify-center space-x-5">
          <NuxtLink data-aos="fade-down" class="btn btn-primary" to="/groups/new">
            → Create Group
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <generic-panel>
    <div class="prose p-4">
      <h1>How it works</h1>
      <ol>
        <li><b>Create a group</b> and invite everyone else</li>
        <li>Write your <b>wishlist</b> and set your <b>budget</b></li>
        <li><b>Chat</b> about other person's wishes</li>
        <li>Gifts are bought by each person's designated buyer</li>
      </ol>
    </div>
  </generic-panel>

  <footer class="footer footer-center p-10 bg-base-50">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold">Group Gifts</h1>
      <p class="md:font-bold">
        Christmas Gift Giving, made easy
      </p>
      <p>Developed by Filippo — Copyright © {{ new Date().getFullYear() }}</p>
    </div>
  </footer>
</template>

<script setup>
const store = useMyAppStore();
await store.init();

useHead({
  title: 'Nuxtwind Daisy 🟢💨🌼',
  description: 'Nuxtwind Daisy is a starter template for Nuxt.js 3 + Tailwind CSS + Daisy UI with additional installed setup for custom font, icons, animation, and more.',
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
  ],
  meta: [
    // {
    //   hid: 'og:image',
    //   name: 'og:image',
    //   property: 'og:image',
    //   content: ogBanner,
    // },
  ],
});
</script>
