<script setup lang="ts">
const props = defineProps<{
    back?: {
        href: string;
        useLogo?: boolean;
    };
    title: string;
}>()
</script>
<template>
    <div class="bg-base-200/50">
        <div class="max-w-4xl h-16 px-5 mx-auto flex flex-row items-center gap-4">
            <NuxtLink v-if="back && !back.useLogo" :to="back.href" class="btn btn-ghost bg-base-content/10 font-bold">
                <i class="las la-arrow-left"></i>
            </NuxtLink>
            <NuxtLink v-else :to="back?.href || '/'" class="btn btn-ghost bg-base-content/10 font-bold h-12 w-12 flex items-center justify-center">
                GG
            </NuxtLink>
            <h1 class="font-bold">{{ title }}</h1>
        </div>
    </div>
</template>