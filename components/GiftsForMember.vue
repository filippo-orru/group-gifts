<script lang="ts" setup>
import type { AddOrEditGiftMode } from '~/components/AddOrEditGiftDialog.vue';

const props = defineProps<{
  group: Group,
  member: GroupMember,
}>();

const iAmResponsible = computed(() => props.member.responsibleMemberId == props.group.me.id);
const responsibleName = computed(() => props.group.members.find(m => m.id == props.member.responsibleMemberId)?.name ?? null);

const chatHref = `/groups/${props.group.id}/members/${props.member.id}/chat`;

const totalBudget = computed(() => props.member.otherBudgetSum + (props.member.myBudget?.amount ?? 0));

const giftPricesSum = computed(() => props.member.gifts.reduce((sum, gift) => sum + gift.price, 0));

const addOrEditGiftMode: Ref<AddOrEditGiftMode> = ref({ mode: null });

const cancelAddOrEditGift = () => {
  addOrEditGiftMode.value = { mode: null };
}

const addOrEditGift = async (gift?: MemberGift) => {
  const originalGiftMode = addOrEditGiftMode.value;

  const gifts = [...props.member.gifts];
  switch (originalGiftMode.mode) {
    case null:
      break;
    case 'add':
      if (gift) {
        gifts.push(gift);
      }
      break;
    case 'edit':
      if (gift) {
        const index = gifts.findIndex((g) => g.id === gift.id);
        if (index !== -1) {
          gifts[index] = gift;
        }
      } else {
        const index = gifts.findIndex((g) => g.id === originalGiftMode?.gift.id);
        if (index !== -1) {
          gifts.splice(index, 1);
        }
      }
      break;
  }

  try {
    // Hopefully noone is updating at the same time, or else it's a race condition
    await $fetch(`/api/groups/${props.group.id}/members/${props.member.id}/gifts`, {
      method: 'PUT',
      body: { gifts },
    });
    props.member.gifts = gifts;
  } catch (e) {
    console.error(e);
    // TODO show error
  }
  addOrEditGiftMode.value = { mode: null };
}

const editGift = (gift: MemberGift) => {
  addOrEditGiftMode.value = { mode: 'edit', gift: gift };
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-baseline">
      <h1 class="text-2xl mt-3">{{ $t('memberHome.giftsTitle') }}</h1>
      <span class="ml-auto pl-8 pr-4 text-neutral">{{ $t('memberHome.totalBudget', [totalBudget]) }}</span>
    </div>

    <p class="mt-4 mb-2 text-neutral md:mr-32">
      <i18n-t :keypath="'memberHome.giftsInfo.' + (iAmResponsible ? 'you' : 'someoneElse')">
        <b>{{ totalBudget }} €</b>
        <span>
          <i18n-t keypath="memberHome.ifBudgetExceeded">
            <b>{{ formatEnumeration(
              member.memberIdsWithFlexibleBudget.map(id =>
                id == group.me.id ? $t('memberHome.ifBudgetExceededYou') : group.members.find(m => m.id == id)?.name ??
                  "unknown")
            ) }}</b>
          </i18n-t>
        </span>
        <p class="py-1"></p>
        <b>{{ iAmResponsible ? $t('general.you') : responsibleName }}</b>
        <b>{{ member.name }}</b>
        <NuxtLinkLocale :to="chatHref" class="underline">{{ $t('memberHome.giftsInfo.chat') }}</NuxtLinkLocale>
      </i18n-t>
    </p>

    <div v-if="member.gifts.length == 0" class="mt-6 text-center text-neutral">
      <i class="las la-shopping-bag text-3xl"></i>
      <br />
      <i18n-t :keypath="'memberHome.noGiftsYet'">
        <br />
        <b>{{ member.name }}</b>
      </i18n-t>
    </div>

    <Transition name="slide-fade">
      <div v-if="totalBudget - giftPricesSum < 0" class="mt-3 alert alert-warning text-start mx-auto max-w-xl">
        <div class="flex items-center gap-2">
          <i class="las la-exclamation-triangle text-2xl"></i>
          <i18n-t keypath='memberHome.overspentBy' tag="span">
            <b>{{ giftPricesSum - totalBudget }} €</b>
            <b>{{ formatEnumeration(
              member.memberIdsWithFlexibleBudget.map(id =>
                id == group.me.id ? $t('memberHome.ifBudgetExceededYou') : group.members.find(m => m.id == id)?.name ??
                  "unknown"
              )
            ) }}</b>
          </i18n-t>
        </div>
      </div>
    </Transition>

    <div class="flex flex-col">
      <div v-for="(gift, index) in member.gifts" class="py-2">
        <button @click="editGift(gift)" class="w-full flex items-center gap-2 p-4 rounded-lg 
                hover:bg-neutral hover:text-neutral-content hover:shadow-lg">
          <div class="w-full flex flex-col items-stretch gap-1">
            <div class="flex gap-2 items-center">
              <i class="las la-gift text-xl"></i>
              <span class="text-lg">{{ gift.name }}</span>
              <span class="ml-auto">
                {{ gift.price }} €
              </span>
            </div>
            <div class="flex gap-1 items-center text-sm">
              <i class="las la-gift text-xl invisible"></i>
              <i class="las la-user text-lg"></i>
              <span class="text-start">
                {{ gift.buyerId == group.me.id ?
                  $t('memberHome.giftBoughtBy.you') :
                  $t('memberHome.giftBoughtBy.someoneElse',
                    [group.members.find((member) => member.id == gift.buyerId)?.name ?? "unknown"])
                }},
              </span>
              <i class="las la-clock text-lg"></i>
              {{ formatMessageDay(gift.date) }}
            </div>
          </div>
        </button>

        <!--hr class="border" v-if="index < (member.gifts.length - 1)" /-->
      </div>
    </div>

    <div v-if="member.gifts.length > 0 || totalBudget" class="ml-auto pr-4 text-end">
      <p>{{ $t('memberHome.expensesSum', giftPricesSum) }}</p>
      <p v-if="totalBudget - giftPricesSum > 0">
        {{ $t('memberHome.remainingBudget', totalBudget - giftPricesSum) }}
      </p>
    </div>

    <button class="mt-3 btn btn-primary ml-auto" @click="addOrEditGiftMode = { mode: 'add' }">
      <i class="las la-plus text-xl"></i>
      {{ $t('memberHome.addGift') }}
    </button>

    <Transition>
      <AddOrEditGiftDialog v-if="addOrEditGiftMode.mode" :mode="addOrEditGiftMode" :member="member"
        :save="addOrEditGift" :cancel="cancelAddOrEditGift" />
    </Transition>
  </div>
</template>

<style></style>