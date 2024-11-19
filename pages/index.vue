<script setup>
</script>

<template>
  <div class="fixed bg-[#ead8ca]/95 z-40 shadow-sm w-full">
    <GenericPanel :disable-padding="true" class="navbar">
      <div class="navbar-start pl-4">
        <NuxtLink class="font-bold" href="/">{{ $t('info.name') }}</NuxtLink>
      </div>
      <div class="navbar-center hidden lg:flex">
        <!-- TODO: You can add menu here -->
      </div>
      <div class="navbar-end">
        <NuxtLink class="btn btn-accent" to="/groups">
          → {{ $t('landing.myGroups') }}
        </NuxtLink>
      </div>
    </GenericPanel>
  </div>

  <div class="absolute z-[-1] w-full h-full bg-gradient-to-b from-accent"></div>

  <div class="h-[80vh] px-4 ">
    <div class="text-center h-full w-full max-w-3xl mx-auto flex flex-col justify-center break-words md:break-normal ">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" v-html="$t('landing.title')">
      </h1>
      <p class="text-lg sm:text-xl mb-6">
        {{ $t('landing.subtitle') }}
      </p>
      <div class="flex justify-center space-x-5">
        <NuxtLink class="btn btn-primary" to="/groups/new">
          → {{ $t('landing.createGroup') }}
        </NuxtLink>
      </div>
    </div>
  </div>

  <generic-panel>
    <div class="prose p-4">
      <h1>{{ $t('landing.howItWorks') }}</h1>
      <ol>
        <li v-html="$t('landing.howItWorks1')"></li>
        <li v-html="$t('landing.howItWorks2')"></li>
        <li v-html="$t('landing.howItWorks3')"></li>
        <li v-html="$t('landing.howItWorks4')"></li>
      </ol>
    </div>
  </generic-panel>

  <GenericPanel>
    <footer class="footer footer-center mt-10 p-10 pt-5 border-t border-neutral/30">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">{{ $t('info.name') }}</h1>
        <p class="font-bold mb-3">{{ $t('landing.footerSubtitle') }}</p>

        <p>{{ $t('landing.footerCopyright', { date: new Date().getFullYear() }) }}</p>
        <NuxtLink to="https://filippo-orru.com" class="font-bold text-neutral underline">filippo-orru.com</NuxtLink>
      </div>
    </footer>
  </GenericPanel>
</template>
