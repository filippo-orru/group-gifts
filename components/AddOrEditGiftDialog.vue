<script lang="ts" setup>
import { vShowModal } from '~/utils/frontend';

export type AddOrEditGiftMode =
  { mode: null }
  | { mode: 'add' }
  | { mode: 'edit'; gift: MemberGift; };

const props = defineProps<{
  mode: AddOrEditGiftMode;
  member: GroupMember;
  onClose: (gift?: MemberGift) => void;
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
      buyerId: store.myId,
      price: 0
    }
  }
});
const fields = useState('fields', () => defaultFields);

const addGift = () => {
  props.onClose({
    id: 'placeholder',
    name: fields.value.name,
    date: new Date(fields.value.date).getTime(),
    buyerId: fields.value.buyerId,
    price: fields.value.price,
  });
  fields.value = defaultFields.value;
};

</script>

<template>
  <dialog class="modal" v-show-modal="mode.mode" @close="onClose()">
    <div class="modal-box">
      <div class="flex">
        <h3 class="text-lg font-bold">{{ title }}</h3>
        <form method="dialog" @submit="onClose()" class="ml-auto">
          <button class="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>
      </div>
      <p v-if="mode.mode == 'add'" class="py-4">
        If you bought a gift for {{ member.name }}, add it here.
      </p>
      <div class="flex flex-col gap-2">
        <label class="form-control w-full">
          <div class="label">Gift Name</div>
          <input class="input input-bordered" v-model="fields.name" placeholder="Gift name" />
        </label>
        <label class="form-control w-full">
          <div class="label">Price</div>
          <label class="input input-bordered flex items-center gap-4">
            <input class="w-full" type="number" v-model="fields.price" placeholder="15" />
            <span>€</span>
          </label>
        </label>
        <label class="form-control w-full">
          <div class="label">Date</div>
          <input class="input input-bordered" type="date" v-model="fields.date" />
        </label>
        <label class="form-control w-full">
          <div class="label">Bought by</div>
          <select class="select select-bordered">
            <option v-for="member in group.members" :value="member.id" :selected="member.id === fields.buyerId">
              {{ member.name }}
            </option>
          </select>
        </label>
      </div>
      <div class="modal-action">
        <form method="dialog" @submit="addGift">
          <button class="btn btn-primary" type="submit">
            Add Gift
          </button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @submit="onClose()">
      <button>close</button>
    </form>
  </dialog>
</template>

<style></style>