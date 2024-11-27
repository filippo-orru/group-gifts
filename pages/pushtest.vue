<script lang="ts" setup>

const push = usePush();
</script>

<template>
  <div>
    <button @click="push.requestPermission()" class="border border-black m-4 p-2">Request permission</button>
  </div>    
</template>

<style>

</style>