<script setup>
useHead({
  title: 'Group Gifts',
  description: 'Christmas Gift Giving, made easy',
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

<template>
  <div class="fixed bg-[#ead8ca]/95 z-40 shadow-sm w-full">
    <GenericPanel :disable-padding="true" class="navbar">
      <div class="navbar-start pl-4">
        <NuxtLink class="font-bold" href="/">Group Gifts</NuxtLink>
      </div>
      <div class="navbar-center hidden lg:flex">
        <!-- TODO: You can add menu here -->
      </div>
      <div class="navbar-end">
        <NuxtLink class="btn btn-accent" to="/groups">
          → Login
        </NuxtLink>
      </div>
    </GenericPanel>
  </div>

  <div class="absolute z-0 w-full h-full bg-gradient-to-b from-accent"></div>

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
