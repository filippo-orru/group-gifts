<script lang="ts" setup>
const props = defineProps<{
  group: Group,
  member: GroupMember,
}>();


const toggleBought = (wish: OtherMemberWishlistItem) => {
  const newBought = !wish.bought;
  try {
    const body: PutOtherWishlist = props.member.wishlist.map((w) => {
      return {
        id: w.id,
        bought: w.id === wish.id ? newBought : w.bought,
      }
    });
    $fetch(`/api/groups/${props.group.id}/members/${props.member.id}/wishlist`, {
      method: 'PUT',
      body: body,
    });

    wish.bought = newBought;
  } catch (e) {
    console.error(e);
  }
};

const sortedWishes: ComputedRef<OtherMemberWishlistItem[]> = computed(() => [
  ...props.member.wishlist.filter((wish) => !wish.bought),
  ...props.member.wishlist.filter((wish) => wish.bought)
]);

const showInviteDialog = ref(false);
</script>

<template>
  <Transition>
    <InviteFriendsModal v-if="showInviteDialog" :invite-id="group.inviteId" :onClose="() => showInviteDialog = false" />
  </Transition>

  <div class="flex flex-col mb-4">
    <h1 class="text-2xl mt-3">{{ $t('memberHome.wishlistTitle', [member.name.capitalize()]) }}</h1>
    <p class="text-neutral">
      <i18n-t v-if="!member.joined" :keypath="'memberHome.notJoinedYet'">
        {{ member.name.capitalize() }}
        <button @click="showInviteDialog = true" class="underline">{{ $t('memberHome.notJoinedYetInvite') }}</button>
      </i18n-t>
    </p>

    <div v-if="sortedWishes.length == 0" class="my-12 text-center text-neutral">
      <i class="las la-gift text-3xl"></i>
      <br />
      <i18n-t :keypath="'memberHome.noWishesYet'">
        <br />
        <b>{{ member.name.capitalize() }}</b>
      </i18n-t>
      <br />
    </div>
    <div class="flex flex-col gap-2 mt-3">
      <div v-for="wish in sortedWishes" :key="wish.id">
        <div class="w-full p-4 rounded-lg flex items-center text-start gap-6">
          <button @click="toggleBought(wish)" class="flex-shrink-0 p-2">
            <span class="rounded-full h-6 w-6 border border-primary flex items-center justify-center
            hover:bg-primary/20 transition-colors">
              <template v-if="wish.bought">✓</template>
            </span>
          </button>
          <span :class="{ 'line-through': wish.bought }">
            <Urlify :text="wish.name" />
          </span>
        </div>
        <!--hr class="border" v-if="index < (notBoughtWishes.length - 1) || boughtWishes.length > 0" /-->
      </div>
    </div>
  </div>
</template>

<style></style>
