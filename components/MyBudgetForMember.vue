<script lang="ts" setup>
const props = defineProps<{
  group: Group,
  member: GroupMember,
}>();

const groupsStore = useGroupsStore();

const iAmResponsible = computed(() => props.member.responsibleMemberId == props.group.me.id);
const responsibleName = computed(() => props.group.members.find(m => m.id == props.member.responsibleMemberId)?.name ?? null);

const shouldAddBudget = computed(() => props.member.myBudget === null);

const myBudget = ref<string>(props.member.myBudget?.amount?.toString() ?? '');
const myBudgetIsFlexible = ref<boolean>(props.member.myBudget?.flexible ?? false);
const saveBudgetState = ref<null | 'saving' | 'error'>(null);

const exceedMaxBudget = computed(() => {
  if (!props.group.maxBudget || !parseInt(myBudget.value)) return false;
  return parseInt(myBudget.value) > props.group.maxBudget;
});

const saveBudgetForAllState = ref<null | 'saving' | 'saved'>(null);
const saveBudgetForAll = async () => {
  saveBudgetForAllState.value = 'saving';
  try {
    let budgetAmount: number | null = parseInt(myBudget.value);
    if (isNaN(budgetAmount)) {
      budgetAmount = null;
    }
    const body: PutBudget = {
      amount: budgetAmount,
      flexible: myBudgetIsFlexible.value,
    };
    await Promise.all([
      groupsStore.updateBudgetForAll(props.group.id, body),
      new Promise(resolve => setTimeout(resolve, 1000)), // Wait for a bit to show the loading process
    ]);
    saveBudgetForAllState.value = 'saved';
  } catch (e) {
    saveBudgetState.value = 'error';
  }
};

const toggleFlexibleBudget = () => {
  myBudgetIsFlexible.value = !myBudgetIsFlexible.value;

  submitBudget();
};

const submitBudget = async (event?: SubmitEvent) => {
  event?.preventDefault();

  let budgetAmount: number | null = parseInt(myBudget.value);
  if (isNaN(budgetAmount)) {
    budgetAmount = null;
  }
  const body: PutBudget = {
    amount: budgetAmount,
    flexible: myBudgetIsFlexible.value,
  };

  try {
    saveBudgetState.value = 'saving';
    await Promise.all([
      groupsStore.updateMemberBudget(props.group.id, props.member.id, body),
      new Promise(resolve => setTimeout(resolve, 1000)), // Wait for a bit to show the loading process
    ]);
    saveBudgetState.value = null;
  } catch (e) {
    saveBudgetState.value = 'error';
  }
};

</script>

<template>
  <div class="flex flex-col mb-4">
    <h1 class="text-2xl">Budget</h1>
    <p class="text-neutral">
      <i18n-t :keypath="'memberHome.budgetInfo.' + (iAmResponsible ? 'you' : 'someoneElse')" tag='span'>
        <b>{{ member.name }}</b>
        <b>{{ responsibleName }}</b>
      </i18n-t>
    </p>

    <Transition name="slide-fade">
      <div v-if="shouldAddBudget" class="mt-2 alert alert-info text-start">
        <div class="flex gap-2 items-center">
          <i class="las la-info-circle text-2xl"></i>
          <p>
            <i18n-t :keypath="'memberHome.mustSetBudget'">
              <b>{{ member.name }}</b>
            </i18n-t>
          </p>
        </div>
      </div>
    </Transition>

    <form @submit="submitBudget" class="mt-4 form-control flex gap-4 flex-col items-stretch md:flex-row md:justify-end">
      <div class="flex flex-col gap-2 items-stretch">
        <label class="grow input input-bordered flex items-center gap-4">
          <input class="w-full" type="number" v-model="myBudget" min="0" placeholder="10" />
          <span>€</span>
        </label>
        <span v-if="group.maxBudget" class="pl-2 pr-3 text-neutral text-sm flex items-center gap-2"
          :class="{ 'text-red-600 font-bold': exceedMaxBudget }">
          <i class="las text-lg"
            :class="{ 'la-info-circle': !exceedMaxBudget, 'la-exclamation-circle': exceedMaxBudget }"></i>
          {{ $t('memberHome.maxBudget', [group.maxBudget]) }}
        </span>
      </div>

      <div class="indicator w-auto shrink-0">
        <button class="btn max-md:w-full gap-2" :class="{ 'btn-accent': myBudgetIsFlexible }"
          :disabled="exceedMaxBudget || isNaN(parseInt(myBudget))" @click="toggleFlexibleBudget" type="button">
          <i class="las text-xl"
            :class="!isNaN(parseInt(myBudget)) && myBudgetIsFlexible ? 'la-check' : 'la-times'"></i>
          <span>{{ $t('memberHome.flexibleBudget') }}</span>
        </button>

        <div class="tooltip tooltip-left md:tooltip-top before:shadow-md before:z-10 after:z-10"
          :data-tip="$t('memberHome.flexibleBudgetInfo')">
          <div class="indicator-item rounded-full w-7 h-7 bg-neutral text-neutral-content">
            <i class="ml-auto las la-question-circle text-xl"></i>
          </div>
        </div>

      </div>

      <div class="flex flex-col gap-2">
        <button class="btn btn-primary relative" :disabled="exceedMaxBudget">
          <span :class="{ 'invisible': saveBudgetState == 'saving' }">
            {{ $t('memberHome.saveBudget') }}
          </span>
          <span v-if="saveBudgetState == 'saving'" class="loading loading-spinner absolute"></span>
        </button>

        <button class="text-neutral text-sm underline flex items-center justify-center gap-2 pr-3 relative"
          :class="{ 'text-neutral/50': exceedMaxBudget }" @click="saveBudgetForAll" type="button"
          :disabled="exceedMaxBudget">
          <span :class="{ 'invisible': saveBudgetForAllState !== 'saved' }">
            <i class="las la-check"></i>
          </span>

          <span class="text-start text-xs" :class="{ 'invisible': saveBudgetForAllState == 'saving' }">
            {{ $t('memberHome.saveBudgetForAll') }}
          </span>
          <span v-if="saveBudgetForAllState == 'saving'"
            class="loading loading-spinner loading-sm text-neutral absolute"></span>
        </button>
      </div>

      <span v-if="saveBudgetState == 'error'" class="text-neutral text-sm">
        <i class="las la-times"></i>
        {{ $t('memberHome.saveBudgetError') }}
      </span>
    </form>
  </div>
</template>

<style></style>