<script setup lang="ts">
import AppFooter from '~/components/AppFooter.vue';
import InviteFriendsModal from '~/components/InviteFriendsModal.vue';

const groupName = useState('groupName', () => '');

// Default date: this christmas
const date = useState('date', () => new Date(new Date().getFullYear(), 11, 28).toISOString().split('T')[0]);
const memberNames = ref<string[]>([""]);

const addMember = () => {
    memberNames.value.push("");
};

const removeMember = (index: number) => {
    memberNames.value.splice(index, 1);
};

const vFocus = {
    mounted(el: HTMLElement, binding: { value: any }) {
        if (binding.value) {
            el.focus();
        }
    },
    updated(el: HTMLElement, binding: { value: any, oldValue: any }) {
        if (binding.value && !binding.oldValue) {
            el.focus();
        }
    },
};


const submit = (event: SubmitEvent) => {
    event.preventDefault();

    submitState.value = { state: "loading" };
    setTimeout(() => {
        submitState.value = {
            state: "success",
            groupId: "1234",
            inviteLink: "https://example.com/invite/1234"
        };
    }, 2000);
};

type SubmitState =
    { state: "initial" }
    | { state: "loading" }
    | { state: "error" }
    | {
        state: "success";
        groupId: string;
        inviteLink: string;
    };

const submitState = ref<SubmitState>({ state: "initial" });

const router = useRouter();

const onCloseModal = (groupId: string) => () => {
    router.push(`/groups/${groupId}`);
};

</script>

<template>
    <InviteFriendsModal v-if="submitState.state === 'success'" :inviteLink="submitState.inviteLink"
        :onClose="onCloseModal(submitState.groupId)" />

    <!--Loading overlay-->
    <div class="fixed inset-0 z-10 flex items-center justify-center
    bg-base-300 bg-opacity-70 transition-opacity duration-300" :class="{
        'opacity-100 pointer-events-auto': submitState.state === 'loading',
        'opacity-0 pointer-events-none': submitState.state !== 'loading'
    }">
        <span class="text-lg font-bold flex flex-col gap-4 items-center">
            <span class="loading loading-spinner loading-lg"></span>
            Creating group...
        </span>
    </div>

    <NavBar title="Create Group" :back="{ href: '/' }" />
    <form @submit="submit">
        <GenericPanel class="mb-4">
            <div class="flex flex-col gap-6">
                <label class="form-control w-full">
                    <div class="label">Group Name</div>
                    <input class="input input-bordered" v-model="groupName"
                        :placeholder="'Christmas ' + new Date().getFullYear()" />
                </label>
                <label class="form-control w-full">
                    <div class="label">Date</div>
                    <input class="input input-bordered" type="date" v-model="date" />
                </label>
                <div>
                    <div class="label">Members</div>
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-2" v-for="(member, index) in memberNames" :key="index">
                            <label class="input input-bordered flex items-center gap-2 grow"
                                v-focus="index == memberNames.length - 1">
                                <input class="grow" :placeholder="index == 0 ? 'You' : 'Name'" />
                            </label>
                            <button v-if="index != 0" class="rounded-full border border- w-[48px]"
                                @click="removeMember(index)">
                                -
                            </button>
                        </div>

                        <label class="input input-bordered border-dashed flex items-center gap-2">
                            <span class="opacity-50">+</span>
                            <input class="grow" placeholder="Add member" @focus="addMember" />
                        </label>
                    </div>
                </div>
            </div>
        </GenericPanel>

        <div class="pt-24"></div>

        <AppFooter>
            <button class="btn btn-primary ml-auto" type="submit">
                → Next
            </button>
        </AppFooter>
    </form>
</template>