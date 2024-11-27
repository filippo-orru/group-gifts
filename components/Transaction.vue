<script lang="ts" setup>
const props = defineProps<{
  transaction: MyBudgetTransaction;
  group: Group;
}>();

const groupsStore = useGroupsStore();

const getName = (id: string) => props.group.members.find(m => m.id === id)?.name ?? 'unknown';
const sending = computed(() => props.transaction.fromId === props.group.me.id);

const toggleCompleted = async () => {
  await groupsStore.toggleTransactionCompleted(props.group.id, props.transaction);
};
</script>

<template>
  <div class="mt-3 mb-3 w-full px-4 py-4 rounded-lg border-2" :class="{
    'border-green-800/60': !sending,
    'border-red-800/60': sending,
    'opacity-60 border-dashed': transaction.completed
  }">
    <div class="flex max-sm:flex-wrap items-center gap-2">
      <div class="sm:w-full flex items-center gap-2">
        <span class="sm:mr-auto w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center" :class="{
          'bg-green-500/40 text-green-800': !sending,
          'bg-red-500/40 text-red-800': sending
        }">
          <i class="las la-exchange-alt"></i>
        </span>

        <div class="sm:mr-auto flex items-center gap-2">
          <b v-if="sending">{{ $t('general.you') }}</b>
          <b v-else>{{ getName(transaction.fromId) }}</b>

          <i class="las la-arrow-right"></i>

          <b v-if="sending">{{ getName(transaction.toId) }}</b>
          <b v-else>{{ $t('general.you') }}</b>

          <span class="flex-shrink-0">
            {{ transaction.amountCents / 100 }} €
          </span>
        </div>
      </div>

      <button
        class="flex-shrink-0 ml-auto px-3 rounded-xl flex items-center justify-center gap-2 border-2 transition-all"
        :class="{
          'bg-green-500/20 border-green-800/30 hover:bg-green-800/70 hover:text-white/90': !transaction.completed && !sending,
          'bg-green-500/40 text-green-800 hover:text-green-800 hover:border-green-800': transaction.completed && !sending,

          'bg-red-800/20 border-red-800/30 hover:bg-red-800/70 hover:text-white/90': !transaction.completed && sending,
          'bg-red-500/40 text-red-800 hover:text-red-800 hover:border-red-800': transaction.completed && sending,
        }" @click="toggleCompleted">
        {{ $t('balance.transactionMarkAsDone') }}
        <i class="las la-check"></i>
      </button>
    </div>
  </div>
</template>

<style></style>