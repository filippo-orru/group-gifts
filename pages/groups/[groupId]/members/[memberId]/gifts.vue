<script lang="ts" setup>
import type { AddOrEditGiftMode } from '~/components/AddOrEditGiftDialog.vue';
import type { MemberGift, MemberWishlistItem } from '~/utils/common-types';
const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;
const memberId = router.currentRoute.value.params.memberId;

const store = useMyAppStore()
await useAsyncData('groups', () => store.fetch().then(() => true))

const group = store.groups.find(g => g.id === groupId)!;
const member = group.members.find(m => m.id === memberId)!;

const myBudget = useState<string>('myBudget', () => member.myBudget?.toString() ?? '');

const toggleBought = (wish: MemberWishlistItem) => {
  wish.bought = !wish.bought;
};

const sortedWishes = computed(() => [
  ...member.wishlist.filter((wish) => !wish.bought),
  ...member.wishlist.filter((wish) => wish.bought)
]);

const submitBudget = (event: SubmitEvent) => {
  event.preventDefault();
  member.myBudget = parseInt(myBudget.value);
  // TODO api call
};

const giftPricesSum = computed(() => member.gifts.reduce((sum, gift) => sum + gift.price, 0));

const pluralize = (count: number) => {
  return count === 1 ? '' : 's';
};

const formatDate = (date: number) => {
  const now = new Date();
  const givenDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - givenDate.getTime());
  if (diffTime < 1000 * 60 * 60) { // less than an hour
    return 'just now';
  } else if (diffTime < 1000 * 60 * 60 * 24) { // less than a day
    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    return `${diffHours} hour${pluralize(diffHours)} ago`;
  } else if (diffTime < 1000 * 60 * 60 * 24 * 7) { // less than a week
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${pluralize(diffDays)} ago`;
  } else {
    return givenDate.toLocaleDateString();
  }
};

const shouldAddBudget = useState('shouldAddBudget', () => member.myBudget === null);

const addOrEditGiftMode: Ref<AddOrEditGiftMode> = useState('showAddGiftDialog', () => ({ mode: null }));

const addOrEditGift = (gift?: MemberGift) => {
  const originalGiftMode = addOrEditGiftMode.value;

  if (originalGiftMode.mode === null) {
    return;
  } else if (originalGiftMode.mode === 'add') {
    if (gift) {
      member.gifts.push(gift);
    }
  } else {
    if (gift) {
      const index = member.gifts.findIndex((g) => g.id === gift.id);
      if (index !== -1) {
        member.gifts[index] = gift;
      }
    } else {
      const index = member.gifts.findIndex((g) => g.id === originalGiftMode?.gift.id);
      if (index !== -1) {
        member.gifts.splice(index, 1);
      }
    }
  }
  addOrEditGiftMode.value = { mode: null };
}

const editGift = (gift: MemberGift) => {
  addOrEditGiftMode.value = { mode: 'edit', gift: gift };
}

</script>

<template>
  <MemberHome activeTab="gifts">
    <div class="grow overflow-y-scroll">
      <div class="flex flex-col gap-4 px-5 py-3 md:py-7">
        <div v-if="shouldAddBudget" class="alert alert-warning">
          <i class="las la-exclamation-triangle text-2xl"></i>
          <p>
            You haven't set a budget for <b>{{ member.name }}</b> yet.
            <br />
            Please set one to help others know how much you can spend.
          </p>
        </div>

        <div class="flex">
          <form @submit="submitBudget" class="w-full flex flex-col sm:flex-row gap-2 justify-center">
            <label class="text-lg form-control flex flex-col sm:flex-row gap-2 sm:gap-6">
              <div class="label">My budget for {{ member.name }}</div>
              <label class="input input-bordered flex items-center gap-4">
                <input class="w-full" type="number" v-model="myBudget" placeholder="15" />
                <span>€</span>
              </label>
            </label>
            <button class="btn btn-primary">Save</button>
          </form>
        </div>

        <hr class="border-neutral/30" />

        <div class="flex flex-col gap-6 mb-4">
          <h1 class="text-2xl">{{ member.name }}'s Wishlist</h1>
          <div v-if="member.gifts.length == 0" class="text-center text-lg text-primary-content">
            No wishes yet. Tell {{ member.name }} to add some!
          </div>
          <div class="flex flex-col gap-2">
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

        <div class="flex flex-col gap-4">
          <div class="flex items-baseline">
            <h1 class="text-2xl">
              Gifts
            </h1>
            <span class="ml-auto pl-8">Total budget: {{ member.totalBudget }} €</span>
          </div>

          <div v-if="member.gifts.length == 0" class="text-center text-lg text-primary-content">
            No gifts yet
          </div>

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
                    by {{ group.members.find((member) => member.id == gift.buyerId)?.name ?? "unknown" }},
                    <i class="las la-clock text-lg"></i>
                    {{ formatDate(gift.date) }}
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

          <div class="ml-auto text-end">
            <p>Sum: {{ giftPricesSum }} €</p>
            <p>
              <span v-if="member.totalBudget - giftPricesSum > 0">Remaining:</span>
              <span v-else>Overspent by:</span>
              {{ member.totalBudget - giftPricesSum }} €
            </p>
          </div>

          <button class="btn btn-primary ml-auto" @click="addOrEditGiftMode = { mode: 'add' }">
            <i class="las la-plus text-xl"></i>
            Add Gift
          </button>
        </div>
        <div class=" mb-12"></div>
      </div>
    </div>
  </MemberHome>

  <AddOrEditGiftDialog :mode="addOrEditGiftMode" :member="member" :on-close="addOrEditGift" />
</template>
