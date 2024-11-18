<script lang="ts" setup>
import type { AddOrEditGiftMode } from '~/components/AddOrEditGiftDialog.vue';
import type { MemberGift, MemberWishlistItem, OtherMemberWishlistItem, PutBudget, PutOtherWishlist } from '~/utils/types';

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;
const memberId = router.currentRoute.value.params.memberId;

const groupsStore = useGroupsStore()
await useAsyncData('groups', () => groupsStore.getGroups().then(() => true))

const group = groupsStore.groups.find(g => g.id === groupId)!;
const member = group.members.find(m => m.id === memberId)!;

const myBudget = useState<string>(`myBudget-${groupId}-${memberId}`, () => member.myBudget?.toString() ?? '');

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
  const newBought = !wish.bought;
  try {
    const body: PutOtherWishlist = member.wishlist.map((w) => {
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
  ...member.wishlist.filter((wish) => !wish.bought),
  ...member.wishlist.filter((wish) => wish.bought)
]);

const totalBudget = computed(() => member.otherBudgetSum + (member.myBudget ?? 0));

const giftPricesSum = computed(() => member.gifts.reduce((sum, gift) => sum + gift.price, 0));

const pluralize = (count: number) => {
  return count === 1 ? '' : 's';
};

const addOrEditGiftMode: Ref<AddOrEditGiftMode> = ref({ mode: null });

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
        <Transition name="slide-fade">
          <div v-if="shouldAddBudget" class="alert alert-warning">
            <i class="las la-exclamation-triangle text-2xl"></i>
            <p>
              You haven't set a budget for <b>{{ member.name }}</b> yet.
              <br />
              Please set one to help others know how much you can spend.
            </p>
          </div>
        </Transition>

        <form @submit="submitBudget" class="w-full flex flex-col sm:flex-row sm:gap-2 justify-center">
          <span class="label">Your budget for {{ member.name }}</span>
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
          <div v-if="sortedWishes.length == 0" class="mt-6 text-center text-neutral">
            <i class="las la-gift text-3xl"></i>
            <br />
            No wishes yet.
            <br />
            Tell <b>{{ member.name }}</b> to add some!
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
            <h1 class="text-2xl mt-3">Gifts</h1>
            <span class="ml-auto pl-8 text-sm text-neutral">Total budget: {{ totalBudget }} €</span>
          </div>

          <div v-if="member.gifts.length == 0" class="mt-6 text-center text-neutral">
            <i class="las la-shopping-bag text-3xl"></i>
            <br />
            No gifts yet.
            <br />
            If you bought a gift for <b>{{ member.name }}</b>, add it here!
          </div>

          <Transition name="slide-fade">
            <div v-if="totalBudget - giftPricesSum < 0" class="mt-3 alert alert-warning mx-auto max-w-xl">
              <i class="las la-exclamation-triangle text-2xl"></i>
              Overspent by: {{ giftPricesSum - totalBudget }} €
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

          <div v-if="member.gifts.length > 0 || totalBudget" class="ml-auto text-end">
            <p>Sum: {{ giftPricesSum }} €</p>
            <p v-if="totalBudget - giftPricesSum > 0">
              Remaining: {{ totalBudget - giftPricesSum }} €
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

  <Transition>
    <AddOrEditGiftDialog v-if="addOrEditGiftMode.mode" :mode="addOrEditGiftMode" :member="member" :save="addOrEditGift"
      :cancel="cancelAddOrEditGift" />
  </Transition>
</template>
<style>
</style>