<script lang="ts" setup>
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;

const groupsStore = useGroupsStore();
const group = await groupsStore.getGroup(groupId);

const groupName = ref(group.value.name);
const nameChanged = computed(() => groupName.value !== group.value.name);

const hasMaxBudget = ref(!!(group.value.maxBudget));
const maxBudget = ref(group.value.maxBudget || 10);
const budgetChanged = computed(() =>
  (hasMaxBudget.value ? maxBudget.value : null) !== group.value.maxBudget
);

const secretMode = ref(group.value.secretMode);
const secretModeChanged = computed(() => secretMode.value !== group.value.secretMode);

const fixedBudget = ref(group.value.fixedBudget);
const changedFixedBudget = computed(() => fixedBudget.value !== group.value.fixedBudget);

const hasChanges = computed(() =>
  nameChanged.value || changedFixedBudget.value || budgetChanged.value || secretModeChanged.value
);
const savingInProgress = ref(false);
const saveAll = async () => {
  savingInProgress.value = true;
  try {
    await groupsStore.updateGroup(groupId, {
      fixedBudget: fixedBudget.value,
      name: groupName.value,
      maxBudget: hasMaxBudget.value ? maxBudget.value : null,
      secretMode: secretMode.value,
    });
  } finally {
    savingInProgress.value = false;
  }
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
          <input class="input input-bordered" v-model="groupName" required
            :placeholder="$t('newGroup.groupNamePlaceholder', { year: new Date().getFullYear() })" />
        </div>

        <div class="form-control w-full">
          <h1 class="text-lg mb-2">{{ $t('groupSettings.secretMode') }}</h1>
          <p class="text-neutral mb-2">{{ $t('groupSettings.secretModeDescription') }}</p>

          <label class="mx-1">
            <input type="checkbox" :checked="!!secretMode" @change="secretMode = !secretMode" />
            <span class="ml-2">{{ $t('groupSettings.secretModeCheckbox') }}</span>
          </label>
        </div>

        <div class="form-control w-full">
          <h1 class="text-lg mb-2">{{ $t('groupSettings.fixedBudget') }}</h1>
          <p class="text-neutral mb-2">{{ $t('groupSettings.fixedBudgetDescription') }}</p>

          <label class="mx-1">
            <input type="checkbox" :checked="!!fixedBudget" @change="fixedBudget === null ? fixedBudget = 10 : fixedBudget = null" />
            <span class="ml-2">{{ $t('groupSettings.fixedBudgetCheckbox') }}</span>
          </label>

          <label v-if="fixedBudget !== null" class="input input-bordered flex items-center gap-4 mb-3">
            <input class="w-full" type="number" v-model="fixedBudget" :min="1" placeholder="10" />
            <span>€</span>
          </label>
        </div>

        <div class="form-control w-full" v-if="fixedBudget === null">
          <h1 class="mb-2">{{ $t('groupSettings.hasMaxBudget') }}</h1>
          <p class="text-neutral mb-2">{{ $t('groupSettings.maxBudgetDescription') }}</p>

          <label class="mx-1">
            <input type="checkbox" :checked="!!hasMaxBudget" @change="hasMaxBudget = !hasMaxBudget" />
            <span class="ml-2">{{ $t('groupSettings.hasMaxBudget') }}</span>
          </label>

          <label v-if="hasMaxBudget" class="input input-bordered flex items-center gap-4 mb-3">
            <input class="w-full" type="number" v-model="maxBudget" :min="1" placeholder="10" />
            <span>€</span>
          </label>
        </div>

        <button class="btn relative" :class="{ 'btn-primary': hasChanges }" @click="saveAll">
          <span :class="{ 'invisible': savingInProgress }">{{ $t('groupSettings.save') }}</span>
          <span v-if="savingInProgress" class="absolute loading loading-spinner"></span>
        </button>
      </div>
    </GenericPanel>
  </div>
</template>

<style></style>
