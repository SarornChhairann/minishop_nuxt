<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="onCancel"></div>

          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
          
          <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div v-if="icon" :class="['mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10', iconContainerClass]">
                  <component :is="icon" class="h-6 w-6" :class="iconClass" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{{ title }}</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">{{ message }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                @click="onConfirm"
              >
                {{ confirmText }}
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                @click="onCancel"
              >
                {{ cancelText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface ConfirmDialogProps {
  modelValue?: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: any;
  iconContainerClass?: string;
  iconClass?: string;
}

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  modelValue: false,
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  icon: null,
  iconContainerClass: 'bg-red-100',
  iconClass: 'text-red-600'
});

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const emit = defineEmits<Emits>();

const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal;
});

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal);
});

const onConfirm = () => {
  emit('confirm');
  close();
};

const onCancel = () => {
  emit('cancel');
  close();
};

const close = () => {
  isOpen.value = false;
};

interface ExposedMethods {
  show: () => void;
  hide: () => void;
}

defineExpose<ExposedMethods>({
  show: () => { isOpen.value = true; },
  hide: close
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
