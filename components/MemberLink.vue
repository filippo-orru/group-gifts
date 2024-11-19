<script lang="ts" setup>
const props = defineProps<{
  memberId: string
}>();

const groupsStore = useGroupsStore();

const member = groupsStore.groups.flatMap(g => g.members).find(m => m.id === props.memberId)!;
const groupId = groupsStore.groups.find(g => g.members.includes(member))!.id;
const href = `/groups/${groupId}/members/${props.memberId}`;
</script>

<template>
  <NuxtLink class="underline font-bold text-neutral" :to="href">{{ member.name }}</NuxtLink>
</template>
