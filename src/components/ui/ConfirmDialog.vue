<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
      <template #header>
        <div class="flex items-center gap-4">
          <div
            v-if="icon"
            :class="[
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full',
              iconContainerClass
            ]"
          >
            <component
              :is="icon"
              class="h-6 w-6"
              :class="iconClass"
              aria-hidden="true"
            />
          </div>
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            {{ title }}
          </h3>
        </div>
      </template>

      <div class="py-2">
        <p class="text-sm text-gray-500">
          {{ message }}
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="white" @click="onCancel">
            {{ cancelText }}
          </UButton>
          <UButton color="red" @click="onConfirm">
            {{ confirmText }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const onConfirm = () => {
  emit('confirm');
  isOpen.value = false;
};

const onCancel = () => {
  emit('cancel');
  isOpen.value = false;
};

const close = () => {
  isOpen.value = false;
};

interface ExposedMethods {
  show: () => void;
  hide: () => void;
}

defineExpose<ExposedMethods>({
  show: () => {
    isOpen.value = true;
  },
  hide: close
});
</script>
