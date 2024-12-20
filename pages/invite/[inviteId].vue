<script lang="ts" setup>
import '~/utils/extensions';
import type { AcceptInviteBody } from '~/utils/types';

const localePath = useLocalePath();
const router = useRouter();
const inviteId = router.currentRoute.value.params.inviteId;
const changeMember = router.currentRoute.value.query.changeMember;

const { data, error } = await useFetch(`/api/invites/${inviteId}`);

const members = computed(() => data.value?.state === 'can-join' ? data.value.group.members : null);
const selectedMember = ref<string | null>(null);

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
  await groupsStore.getGroups({ force: true });
  router.push(localePath(`/groups/${groupId}`));
};

const onCancel = () => {
  router.push(localePath('/'));
};

onMounted(() => {
  if (data.value?.state === 'already-joined' && !changeMember) {
    router.push(localePath(`/groups/${data.value.group.id}`));
  }
});

definePageMeta({
  title: 'Join group'
})
</script>

<template>
  <div class="bg-base-200 min-h-screen min-w-screen">
    <dialog class="modal" :open="data?.state !== 'already-joined' || changeMember">
      <div class="modal-box ">
        <div v-if="!data || error" class="prose">
          <h1 class="text-lg font-bold">{{$t('join.errorSorry')}}</h1>
          <p>
            {{ $t('join.error') }}
          </p>
          <button @click="onCancel" class="btn mt-4 ml-auto">{{ $t('general.close') }}</button>
        </div>

        <div v-else class="flex flex-col gap-3">
          <h1 class="text-lg font-bold">{{ $t('join.title') }}</h1>
          <div class="prose">
            <i18n-t tag="p" keypath="join.description">
              <b>{{ data.group.name }}</b>
            </i18n-t>
            <ul>
              <li v-for="i in 3">{{ $t(`join.features.${i-1}`) }}</li>
            </ul>
          </div>

          <h2 class="mt-2 text-md font-bold">{{$t('join.selectYourName')}}</h2>
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
                {{ member.name.capitalize() }}
              </span>
            </label>
          </div>

          <button @click="joinGroup(data.group.id)" class="mt-2 btn btn-primary" :disabled="!selectedMember">
            {{ $t('join.join') }}
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style></style>