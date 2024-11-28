
export const formatMessageDay = (date: number) => {
    const i18n = useI18n();

    const givenDate = new Date(date);
    const now = new Date();
    if (givenDate.getDate() === now.getDate()) {
        return i18n.t('general.today');
    } else if (new Date(now.setDate(now.getDate() - 1)).toDateString() === givenDate.toDateString()) {
        return i18n.t('general.yesterday');
    } else {
        return givenDate.toLocaleDateString();
    }
};

export const formatTime = (date: number) => {
    const givenDate = new Date(date);
    const hours = givenDate.getHours().toString().padStart(2, '0');
    const minutes = givenDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const vShowModal = {
    mounted(el: HTMLDialogElement, binding: { value: any }) {
        if (binding.value) {
            el.showModal();
        }
    },
    updated(el: HTMLDialogElement, binding: { value: any, oldValue: any }) {
        if (binding.value && !binding.oldValue) {
            el.showModal();
        } else if (!binding.value && binding.oldValue) {
            el.close();
        }
    },
}

export const vFocus = {
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

export const formatEnumeration = (unfilteredItems: (string | undefined)[]) => {
    const items = unfilteredItems.filter(item => item !== undefined) as string[];
    
    if (items.length === 0) {
        return '';
    } else if (items.length === 1) {
        return items[0];
    } else {
        const last = items.pop();
        return `${items.join(', ')} ${useI18n().t('general.and')} ${last}`;
    }
}