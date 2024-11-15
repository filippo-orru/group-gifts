<script lang="ts" setup>
import type { AddOrEditGiftMode } from '~/components/AddOrEditGiftDialog.vue';
import type { MemberGift, MemberWishlistItem, OtherMemberWishlistItem, PutBudget } from '~/utils/types';

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;
const memberId = router.currentRoute.value.params.memberId;

const store = useMyAppStore()
await useAsyncData('groups', () => store.fetch().then(() => true))

const group = store.groups.find(g => g.id === groupId)!;
const member = group.members.find(m => m.id === memberId)!;

const myBudget = useState<string>('myBudget', () => member.myBudget?.toString() ?? '');

const shouldAddBudget = computed(() => member.myBudget === null);

const submitBudget = (event: SubmitEvent) => {
  event.preventDefault();
  let budget: number | null = parseInt(myBudget.value);
  if (isNaN(budget)) {
    budget = null;
  }
  const body: PutBudget = { budget: budget };

  try {
    $fetch(`/api/groups/${groupId}/members/${memberId}/budget`, {
      method: 'PUT',
      body: body,
    });
    member.myBudget = budget;
  } catch (e) {
    console.error(e);
    // TODO show error
  }
};

const toggleBought = (wish: OtherMemberWishlistItem) => {
  wish.bought = !wish.bought;
};

const sortedWishes: ComputedRef<OtherMemberWishlistItem[]> = computed(() => [
  ...member.wishlist.filter((wish) => !wish.bought),
  ...member.wishlist.filter((wish) => wish.bought)
]);

const giftPricesSum = computed(() => member.gifts.reduce((sum, gift) => sum + gift.price, 0));

const pluralize = (count: number) => {
  return count === 1 ? '' : 's';
};

const addOrEditGiftMode: Ref<AddOrEditGiftMode> = useState('showAddGiftDialog', () => ({ mode: null }));

const cancelAddOrEditGift = () => {
  addOrEditGiftMode.value = { mode: null };
}

const addOrEditGift = (gift?: MemberGift) => {
  const originalGiftMode = addOrEditGiftMode.value;

  const gifts = [...member.gifts];
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
    member.gifts = gifts;
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
  <div v-if="member.id == group.me.id" class="p-4 h-screen flex items-center">
    <div class="alert alert-warning">
      <i class="las la-exclamation-triangle text-2xl"></i>
      <p>
        <b>No access.</b>
        Sorry, you aren't allowed to view your own profile or gifts.
      </p>
      <NuxtLink :to="`/groups/${groupId}`" class="btn mt-4">
        <i class="las la-arrow-left text-xl"></i>
        Back to group
      </NuxtLink>
    </div>
  </div>
  <MemberHome v-else activeTab="gifts">
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

        <form @submit="submitBudget" class="w-full flex flex-col sm:flex-row sm:gap-2 justify-center">
          <span class="label">My budget for {{ member.name }}</span>
          <label class="form-control flex flex-row gap-2">
            <label class="w-full input input-bordered flex items-center gap-4">
              <input class="w-full" type="number" v-model="myBudget" placeholder="15" />
              <span>€</span>
            </label>
            <button class="btn btn-primary">Save</button>
          </label>
        </form>

        <hr class="border-neutral/30" />

        <div class="flex flex-col mb-4">
          <h1 class="text-2xl mt-3">{{ member.name }}'s Wishlist</h1>
          <div v-if="sortedWishes.length == 0" class="mt-6 text-center text-lg text-neutral">
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

        <div class="flex flex-col">
          <div class="flex items-baseline">
            <h1 class="text-2xl mt-3">Gifts</h1>
            <span class="ml-auto pl-8 text-sm text-neutral">Total budget: {{ member.totalBudget }} €</span>
          </div>

          <div v-if="member.gifts.length == 0" class="mt-6 text-center text-lg text-neutral">
            No gifts yet. Add one!
          </div>

          <div v-if="member.totalBudget - giftPricesSum < 0" class="alert alert-warning mx-auto max-w-xl">
            <i class="las la-exclamation-triangle text-2xl"></i>
            Overspent by: {{ giftPricesSum - member.totalBudget }} €
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
                    by {{ gift.buyerId == group.me.id ? "You" :
                      group.members.find((member) => member.id == gift.buyerId)?.name ?? "unknown" }},
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

          <div v-if="member.gifts.length > 0 || member.totalBudget" class="ml-auto text-end">
            <p>Sum: {{ giftPricesSum }} €</p>
            <p v-if="member.totalBudget - giftPricesSum > 0">
              Remaining: {{ member.totalBudget - giftPricesSum }} €
            </p>
          </div>

          <button class="mt-2 btn btn-primary ml-auto" @click="addOrEditGiftMode = { mode: 'add' }">
            <i class="las la-plus text-xl"></i>
            Add Gift
          </button>
        </div>
        <div class=" mb-12"></div>
      </div>
    </div>
  </MemberHome>

  <AddOrEditGiftDialog :mode="addOrEditGiftMode" :member="member" :save="addOrEditGift" :cancel="cancelAddOrEditGift" />
</template>
