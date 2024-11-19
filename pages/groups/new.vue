<script setup lang="ts">
import type { CreateGroup } from '~/utils/types';
import { vFocus } from '~/utils/frontend';

const router = useRouter();

const groupsStore = useGroupsStore();

const minimumMembers = 3;

// Fields
const groupName = ref('');
// Default date: this christmas
const date = ref(new Date(new Date().getFullYear(), 11, 28).toISOString().split('T')[0]);
const memberNames = ref(Array.from({ length: minimumMembers }, () => ''));

const addMember = () => {
    if (memberNames.value[memberNames.value.length - 1] === "") {
        return;
    }
    memberNames.value.push("");
};

const removeMember = (index: number) => {
    if (memberNames.value.length <= minimumMembers) {
        return;
    }
    memberNames.value.splice(index, 1);
};


const submit = async (event: SubmitEvent) => {
    event.preventDefault();

    submitState.value = { state: "loading" };

    // Wait for a bit to show the loading screen
    await new Promise((resolve) => setTimeout(resolve, 2200));

    try {
        const createGroupBody: CreateGroup = {
            name: groupName.value,
            date: new Date(date.value).getTime(),
            memberNames: memberNames.value,
        };
        const group = await groupsStore.createGroup(createGroupBody);

        router.push(`/groups/${group.id}?invite=true`);
    } catch (e) {
        submitState.value = { state: "error" };
        setTimeout(() => {
            submitState.value = { state: "initial" };
        }, 3000);
    }

};

type SubmitState =
    { state: "initial" }
    | { state: "loading" }
    | { state: "error" };

const submitState = ref<SubmitState>({ state: "initial" });

const onMemberInputKeydown = (event: KeyboardEvent, index: number) => {
    if (event.key === "Enter") {
        event.preventDefault();
        if (index === memberNames.value.length - 1) {
            addMember();
        } else {

        }
    } else if (event.key === "Backspace" &&
        memberNames.value.length > 1 && memberNames.value[memberNames.value.length - 1] === "") {
        event.preventDefault();
        removeMember(memberNames.value.length - 1);
    }
};

</script>

<template>
    <NavBar title="Create Group" :back="{ href: '/' }" />
    
    <form @submit="submit">
        <GenericPanel class="mb-4">
            <div class="flex flex-col gap-6">
                <label class="form-control w-full">
                    <div class="label">Group Name</div>
                    <input class="input input-bordered" v-model="groupName" required
                        :placeholder="'Christmas ' + new Date().getFullYear()" />
                </label>
                <label class="form-control w-full">
                    <div class="label">Date</div>
                    <input class="input input-bordered" type="date" v-model="date" />
                </label>
                <div>
                    <div class="label">Members</div>
                    <p class="label pt-0 text-neutral">You need at least {{ minimumMembers }} members</p>
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-2" v-for="(member, index) in memberNames" :key="index">
                            <label class="input input-bordered flex items-center gap-2 grow group"
                                v-focus="index == memberNames.length - 1" aria-autocomplete="none">
                                <input class="grow peer" :placeholder="index == 0 ? 'You' : 'Name'"
                                    v-model="memberNames[index]" required autocomplete="off"
                                    @keydown="(e: KeyboardEvent) => onMemberInputKeydown(e, index)" />

                                <div v-if="index > minimumMembers" class="p-1 h-full transition-all opacity-0 
                                    group-hover:opacity-100 peer-focus:opacity-100 focus-within:opacity-100">
                                    <button v-if="index > 0" type="button" class="h-full aspect-square btn btn-ghost min-h-0 p-0
                                        border border-base-300" @click="removeMember(index)"> - </button>
                                </div>
                            </label>
                        </div>

                        <label class="input input-bordered border-dashed flex items-center gap-2">
                            <span class="opacity-50">+</span>
                            <input class="grow" readonly placeholder="Add member" @focus="addMember" />
                        </label>
                    </div>
                </div>
            </div>
        </GenericPanel>

        <div class="pt-24"></div>

        <AppFooter>
            <div class="ml-auto flex items-center gap-4">
                <span v-if="submitState.state === 'error'" class="text-error">Error creating group</span>
                <button class="btn btn-primary" type="submit">
                    → Next
                </button>
            </div>
        </AppFooter>
    </form>

    <Transition name="fade">
        <div v-if="submitState.state === 'loading'"
            class="fixed inset-0 flex items-center justify-center bg-base-300 bg-opacity-70 pointer-events-auto">
            <span class="text-lg font-bold flex flex-col gap-4 items-center">
                <span class="loading loading-spinner loading-lg"></span>
                Creating group...
            </span>
        </div>
    </Transition>
</template>