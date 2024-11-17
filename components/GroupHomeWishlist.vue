<script lang="ts" setup>
import { vFocus } from '~/utils/frontend';
import type { PutMyWishlist } from '~/utils/types';
import { generateId } from '~/utils/utils';

const props = defineProps<{
  group: Group;
}>();

const wishlistItems = ref<MemberWishlistItem[]>(
  props.group.me.wishlist ? [...props.group.me.wishlist] : [{ id: '0', name: '' }]
);

const addItem = () => {
  if (wishlistItems.value.length === 0 || wishlistItems.value[wishlistItems.value.length - 1].name !== '') {
    wishlistItems.value.push({ id: generateId(), name: '' });
  }
};

const changeTimer = ref<NodeJS.Timeout | null>(null);
const onChange = () => {
  // debounce
  if (changeTimer.value) {
    clearTimeout(changeTimer.value);
  }
  changeTimer.value = setTimeout(async () => {
    const body: PutMyWishlist = {
      items: wishlistItems.value
    }
    await $fetch(`/api/groups/${props.group.id}/members/me/wishlist`, {
      method: 'PUT',
      body: body
    });
    props.group.me.wishlist = wishlistItems.value;
    changeTimer.value = null;
  }, 800);
};
</script>

<template>
  <GroupHome tab="wishlist">
    <GenericPanel :disable-padding="false" class="flex flex-col gap-4">
      <h1 class="text-xl">Your Wishlist</h1>
      <p>
        Help your friends know what to get you by adding all your wishes to this list! 
        Your friends can see this list.
      </p>
      <div class="flex flex-col gap-3">
        <div v-for="(item, index) in wishlistItems" :key="item.id" class="flex items-center">
          <span class="rounded-full h-4 w-4 mx-4 border-2 border-neutral"></span>
          <label class="input input-bordered grow flex flex-row gap-2">
            <input type="text" class="" v-model="item.name" v-focus="index == wishlistItems.length - 1"
              placeholder="What do you wish for?" @input="onChange" />
          </label>
        </div>

        <div key="add" class="flex items-center">
          <span class="rounded-full h-4 w-4 mx-4 border-2 border-neutral/60"></span>
          <label class="input input-bordered grow flex flex-row gap-2 border-dashed">
            <input type="text" class="" @focus="addItem" placeholder="Add a wish" />
          </label>
        </div>
      </div>
    </GenericPanel>
  </GroupHome>
</template>

<style></style>