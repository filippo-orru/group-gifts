<script lang="ts" setup>
import type { AddOrEditGiftMode } from '~/components/AddOrEditGiftDialog.vue';
import type { MemberGift, MemberWishlistItem, MyBudget, OtherMemberWishlistItem, PutBudget, PutOtherWishlist } from '~/utils/types';
import '~/utils/extensions';

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;
const memberId = router.currentRoute.value.params.memberId as string;

const groupsStore = useGroupsStore()
await useAsyncData('groups', () => groupsStore.getGroups().then(() => true))

const group = computed(() => groupsStore.groups.find(g => g.id === groupId)!);
const member = computed(() => group.value.members.find(m => m.id === memberId)!);

const myBudget = ref<string>(member.value.myBudget?.amount?.toString() ?? '');
const myBudgetIsFlexible = ref<boolean>(member.value.myBudget?.flexible ?? false);

const shouldAddBudget = computed(() => member.value.myBudget === null);

const submitBudget = async (event: SubmitEvent) => {
  event.preventDefault();

  let budget: number | null = parseInt(myBudget.value);
  if (isNaN(budget)) {
    budget = null;
  }
  const body: PutBudget = {
    amount: budget,
    flexible: myBudgetIsFlexible.value,
  };

  try {
    groupsStore.updateMemberBudget(groupId, memberId, body);
  } catch (e) {
    console.error(e);
    // TODO show error
  }
};

const toggleBought = (wish: OtherMemberWishlistItem) => {
  const newBought = !wish.bought;
  try {
    const body: PutOtherWishlist = member.value.wishlist.map((w) => {
      return {
        id: w.id,
        bought: w.id === wish.id ? newBought : w.bought,
      }
    });
    $fetch(`/api/groups/${groupId}/members/${memberId}/wishlist`, {
      method: 'PUT',
      body: body,
    });

    wish.bought = newBought;
  } catch (e) {
    console.error(e);
  }
};

const sortedWishes: ComputedRef<OtherMemberWishlistItem[]> = computed(() => [
  ...member.value.wishlist.filter((wish) => !wish.bought),
  ...member.value.wishlist.filter((wish) => wish.bought)
]);

const totalBudget = computed(() => member.value.otherBudgetSum + (member.value.myBudget?.amount ?? 0));

const giftPricesSum = computed(() => member.value.gifts.reduce((sum, gift) => sum + gift.price, 0));

const addOrEditGiftMode: Ref<AddOrEditGiftMode> = ref({ mode: null });

const cancelAddOrEditGift = () => {
  addOrEditGiftMode.value = { mode: null };
}

const addOrEditGift = (gift?: MemberGift) => {
  const originalGiftMode = addOrEditGiftMode.value;

  const gifts = [...member.value.gifts];
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
    $fetch(`/api/groups/${groupId}/members/${memberId}/gifts`, {
      method: 'PUT',
      body: { gifts },
    });
    member.value.gifts = gifts;
  } catch (e) {
    console.error(e);
    // TODO show error
  }
  addOrEditGiftMode.value = { mode: null };
}

const editGift = (gift: MemberGift) => {
  addOrEditGiftMode.value = { mode: 'edit', gift: gift };
}

const iAmResponsible = member.value.responsibleMemberId == group.value.me.id;

// ['You', 'are', 'know'] or ['John', 'is', 'knows']
const responsibleName = group.value.members.find(m => m.id == member.value.responsibleMemberId)?.name ?? null;

const chatHref = `/groups/${groupId}/members/${memberId}/chat`;

definePageMeta({
  layout: 'member-required',
})
</script>

