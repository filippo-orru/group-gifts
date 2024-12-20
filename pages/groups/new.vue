<script setup lang="ts">
import type { CreateGroup } from '~/utils/types';
import { vFocus } from '~/utils/frontend';

const localePath = useLocalePath();
const router = useRouter();

const groupsStore = useGroupsStore();

const minimumMembers = 3;

// Fields
const groupName = ref('');
const hasMaxBudget: Ref<boolean> = ref(false);
const maxBudget: Ref<number> = ref(10);
const secretMode = ref(false);
// Default date: this christmas
const date = ref(new Date(new Date().getFullYear(), 11, 28).toISOString().split('T')[0]);
const memberNames = ref(Array.from({ length: minimumMembers }, () => ({ name: '', focus: false })));

const addMember = (index: number) => {
    if (memberNames.value[index].name === "") {
        return;
    } else if (index < memberNames.value.length - 1) {
        focusMemberName(index + 1);
    } else {
        memberNames.value.splice(index + 1, 0, { name: '', focus: false });
        focusMemberName(index + 1);
    }
};

const focusMemberName = (index: number) => {
    memberNames.value[index].focus = true;
    nextTick(() => {
        memberNames.value[index].focus = false;
    });
};

const removeMember = (index: number) => {
    if (memberNames.value.length <= minimumMembers) {
        focusMemberName(Math.max(0, index - 1));
    } else {
        memberNames.value.splice(index, 1);
        focusMemberName(index - 1);
    }
};


const submit = async (event: SubmitEvent) => {
    event.preventDefault();

    submitState.value = { state: "loading" };


    try {
        const createGroupBody: CreateGroup = {
            name: groupName.value,
            date: new Date(date.value).getTime(),
            memberNames: memberNames.value.map(m => m.name),
            maxBudget: hasMaxBudget.value ? maxBudget.value : null,
            secretMode: secretMode.value,
        };
        const group = await groupsStore.createGroup(createGroupBody);

        router.push(localePath(`/groups/${group.id}?invite=true`));
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
        addMember(index);

    } else if (event.key === "Backspace" && memberNames.value[index].name === "") {
        event.preventDefault();
        removeMember(index);
    }
};

</script>

<template>
    <NavBar :title="$t('newGroup.title')" :href="'/'" />

    <form @submit="submit">
        <GenericPanel class="mb-4">
            <div class="flex flex-col gap-6">
                <label class="form-control w-full">
                    <div class="label">{{ $t('newGroup.groupName') }}</div>
                    <input class="input input-bordered" v-model="groupName" required
                        :placeholder="$t('newGroup.groupNamePlaceholder', { year: new Date().getFullYear() })" />
                </label>
                <label class="form-control w-full">
                    <div class="label">{{ $t('newGroup.date') }}</div>
                    <input class="input input-bordered" type="date" v-model="date" />
                </label>
                <div class="form-control w-full">
                    <label class="mx-1">
                        <input type="checkbox" v-model="hasMaxBudget" />
                        <span class="ml-2">{{ $t('newGroup.hasMaxBudget') }}</span>
                    </label>
                    <div class="label text-neutral text-md">{{ $t('newGroup.maxBudgetDescription') }}</div>
                    <label v-if="hasMaxBudget" class="input input-bordered flex items-center gap-4">
                        <input class="w-full" type="number" v-model="maxBudget" :min="1" :placeholder="10" />
                        <span>€</span>
                    </label>
                </div>
                <div class="form-control w-full">
                    <h1 class="text-lg mb-2">{{ $t('groupSettings.secretMode') }}</h1>
                    <p class="text-neutral mb-2">{{ $t('groupSettings.secretModeDescription') }}</p>

                    <button class="btn" :class="{ 'btn-primary': secretMode }" type="button" @click="secretMode = !secretMode">
                        <i class="las" :class="{ 'la-check': secretMode, 'la-times': !secretMode }"></i>
                        <span>{{ $t('groupSettings.secretMode') }}</span>
                    </button>
                </div>
                <div>
                    <div class="label">{{ $t('newGroup.members') }}</div>
                    <p class="label pt-0 text-neutral">{{ $t('newGroup.minimumMembers', { count: minimumMembers }) }}
                    </p>
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-2" v-for="(member, index) in memberNames" :key="index">
                            <label class="input input-bordered flex items-center gap-2 grow group"
                                v-focus="member.focus" aria-autocomplete="none">
                                <input class="grow peer"
                                    :placeholder="index == 0 ? $t('general.you') : $t('general.name')"
                                    v-model="memberNames[index].name" required autocomplete="off"
                                    @keydown="(e: KeyboardEvent) => onMemberInputKeydown(e, index)" />

                                <div v-if="index >= minimumMembers" class="p-1 h-full transition-all opacity-0 
                                    group-hover:opacity-100 peer-focus:opacity-100 focus-within:opacity-100">
                                    <button v-if="index > 0" type="button" class="h-full aspect-square btn btn-ghost min-h-0 p-0
                                        border border-base-300" @click="removeMember(index)"> - </button>
                                </div>
                            </label>
                        </div>

                        <label class="input input-bordered border-dashed flex items-center gap-2">
                            <span class="opacity-50">+</span>
                            <input class="grow" readonly :placeholder="$t('newGroup.addMember')"
                                @focus="addMember(memberNames.length - 1)" />
                        </label>
                    </div>
                </div>
            </div>
        </GenericPanel>

        <div class="pt-24"></div>

        <AppFooter>
            <div class="ml-auto flex items-center gap-4">
                <span v-if="submitState.state === 'error'" class="text-error">{{ $t('newGroup.error') }}</span>
                <button class="btn btn-primary" type="submit">
                    <i class="las la-arrow-right text-lg"></i>
                    {{ $t('newGroup.createGroup') }}
                </button>
            </div>
        </AppFooter>
    </form>

    <Transition name="fade">
        <div v-if="submitState.state === 'loading'"
            class="fixed inset-0 flex items-center justify-center bg-base-300 bg-opacity-70 pointer-events-auto">
            <span class="text-lg font-bold flex flex-col gap-4 items-center">
                <span class="loading loading-spinner loading-lg"></span>
                {{ $t('newGroup.creatingGroup') }}
            </span>
        </div>
    </Transition>
</template>