<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
const i18n = useI18n();

useSeoMeta({
  title: i18n.t('info.name'),
  ogTitle: i18n.t('info.name'),

  ogUrl: location.href,

  description: i18n.t('landing.tagline'),
  ogDescription: i18n.t('landing.tagline'),
});
</script>