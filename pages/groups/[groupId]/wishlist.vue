<script lang="ts" setup>
import { vFocus } from '~/utils/frontend';
import type { PutMyWishlist } from '~/utils/types';
import { generateId } from '~/utils/utils';

definePageMeta({
  layout: 'group-required',
})

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;

const groupsStore = useGroupsStore()
const group = await groupsStore.getGroup(groupId);

const wishlistItems = ref<MemberWishlistItem[]>(
  group.value.me.wishlist ? [...group.value.me.wishlist] : [{ id: '0', name: '' }]
);

const addItem = () => {
  if (wishlistItems.value.length === 0 || wishlistItems.value[wishlistItems.value.length - 1].name !== '') {
    wishlistItems.value.push({ id: generateId(), name: '' });
  }
};

const state: Ref<'saved' | 'saving' | 'error'> = ref('saved');

const changeTimer = ref<NodeJS.Timeout | null>(null);
const onChange = () => {
  // debounce
  state.value = 'saving';
  if (changeTimer.value) {
    clearTimeout(changeTimer.value);
  }
  changeTimer.value = setTimeout(async () => {
    const body: PutMyWishlist = {
      items: wishlistItems.value
    }
    try {
      await $fetch(`/api/groups/${group.value.id}/members/me/wishlist`, {
        method: 'PUT',
        body: body
      });
      group.value.me.wishlist = wishlistItems.value;
      state.value = 'saved';
    } catch (e) {
      state.value = 'error';
    }
    changeTimer.value = null;
  }, 800);
};

const onKeydown = (event: KeyboardEvent, index: number) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addItem();

    // } else if (event.key === "Backspace" && memberNames.value[index].name === "") {
    //     event.preventDefault();
    //     removeMember(index);
    }
};
</script>

<template>
  <GroupHome tab="wishlist">
    <GenericPanel :disable-padding="false" class="flex flex-col gap-4">
      <div class="p-2">
        <h1 class="text-2xl font-bold">{{ $t('wishlist.title') }}</h1>
        <p class="text-neutral">{{ $t('wishlist.description') }}</p>
      </div>
      <div class="flex flex-col gap-3">
        <div v-for="(item, index) in wishlistItems" :key="item.id" class="flex items-center">
          <span class="rounded-full h-4 w-4 mx-4 border-2 border-neutral"></span>
          <label class="input input-bordered grow flex flex-row gap-2">
            <input type="text" class="w-full" v-model="item.name" v-focus="index == wishlistItems.length - 1"
              :placeholder="$t('wishlist.placeholder')" @input="onChange" @keydown="(e: KeyboardEvent) => onKeydown(e, index)" />
          </label>
        </div>

        <div key="add" class="flex items-center">
          <span class="rounded-full h-4 w-4 mx-4 border-2 border-neutral/60"></span>
          <label class="input input-bordered grow flex flex-row gap-2 border-dashed">
            <input type="text" class="w-full" @focus="addItem" :placeholder="$t('wishlist.add')" readonly/>
          </label>
        </div>

        <div class="ml-auto text-neutral text-sm">
          <Transition name="fade" mode="out-in">
            <span v-if="state === 'saving'">{{ $t('wishlist.saving') }}</span>
            <span v-else-if="state === 'saved'">{{ $t('wishlist.saved') }}</span>
            <span v-else-if="state === 'error'">{{ $t('wishlist.error') }}</span>
          </Transition>
        </div>
      </div>
    </GenericPanel>
  </GroupHome>
</template>

<style></style>
