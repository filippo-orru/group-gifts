<script lang="ts" setup>
import type { MemberGift, MemberWishlistItem, MyBudget, OtherMemberWishlistItem, PutBudget, PutOtherWishlist } from '~/utils/types';
import '~/utils/extensions';

definePageMeta({
  layout: 'member-required',
})

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId as string;
const memberId = router.currentRoute.value.params.memberId as string;

const groupsStore = useGroupsStore()
const group = await groupsStore.getGroup(groupId);
const member = computed(() => group.value.members.find(m => m.id === memberId)!);

const iAmResponsible = computed(() => member.value.responsibleMemberId == group.value.me.id);
const responsibleName: ComputedRef<string | null> = computed(() => group.value.secretMode ? null : group.value.members.find(m => m.id == member.value.responsibleMemberId)?.name ?? null);
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

        <WishlistOfMember :group="group" :member="member" />

        <hr class="border-neutral/30" />

        <GiftsForMember :group="group" :member="member" />
        <div class=" mb-12"></div>
      </div>
    </div>
  </MemberHome>
</template>
<style></style>