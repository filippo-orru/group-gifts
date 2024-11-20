<script lang="ts" setup>
import '~/utils/extensions';

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;

const groupsStore = useGroupsStore()
const group = (await groupsStore.getGroup(groupId))!;
const budgeting = await groupsStore.getBudgeting(groupId);

const giftsBoughtForWho = computed(() => group.members
  .filter(member => member.gifts.some(gift => gift.buyerId === group.me.id))
);

const sendTransactions = computed(() => budgeting.myTransactions.filter(t => t.fromId === group.me.id));
const receiveTransactions = computed(() => budgeting.myTransactions.filter(t => t.toId === group.me.id));

definePageMeta({
  layout: 'group-required',
})
</script>

<template>
  <div class="h-dvh w-full flex flex-col">
    <NavBar title="Balance" :href="`/groups/${groupId}`">
    </NavBar>

    <GenericPanel>
      <div class="grow overflow-y-scroll flex flex-col gap-3 py-4">
        <div class="">
          <h2 class="text-2xl font-bold mb-2">Balance</h2>
          <p class="text-neutral mb-1">Here you can see how to balance the expenses of the group.</p>
          <p class="text-neutral">
            Make sure all budgets and expenses (gifts) have been added before you start to balance!
          </p>
        </div>

        <div class="mt-4 mb-3">
          <h3 class="text-lg font-bold">Calculation</h3>
          <div class="w-full max-w-xl mx-auto *:py-5 *:flex *:border-neutral/50 *:border-t">
            <div class="!border-t-0">
              <span class="">
                Your expenses
                <div class="tooltip"
                  :data-tip="'You bought gifts for ' + formatEnumeration(giftsBoughtForWho.map(m => m.name))">
                  <i class="las la-info-circle"></i>
                </div>
              </span>
              <span class="ml-auto">
                <b class="mr-3">
                  - {{ budgeting.expensesSum.roundCents() }}€</b>
              </span>
            </div>
            <div>
              <span>Your Budget</span>
              <span class="ml-auto">
                <b class="mr-3">
                  {{ budgeting.budgetSum.roundCents() }}€</b>
              </span>
            </div>
            <div v-if="budgeting.overspend.amount > 0">
              <span>
                Your Overspend
                <div class="tooltip"
                  :data-tip="'Because you spent more than the available budget for ' +
                    formatEnumeration(budgeting.overspend.forMemberIds.map(id => group.members.find(m => m.id == id)!.name))">
                  <!-- TODO this is a bit confusing-->
                  <i class="las la-info-circle"></i>
                </div>
              </span>
              <span class="ml-auto">
                <b class="mr-3">
                  - {{ budgeting.overspend.amount.roundCents() }} €
                </b>
              </span>
            </div>
            <div v-if="budgeting.underspend.amount > 0">
              <span>
                Your Underspend
                <div class="tooltip"
                  :data-tip="'Because you spent less than the available budget for '
                    + formatEnumeration(budgeting.underspend.forMemberIds.map(id => group.members.find(m => m.id == id)!.name))">
                  <i class="las la-info-circle"></i>
                </div>
              </span>
              <span class="ml-auto">
                <b class="mr-3">
                  {{ budgeting.underspend.amount.roundCents() }} €
                </b>
              </span>
            </div>
            <div>
              <span>
                Result
              </span>
              <span class="ml-auto">
                <b class="py-1 px-3 bg-accent/70 text-accent-content rounded-md">{{ budgeting.remainder.roundCents() }}
                  €</b>
              </span>
            </div>
          </div>
        </div>

        <h3 class="text-lg font-bold mt-4 mb-2">Transactions</h3>

        <div v-if="budgeting.remainder !== 0">
          <div v-if="sendTransactions.length > 0">
            <p class="text-neutral">
              You need to make these transactions so that the budget is balanced.
            </p>

            <div class="max-w-xl mx-auto">
              <div v-for="transaction in sendTransactions"
                class="mt-1 mb-3 px-3 py-4 rounded-lg border border-neutral hover:bg-neutral hover:text-neutral-content">
                <div class="flex items-center gap-2">
                  <span>{{ 'You' }}</span>
                  <i class="las la-arrow-right"></i>
                  <span>{{ group.members.find(m => m.id == transaction.toId)?.name ?? 'unknown' }}</span>
                  <span class="ml-auto">{{ transaction.amountCents / 100 }} €</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="receiveTransactions.length > 0">
            <p class="text-neutral mb-3">
              <b>Others</b> needs to make these transactions so your budget is balanced.
              <template v-if="sendTransactions.length === 0">
                <b>You</b> don't need to make any transactions.
              </template>
            </p>

            <div class="max-w-xl mx-auto">
              <div v-for="transaction in receiveTransactions"
                class="mt-1 mb-3 px-6 py-4 rounded-lg border-2 border-green-800/60 transition-all hover:bg-green-800/20">
                <div class="flex items-center gap-2">
                  <span>{{ group.members.find(m => m.id == transaction.fromId)?.name ?? 'unknown' }}</span>
                  <i class="las la-arrow-right"></i>
                  <span>{{ 'You' }}</span>
                  <span class="ml-auto">{{ transaction.amountCents / 100 }} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GenericPanel>
  </div>
</template>
