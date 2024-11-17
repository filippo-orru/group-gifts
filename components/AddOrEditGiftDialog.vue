<script lang="ts" setup>
import { vShowModal } from '~/utils/frontend';

export type AddOrEditGiftMode =
  { mode: null }
  | { mode: 'add' }
  | { mode: 'edit'; gift: MemberGift; };

const props = defineProps<{
  mode: AddOrEditGiftMode;
  member: GroupMember;
  save: (gift?: MemberGift) => void;
  cancel: () => void;
}>();

const router = useRouter();
const groupId = router.currentRoute.value.params.groupId;

const store = useMyAppStore();
const group = store.groups.find(g => g.id === groupId)!;

const title = computed(() => props.mode.mode === 'add' ? 'Add Gift' : 'Edit Gift');

type EditMemberGift = {
  name: string;
  date: string;
  buyerId: string;
  price: number;
}

const defaultFields = computed<EditMemberGift>(() => {
  if (props.mode.mode === 'edit') {
    return {
      ...props.mode.gift,
      date: new Date(props.mode.gift.date).toISOString().substring(0, 10)
    };
  } else {
    return {
      name: '',
      date: new Date().toISOString().substring(0, 10),
      buyerId: group.me.id,
      price: 0
    }
  }
});

const fields = ref(defaultFields.value);

const saveGift = () => {
  props.save({
    id: 'placeholder',
    name: fields.value.name,
    date: new Date(fields.value.date).getTime(),
    buyerId: fields.value.buyerId,
    price: fields.value.price,
  });
  fields.value = defaultFields.value;
};

const deleteGift = () => {
  props.save();
};
</script>

<template>
  <dialog class="modal" v-show-modal="mode.mode" @close="cancel">
    <div class="modal-box">
      <div class="flex">
        <h3 class="text-lg font-bold">{{ title }}</h3>
        <form method="dialog" @submit="cancel" class="ml-auto">
          <button class="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>
      </div>
      <p v-if="mode.mode == 'add'" class="py-4 text-neutral">
        If you bought a gift for {{ member.name }}, add it here.
      </p>
      <div class="flex flex-col gap-4">
        <label class="form-control w-full">
          <div class="label">What's the gift?</div>
          <input class="input input-bordered" v-model="fields.name" placeholder="Gift name" />
        </label>
        <label class="form-control w-full">
          <div class="label">How much was it?</div>
          <label class="input input-bordered flex items-center gap-4">
            <input class="w-full" type="number" v-model="fields.price" placeholder="15" />
            <span>€</span>
          </label>
        </label>
        <div class="flex flex-col gap-4 sm:flex-row">
          <label class="form-control w-full">
            <div class="label">Who bought it?</div>
            <select class="select select-bordered">
              <option :value="group.me.id" :selected="group.me.id === fields.buyerId">
                You
              </option>
              <option v-for="member in group.members" :value="member.id" :selected="member.id === fields.buyerId">
                {{ member.name }}
              </option>
            </select>
          </label>

          <label class="form-control w-full">
            <div class="label">When?</div>
            <input class="input input-bordered" type="date" v-model="fields.date" />
          </label>
        </div>
      </div>
      <div class="modal-action">
        <form v-if="mode.mode === 'edit'" method="dialog" class="mr-auto" @submit="deleteGift">
          <button class="btn btn" type="submit">
            <i class="las la-trash text-xl"></i>
            Delete
          </button>
        </form>

        <form method="dialog" @submit="saveGift">
          <button class="btn btn-primary" type="submit">
            {{ mode.mode === 'add' ? 'Add Gift' : 'Save' }}
          </button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @submit="cancel">
      <button>close</button>
    </form>
  </dialog>
</template>

<style></style>