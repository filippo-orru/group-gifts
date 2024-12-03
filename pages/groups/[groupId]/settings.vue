<script lang="ts" setup>
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;

const groupsStore = useGroupsStore();
const group = await groupsStore.getGroup(groupId);

const groupName = ref(group.value.name);
const nameChanged = computed(() => groupName.value !== group.value.name);
const savingName = ref(false);
const saveName = async () => {
  savingName.value = true;
  await groupsStore.updateGroup(groupId, { name: groupName.value });
  savingName.value = false;
};

const hasMaxBudget = ref(!!(group.value.maxBudget));
const maxBudget = ref(group.value.maxBudget || 10);
const budgetChanged = computed(() =>
  !!(group.value.maxBudget) !== hasMaxBudget.value || maxBudget.value !== group.value.maxBudget
);
const savingBudget = ref(false);
const saveBudget = async () => {
  savingBudget.value = true;
  await groupsStore.updateGroup(groupId, { maxBudget: hasMaxBudget.value ? maxBudget.value : null });
  savingBudget.value = false;
};

const secretMode = ref(group.value.secretMode);
const savingSecretMode = ref(false);
const toggleSecretMode = async () => {
  secretMode.value = !secretMode.value
  savingSecretMode.value = true;
  await groupsStore.updateGroup(groupId, { secretMode: secretMode.value });
  savingSecretMode.value = false;
};
</script>

<template>
  <div class="h-dvh w-full flex flex-col">
    <NavBar :title="$t('groupSettings.title')" :href="`/groups/${groupId}`">
    </NavBar>

    <GenericPanel :disablePadding="true">
      <div class="grow overflow-y-scroll flex flex-col gap-5 py-4 px-5">
        <p class="text-neutral">
          {{ $t('groupSettings.description') }}
        </p>

        <div class="form-control w-full">
          <h1 class="text-lg mb-2">{{ $t('newGroup.groupName') }}</h1>
          <div class="w-full flex gap-3">
            <input class="flex-1 min-w-0 input input-bordered" v-model="groupName" required
              :placeholder="$t('newGroup.groupNamePlaceholder', { year: new Date().getFullYear() })" />
            <button class="btn relative" :class="{ 'btn-primary': nameChanged }" @click="saveName">
              <span :class="{ 'invisible': savingName }">{{ $t('groupSettings.save') }}</span>
              <span v-if="savingName" class="absolute loading loading-spinner"></span>
            </button>
          </div>
        </div>

        <div class="form-control w-full">
          <h1 class="text-lg mb-2">{{ $t('groupSettings.maxBudget') }}</h1>
          <label class="mx-1 label justify-start gap-2">
            <input type="checkbox" v-model="hasMaxBudget" />
            <span>{{ $t('groupSettings.hasMaxBudget') }}</span>
          </label>
          <div class="label text-neutral text-md">{{ $t('newGroup.maxBudgetDescription') }}</div>
          <label v-if="hasMaxBudget" class="input input-bordered flex items-center gap-4 mb-3">
            <input class="w-full" type="number" v-model="maxBudget" :min="1" :placeholder="10" />
            <span>€</span>
          </label>

          <button class="btn relative" :class="{ 'btn-primary': budgetChanged }" @click="saveBudget">
            <span :class="{ 'invisible': savingBudget }">{{ $t('groupSettings.save') }}</span>
            <span v-if="savingBudget" class="absolute loading loading-spinner"></span>
          </button>
        </div>

        <div class="form-control w-full">
          <h1 class="text-lg mb-2">{{ $t('groupSettings.secretMode') }}</h1>
          <p class="text-neutral mb-2">{{ $t('groupSettings.secretModeDescription') }}</p>

          <button class="btn" :class="{ 'btn-primary': secretMode }" type="button" @click="toggleSecretMode">
            <span class="flex items-center gap-2" :class="{ 'invisible': savingSecretMode }">
              <i class="las" :class="{ 'la-check': secretMode, 'la-times': !secretMode }"></i>
              <span>{{ $t('groupSettings.secretMode') }}</span>
            </span>
            <span v-if="savingSecretMode" class="absolute loading loading-spinner"></span>
          </button>
        </div>
      </div>
    </GenericPanel>
  </div>
</template>

<style></style>