<template>
  <MemberHome activeTab="gifts">
    <div class="grow overflow-y-scroll">
      <div class="flex flex-col gap-4 px-5">
        <div class="mx-5 my-1 p-1 rounded-lg bg-base-200 flex items-center justify-center gap-2">
          <i class="las la-info-circle text-2xl"></i>
          <i18n-t :keypath="'memberHome.whoIsResponsibleInfo.' + (iAmResponsible ? 'you' : 'someoneElse')" tag='span'>
            <b>{{ iAmResponsible ? $t('general.you') : responsibleName }}</b>
            <b>{{ member.name }}</b>
          </i18n-t>
        </div>
        <Transition name="slide-fade">
          <div v-if="shouldAddBudget" class="alert alert-warning">
            <i class="las la-exclamation-triangle text-2xl"></i>
            <p>
              <i18n-t :keypath="'memberHome.mustSetBudget.0'">
                <b>{{ member.name }}</b>
              </i18n-t>
              <br />
              {{ $t('memberHome.mustSetBudget.1') }}
            </p>
          </div>
        </Transition>

        <div class="flex flex-col mb-4">
          <h1 class="text-2xl">Budget</h1>
          <p class="text-neutral">
            <i18n-t :keypath="'memberHome.budgetInfo.' + (iAmResponsible ? 'you' : 'someoneElse')" tag='span'>
              <b>{{ member.name }}</b>
              <b>{{ responsibleName }}</b>
            </i18n-t>
          </p>


          <form @submit="submitBudget"
            class="mt-4 form-control flex flex-col sm:ml-auto sm:flex-row gap-4 sm:justify-end">
            <label class="w-full input input-bordered flex items-center gap-4">
              <input class="w-full" type="number" v-model="myBudget" placeholder="10" />
              <span>€</span>
            </label>

            <div class="indicator w-full">
              <button class="btn w-full" :class="{ 'btn-accent': myBudgetIsFlexible }"
                @click="myBudgetIsFlexible = !myBudgetIsFlexible" type="button">
                <i class="las text-xl" :class="myBudgetIsFlexible ? 'la-check' : 'la-times'"></i>
                <span class="ml-2">{{ $t('memberHome.flexibleBudget') }}</span>
              </button>

              <div class="tooltip tooltip-left sm:tooltip-top before:shadow-md before:z-10 after:z-10"
                :data-tip="$t('memberHome.flexibleBudgetInfo')">
                <div class="indicator-item rounded-full w-7 h-7 bg-neutral text-neutral-content">
                  <i class="ml-auto las la-question-circle text-xl"></i>
                </div>
              </div>

            </div>

            <button class="btn btn-primary">{{ $t('memberHome.saveBudget') }}</button>
          </form>
        </div>

        <hr class="border-neutral/30" />

        <div class="flex flex-col mb-4">
          <h1 class="text-2xl mt-3">{{ $t('memberHome.wishlistTitle', [member.name.capitalize()]) }}</h1>
          <div v-if="sortedWishes.length == 0" class="mt-6 text-center text-neutral">
            <i class="las la-gift text-3xl"></i>
            <br />
            <i18n-t :keypath="'memberHome.noWishesYet'">
              <br />
              <b>{{ member.name }}</b>
            </i18n-t>
          </div>
          <div class="flex flex-col gap-2 mt-3">
            <div v-for="(wish, index) in sortedWishes" :key="wish.id">
              <button @click="toggleBought(wish)" class="w-full p-4 rounded-lg flex align-center gap-6
                hover:bg-neutral hover:text-neutral-content hover:shadow-lg group">
                <div class="rounded-full h-6 w-6 border border-primary flex items-center justify-center
                group-hover:border-neutral-content">
                  <span v-if="wish.bought">✓</span>
                </div>
                <span :class="{ 'line-through': wish.bought }">
                  {{ wish.name }}
                </span>
              </button>
              <!--hr class="border" v-if="index < (notBoughtWishes.length - 1) || boughtWishes.length > 0" /-->
            </div>
          </div>
        </div>

        <hr class="border-neutral/30" />

        <div class="flex flex-col">
          <div class="flex items-baseline">
            <h1 class="text-2xl mt-3">{{ $t('memberHome.giftsTitle') }}</h1>
            <span class="ml-auto pl-8 pr-4 text-neutral">{{ $t('memberHome.totalBudget', [totalBudget]) }}</span>
          </div>
          <span class="mt-4 mb-2 text-neutral md:mr-32">
            <i18n-t :keypath="'memberHome.giftsInfo.' + (iAmResponsible ? 'you' : 'someoneElse')">
              <b>{{ totalBudget }} €</b>
              <b>{{ responsibleName }}</b>
              <b>{{ member.name }}</b>
              <NuxtLinkLocale :to="chatHref" class="underline">{{ $t('memberHome.giftsInfo.chat') }}</NuxtLinkLocale>
            </i18n-t>
          </span>

          <div v-if="member.gifts.length == 0" class="mt-6 text-center text-neutral">
            <i class="las la-shopping-bag text-3xl"></i>
            <br />
            <i18n-t :keypath="'memberHome.noGiftsYet'">
              <br />
              <b>{{ member.name }}</b>
            </i18n-t>
          </div>

          <Transition name="slide-fade">
            <div v-if="totalBudget - giftPricesSum < 0" class="mt-3 alert alert-warning mx-auto max-w-xl">
              <div class="flex items-center gap-2">
                <i class="las la-exclamation-triangle text-2xl"></i>
                <i18n-t keypath='memberHome.overspentBy' tag="span">
                  <b>{{ giftPricesSum - totalBudget }} €</b>
                  <b>{{
                    formatEnumeration(member.memberIdsWithFlexibleBudget.map(id =>
                      id == group.me.id ? $t('general.you') : group.members.find(m => m.id == id)?.name ?? "unknown"
                    )) }}</b>
                </i18n-t>
              </div>
            </div>
          </Transition>

          <div class="flex flex-col">
            <div v-for="(gift, index) in member.gifts" class="py-2">
              <button @click="editGift(gift)" class="w-full flex items-center gap-2 p-4 rounded-lg 
                hover:bg-neutral hover:text-neutral-content hover:shadow-lg">
                <div class="flex flex-col items-start gap-1">
                  <div class="flex gap-2 items-center">
                    <i class="las la-gift text-xl"></i>
                    <span class="text-lg">{{ gift.name }}</span>
                  </div>
                  <div class="flex gap-1 items-center text-sm">
                    <i class="las la-gift text-xl invisible"></i>
                    <i class="las la-user text-lg"></i>
                    {{ gift.buyerId == group.me.id ?
                      $t('memberHome.giftBoughtBy.you') :
                      $t('memberHome.giftBoughtBy.someoneElse',
                        [group.members.find((member) => member.id == gift.buyerId)?.name ?? "unknown"])
                    }},
                    <i class="las la-clock text-lg"></i>
                    {{ formatMessageDay(gift.date) }}
                  </div>
                </div>
                <div class="grow"></div>
                <div class="w-12 text-end">
                  {{ gift.price }} €
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
        </div>
        <div class=" mb-12"></div>
      </div>
    </div>
  </MemberHome>

  <Transition>
    <AddOrEditGiftDialog v-if="addOrEditGiftMode.mode" :mode="addOrEditGiftMode" :member="member" :save="addOrEditGift"
      :cancel="cancelAddOrEditGift" />
  </Transition>
</template>
<style></style>