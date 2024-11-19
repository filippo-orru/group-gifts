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


const remainder = computed(() =>
  (budgeting.expensesSum - budgeting.responsibleMemberOverspend - budgeting.budgetSum * budgeting.groupUnderspendFactor).roundCents());

definePageMeta({
  layout: 'group-required',
})
</script>

<template>
  <div class="h-dvh w-full flex flex-col">
    <NavBar title="Balance" :back="{ href: `/groups/${groupId}` }">
    </NavBar>

    <GenericPanel>
      <div class="grow overflow-y-scroll flex flex-col gap-3 py-4">
        <div class="">
          <h2 class="text-2xl font-bold">Balance</h2>
          <p class="text-neutral">Here you can see how to balance the expenses of the group.
            Make sure all budgets and expenses (gifts) have been added before you start to balance!
          </p>
        </div>

        <div>
          <h3 class="text-lg font-bold">Your expenses</h3>
          <ul class="list-disc pl-3 *:my-2 *:list-item *:list-inside">
            <li>
              You spent
              <b class="py-1 px-2 bg-accent/70 text-accent-content rounded-md">
                {{ budgeting.expensesSum.roundCents() }}€</b>
              on gifts for
              <template v-for="(member, index) in giftsBoughtForWho">
                <MemberLink :member-id="member.id" />{{
                  index < giftsBoughtForWho.length - 2 ? ', ' : index < giftsBoughtForWho.length - 1 ? ' and ' : ''
                }}</template>
            </li>
            <li>
              Your total budget is
              <b class="py-1 px-2 bg-accent/70 text-accent-content rounded-md">
                {{ budgeting.budgetSum.roundCents() }}€</b>
            </li>
            <li v-if="budgeting.responsibleMemberOverspend > 0">
              But your budget gets increased by
              <b>+{{ budgeting.responsibleMemberOverspend.roundCents() }} €</b>
              to
              <b class="py-1 px-2 bg-accent/70 text-accent-content rounded-md">
                {{ (budgeting.budgetSum + budgeting.responsibleMemberOverspend).roundCents() }} €</b>
              because you are responsible for
              <MemberLink :member-id="group.members.find(m => m.responsibleMemberId == group.me.id)!.id" />
              and the total budget was overspent
            </li>
            <li v-if="budgeting.groupUnderspendFactor !== 1">
              However, the group only spent
              <b class="py-1 px-2 bg-accent/70 text-accent-content rounded-md">
                ~{{ Math.round(budgeting.groupUnderspendFactor * 100) }}%
              </b>
              of the total budget
            </li>
            <li v-if="remainder != 0">
              This means you {{ remainder ? 'get back' : 'owe' }}
              <b class="py-1 px-2 bg-accent/70 text-accent-content rounded-md">{{ Math.abs(remainder) }} €</b>
            </li>
            <li v-else>
              This means there is no need to make any transactions to balance your budget!
            </li>
          </ul>
        </div>

        <div v-if="remainder !== 0">
          <h3 class="text-lg font-bold mb-2">Transactions</h3>

          <div>
            <p class="text-neutral" v-if="sendTransactions.length > 0">
              You need to make these transactions so that the budget is balanced.
            </p>

            <div v-for="transaction in sendTransactions"
              class="mt-1 mb-3 px-3 py-4 rounded-lg border border-neutral hover:bg-neutral hover:text-neutral-content">
              <div class="flex items-center gap-2">
                <span>{{
                  transaction.fromId == group.me.id
                    ? 'You'
                    : group.members.find(m => m.id == transaction.fromId)?.name ?? 'unknown'
                }}</span>
                <i class="las la-arrow-right"></i>
                <span>{{
                  transaction.toId == group.me.id
                    ? 'You'
                    : group.members.find(m => m.id == transaction.toId)?.name ?? 'unknown'
                }}</span>
                <span class="ml-auto">{{ transaction.amountCents / 100 }} €</span>
              </div>
            </div>
          </div>

          <div v-if="receiveTransactions.length > 0">
            <p class="text-neutral">
              <b>Others</b> needs to make these transactions so your budget is balanced.
              <template v-if="sendTransactions.length === 0">
                <b>You</b> don't need to make any transactions.
              </template>
            </p>
            <div v-for="transaction in receiveTransactions"
              class="mt-1 mb-3 px-3 py-4 rounded-lg border border-neutral hover:bg-neutral hover:text-neutral-content">
              <div class="flex items-center gap-2">
                <span>{{
                  transaction.fromId == group.me.id
                    ? 'You'
                    : group.members.find(m => m.id == transaction.fromId)?.name ?? 'unknown'
                }}</span>
                <i class="las la-arrow-right"></i>
                <span>{{
                  transaction.toId == group.me.id
                    ? 'You'
                    : group.members.find(m => m.id == transaction.toId)?.name ?? 'unknown'
                }}</span>
                <span class="ml-auto">{{ transaction.amountCents / 100 }} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GenericPanel>
  </div>
</template>
