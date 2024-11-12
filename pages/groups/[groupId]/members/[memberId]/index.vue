
<script lang="ts" setup>
const route = useRoute();
const router = useRouter();

// router.push(`${route.path}/gifts`);
definePageMeta({
  middleware: 'redirect-member',
});
</script>
<template>
  ...
</template>