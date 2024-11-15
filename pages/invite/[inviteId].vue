<script lang="ts" setup>
const router = useRouter();
const inviteId = router.currentRoute.value.params.inviteId;
</script>

<template>
  <div>
    invite {{ inviteId }}
  </div>    
</template>

<style>

</style>