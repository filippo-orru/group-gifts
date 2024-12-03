<script lang="ts" setup>
import type { MemberGift, MemberWishlistItem, MyBudget, OtherMemberWishlistItem, PutBudget, PutOtherWishlist } from '~/utils/types';
import '~/utils/extensions';

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;
const memberId = router.currentRoute.value.params.memberId as string;

const groupsStore = useGroupsStore()
const group = await groupsStore.getGroup(groupId);
const member = computed(() => group.value.members.find(m => m.id === memberId)!);

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

const iAmResponsible = computed(() => member.value.responsibleMemberId == group.value.me.id);
const responsibleName: ComputedRef<string | null> = computed(() => group.value.secretMode ? null : group.value.members.find(m => m.id == member.value.responsibleMemberId)?.name ?? null);

definePageMeta({
  layout: 'member-required',
})
</script>

<template>
  <MemberHome activeTab="gifts">
    <div class="grow overflow-y-scroll">
      <div class="flex flex-col gap-4 px-5">
        <div v-if="iAmResponsible || responsibleName"
          class="my-1 px-3 py-1 rounded-lg bg-base-200 flex items-center justify-center gap-2">
          <i class="las la-info-circle text-2xl"></i>
          <i18n-t :keypath="'memberHome.whoIsResponsibleInfo.' + (iAmResponsible ? 'you' : 'someoneElse')" tag='span'>
            <b>{{ iAmResponsible ? $t('general.you') : responsibleName }}</b>
            <b>{{ member.name }}</b>
          </i18n-t>
        </div>

        <MyBudgetForMember :group="group" :member="member" />

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
              <button @click="toggleBought(wish)" class="w-full p-4 rounded-lg flex items-center text-start gap-6
                hover:bg-neutral hover:text-neutral-content hover:shadow-lg group">
                <div class="flex-shrink-0 rounded-full h-6 w-6 border border-primary flex items-center justify-center
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

        <GiftsForMember :group="group" :member="member" />
        <div class=" mb-12"></div>
      </div>
    </div>
  </MemberHome>
</template>
<style></style>