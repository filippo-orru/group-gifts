<script lang="ts" setup>

import type { AcceptInviteBody } from '~/utils/types';
const router = useRouter();
const inviteId = router.currentRoute.value.params.inviteId;

const { data, error } = await useFetch(`/api/invites/${inviteId}`);

const members = computed(() => data.value?.state === 'can-join' ? data.value.group.members : null);
const selectedMember = ref<string | null>(members.value ? members.value[0].id : null);

const groupsStore = useGroupsStore();

const joinGroup = async (groupId: string) => {
  const body: AcceptInviteBody = {
    memberId: selectedMember.value!
  };

  // TODO move api call to group store
  await $fetch(`/api/invites/${inviteId}/accept`, {
    method: 'POST',
    body: body
  });
  await groupsStore.getGroups({force: true});
  router.push(`/groups/${groupId}`);
};

const onCancel = () => {
  router.push('/');
};

onMounted(() => {
  if (data.value?.state === 'already-joined') {
    router.push(`/groups/${data.value.groupId}`);
  }
});

definePageMeta({
  title: 'Join group'
})
</script>

<template>
  <div class="bg-base-200 min-h-screen min-w-screen">
    <dialog class="modal" :open="data?.state !== 'already-joined'">
      <div class="modal-box ">
        <div v-if="!data || error" class="prose">
          <h1 class="text-lg font-bold">Sorry</h1>
          <p>
            Something went wrong. Please open the invite link again, or ask the person who
            invited you to send you a new invite link.
          </p>
          <button @click="onCancel" class="btn mt-4 ml-auto">Close</button>
        </div>

        <div v-else-if="data.state == 'can-join'" class="flex flex-col gap-3">
          <h1 class="text-lg font-bold">Join group</h1>
          <div class="prose">
            <p>
              You have been invited to join the group <b>{{ data.group.name }}</b>!
            </p>
            <ul>
              <li>Write your wishlist</li>
              <li>Easily keep track of gifts for your friends and family</li>
              <li>You only buy gifts for one person with a pooled budget</li>
            </ul>
          </div>

          <h2 class="mt-2 text-md font-bold">Select your name</h2>
          <div class="flex flex-col gap-3">
            <label v-for="member in data.group.members" :key="member.id"
              class="flex items-center gap-3 border-2 border-accent rounded-xl px-1 py-3 cursor-pointer" :class="{
                'bg-accent border-transparent text-accent-content': member.id == selectedMember,
                'bg-accent/10 text-accent-content': member.id != selectedMember
              }">
              <input type="radio" :value="member.id" v-model="selectedMember" class="appearance-none" />
              <div class="rounded-full border-2 flex items-center justify-center w-6 h-6 p-1" :class="{
                'border-base-100': member.id == selectedMember,
                'border-accent': member.id !== selectedMember
              }">
                <span class="bg-base-100 rounded-full w-full h-full" :class="{
                  'invisible': member.id !== selectedMember
                }"></span>
              </div>
              <span>
                {{ member.name }}
              </span>
            </label>
          </div>

          <button @click="joinGroup(data.group.id)" class="mt-2 btn btn-primary" :disabled="!selectedMember">Join group</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style></style>