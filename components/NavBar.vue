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
    <div class="bg-base-100 shadow-md">
        <div class="max-w-4xl h-16 px-5 mx-auto flex flex-row items-center gap-4">
            <NuxtLink v-if="back && !back.useLogo" :to="back.href" class="btn btn-ghost bg-base-content/10 font-bold">
                <i class="las la-arrow-left"></i>
            </NuxtLink>
            <NuxtLink v-else :to="back?.href || '/'"
                class="btn btn-ghost bg-accent font-bold h-12 w-12 flex items-center justify-center">
                GG
            </NuxtLink>
            <h1 class="font-bold">{{ title }}</h1>
            <div v-if="$slots.actions" class="flex-1 flex items-center justify-end">
                <div class="dropdown dropdown-bottom dropdown-end">
                    <button tabindex="0" class="btn btn-ghost">
                        <i class="las la-ellipsis-v text-xl font-bold"></i>
                    </button>
                    <ul tabindex="0" class="menu dropdown-content bg-base-100 rounded-box z-10 mt-1 w-52 p-2 border-2 border-neutral/30 shadow-md">
                        <slot name="actions" />
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>