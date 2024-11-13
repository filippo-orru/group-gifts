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