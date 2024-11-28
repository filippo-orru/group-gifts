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
    <NavBar :title="$t('balance.title')" :href="`/groups/${groupId}`">
    </NavBar>

    <GenericPanel>
      <div class="grow overflow-y-scroll flex flex-col gap-3 py-4">
        <div class="">
          <h1 class="text-2xl font-bold mb-2">{{ $t('balance.title') }}</h1>
          <p class="text-neutral mb-1">{{ $t('balance.info1') }}</p>
          <p class="text-neutral">
            {{ $t('balance.info2') }}
          </p>
        </div>

        <div class="mt-4 mb-3">
          <h3 class="text-lg font-bold">{{ $t('balance.calculation') }}</h3>
          <div class="w-full max-w-xl mx-auto *:py-5 *:flex *:border-neutral/50 *:border-t">
            <div class="!border-t-0">
              <span class="">
                {{ $t('balance.yourExpenses') }}
                <div class="tooltip"
                  :data-tip="$t('balance.yourExpensesTooltip', [formatEnumeration(giftsBoughtForWho.map(m => m.name))])">
                  <i class="las la-info-circle"></i>
                </div>
              </span>
              <span class="ml-auto">
                <b class="mr-3">
                  + {{ budgeting.expensesSum.roundCents() }} €</b>
              </span>
            </div>
            <div>
              <span>{{ $t('balance.yourBudget') }}</span>
              <span class="ml-auto">
                <b class="mr-3">
                  - {{ budgeting.budgetSum.roundCents() }} €</b>
              </span>
            </div>
            <div v-if="budgeting.overspend.amount > 0">
              <span>
                {{ $t('balance.yourOverspend') }}
                <div class="tooltip"
                  :data-tip="$t('balance.yourOverspendTooltip', [
                    formatEnumeration(budgeting.overspend.forMemberIds.map(id => group.members.find(m => m.id == id)?.name))])">
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
                {{ $t('balance.yourUnderspend') }}
                <div class="tooltip"
                  :data-tip="$t('balance.yourUnderspendTooltip', [
                    formatEnumeration(budgeting.underspend.forMemberIds.map(id => group.members.find(m => m.id == id)?.name))])">
                  <i class="las la-info-circle"></i>
                </div>
              </span>
              <span class="ml-auto">
                <b class="mr-3">
                  + {{ budgeting.underspend.amount.roundCents() }} €
                </b>
              </span>
            </div>
            <div>
              <span>
                {{ $t('balance.result') }}
              </span>
              <span class="ml-auto">
                <b class="py-1 px-3 bg-accent/70 text-accent-content rounded-md">
                  = {{ (-budgeting.remainder).roundCents() }} €
                </b>
              </span>
            </div>
          </div>
        </div>

        <h3 class="text-lg font-bold mt-4 mb-2">{{ $t('balance.transactions') }}</h3>

        <div v-if="budgeting.remainder === 0">
          <p class="text-neutral">
            {{ $t('balance.noNeedToMakeTransactions') }}
          </p>
        </div>
        <div v-else>
          <div v-if="sendTransactions.length > 0">
            <p class="text-neutral">
              {{ $t('balance.youNeedToMakeTheseTransactions') }}
            </p>

            <div class="max-w-xl mx-auto">
              <Transaction v-for="transaction in sendTransactions" :transaction="transaction" :group="group" />
            </div>
          </div>

          <div v-if="receiveTransactions.length > 0">
            <p class="text-neutral mb-3">
              {{ $t('balance.othersNeedToMakeTheseTransactions') }}
              <template v-if="sendTransactions.length === 0">
                {{ $t('balance.youDontNeedToMakeTransactions') }}
              </template>
            </p>

            <div class="max-w-xl mx-auto">
              <Transaction v-for="transaction in receiveTransactions" :transaction="transaction" :group="group" />
            </div>
          </div>
        </div>
      </div>
    </GenericPanel>
  </div>
</template>
