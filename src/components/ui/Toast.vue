<template>
  <transition-group
      name="toast"
      tag="div"
      class="fixed top-4 right-4 z-50 space-y-2 w-full max-w-xs"
  >
    <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
        'p-4 rounded-lg shadow-lg',
        {
          'bg-green-100 text-green-800': toast.type === 'success',
          'bg-red-100 text-red-800': toast.type === 'error',
          'bg-blue-100 text-blue-800': toast.type === 'info',
          'bg-yellow-100 text-yellow-800': toast.type === 'warning',
        }
      ]"
        role="alert"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <component
              :is="getIcon(toast.type)"
              class="h-5 w-5"
              :class="{
              'text-green-500': toast.type === 'success',
              'text-red-500': toast.type === 'error',
              'text-blue-500': toast.type === 'info',
              'text-yellow-500': toast.type === 'warning',
            }"
          />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">{{ toast.message }}</p>
        </div>
        <div class="ml-auto pl-3">
          <button
              @click="removeToast(toast.id)"
              class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="{
              'text-green-500 hover:text-green-600 focus:ring-green-500': toast.type === 'success',
              'text-red-500 hover:text-red-600 focus:ring-red-500': toast.type === 'error',
              'text-blue-500 hover:text-blue-600 focus:ring-blue-500': toast.type === 'info',
              'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-500': toast.type === 'warning',
            }"
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition-group>
</template>
<script setup lang="ts">
// Import from the new package structure
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import {useAppToast} from "@/composables/useAppToast.ts";

const { toasts, removeToast } = useAppToast()


const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    default:
      return InformationCircleIcon
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>