<template>
  <div class="max-w-6xl mx-auto m-4">
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <div class="text-gray-400 mb-4">
        <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
      <p class="text-gray-500 mb-6">Add some products to your cart to continue shopping</p>
      <NuxtLink to="/" class="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
        Continue Shopping
      </NuxtLink>
    </div>

    <div v-else class="md:flex gap-8">
      <!-- Cart Items -->
      <div class="md:w-2/3">
        <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Product</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Price</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Quantity</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Subtotal</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
              <tr v-for="item in cartStore.items" :key="item.product_id" class="hover:bg-gray-50">
                <td class="py-4 px-4">
                  <div class="flex items-center">
                    <img
                        :src="item.image_url || 'https://via.placeholder.com/80x80'"
                        :alt="item.name"
                        class="w-16 h-16 object-cover rounded mr-4"
                        @error="handleImageError"
                    >
                    <div>
                      <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
                      <p class="text-sm text-gray-500">ID: {{ item.product_id }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <span class="text-gray-900">{{ formatPrice(item.price) }}</span>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center">
                    <button
                        @click="decrementQuantity(item.product_id)"
                        :disabled="item.quantity <= 1"
                        class="w-8 h-8 flex items-center justify-center border rounded-l hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                        v-model.number="item.quantity"
                        @change="updateQuantityInput(item.product_id, item.quantity)"
                        type="number"
                        min="1"
                        :max="item.availableStock"
                        class="w-12 h-8 text-center border-y"
                    >
                    <button
                        @click="incrementQuantity(item.product_id)"
                        :disabled="item.quantity >= item.availableStock"
                        class="w-8 h-8 flex items-center justify-center border rounded-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <p v-if="item.availableStock <= 5 && item.quantity <= item.availableStock"
                     class="text-xs text-red-600 mt-1">
                    Only {{ item.availableStock }} left in stock!
                  </p>
                </td>
                <td class="py-4 px-4">
                    <span class="font-medium text-gray-900">
                      {{ formatPrice(item.price * item.quantity) }}
                    </span>
                </td>
                <td class="py-4 px-4">
                  <button
                      @click="showDeleteConfirmation(item)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Remove item"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-between">
          <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Continue Shopping
          </NuxtLink>
          <button
              @click="showClearCartConfirmation"
              class="text-red-600 hover:text-red-800 font-medium flex items-center transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear Cart
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="md:w-1/3">
        <div class="bg-white rounded-lg shadow p-6 sticky top-6">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>

          <div class="space-y-4 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span>{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span class="text-green-600">FREE</span>
            </div>
            <div v-if="cartStore.totalPrice > 100" class="flex justify-between">
              <span class="text-gray-600">Discount (10%)</span>
              <span class="text-green-600">-{{ formatPrice(cartStore.totalPrice * 0.1) }}</span>
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span class="text-xl font-bold">{{ formatPrice(calculateTotal()) }}</span>
              </div>
              <p v-if="cartStore.totalPrice < 100" class="text-sm text-gray-500 mt-2">
                Add ${{ formatPrice(100 - cartStore.totalPrice) }} more to get 10% discount!
              </p>
            </div>
          </div>

          <div class="mb-6 space-y-2">
            <div class="flex items-center text-green-600">
              <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm">Free shipping on all orders</span>
            </div>
            <div class="flex items-center text-green-600">
              <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm">10% off on orders over $100</span>
            </div>
          </div>

          <button
              @click="goToCheckout"
              :disabled="cartStore.items.length === 0"
              class="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirm Dialog -->
  <ConfirmDialog
      v-model="isConfirmOpen"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :icon="confirmOptions.icon"
      :icon-container-class="confirmOptions.iconContainerClass"
      :icon-class="confirmOptions.iconClass"
      @confirm="handleConfirm"
      @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { useCartStore, type CartItem } from '~/stores/cart';
import { useFormatters } from '~/composables/useFormatters';
import { useAppToast } from '~/composables/useAppToast';
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import ConfirmDialog from '~/components/ui/ConfirmDialog.vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();
const { formatPrice } = useFormatters();
const { toast } = useAppToast();

const isConfirmOpen = ref(false);
const itemToDelete = ref<CartItem | null>(null);
const isClearCart = ref(false);

const confirmOptions = computed(() => {
  if (isClearCart.value) {
    return {
      title: 'Clear Cart',
      message: 'Are you sure you want to remove all items from your cart? This action cannot be undone.',
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      icon: ExclamationTriangleIcon,
      iconContainerClass: 'bg-red-100',
      iconClass: 'text-red-600'
    };
  } else {
    return {
      title: 'Remove Item',
      message: `Are you sure you want to remove "${itemToDelete.value?.name}" from your cart?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      icon: TrashIcon,
      iconContainerClass: 'bg-red-100',
      iconClass: 'text-red-600'
    };
  }
});

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://via.placeholder.com/80x80?text=No+Image';
};

const updateQuantityInput = (productId: number, quantity: number) => {
  if (quantity < 1) {
    cartStore.updateQuantity(productId, 1);
  } else {
    // Check stock limit if needed
    const item = cartStore.items.find(i => i.product_id === productId);
    if (item && quantity > item.availableStock) {
      cartStore.updateQuantity(productId, item.availableStock);
      toast.error(`Only ${item.availableStock} items available in stock`);
    } else {
      cartStore.updateQuantity(productId, quantity);
    }
  }
};

const incrementQuantity = (productId: number) => {
  const item = cartStore.items.find(i => i.product_id === productId);
  if (item) {
    if (item.quantity < item.availableStock) {
      cartStore.updateQuantity(productId, item.quantity + 1);
    } else {
      toast.error(`Cannot add more. Only ${item.availableStock} in stock.`);
    }
  }
};

const decrementQuantity = (productId: number) => {
  const item = cartStore.items.find(i => i.product_id === productId);
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1);
  }
};

const showDeleteConfirmation = (item: any) => {
  itemToDelete.value = item;
  isClearCart.value = false;
  isConfirmOpen.value = true;
};

const showClearCartConfirmation = () => {
  isClearCart.value = true;
  isConfirmOpen.value = true;
};

const handleConfirm = () => {
  if (isClearCart.value) {
    cartStore.clearCart();
    toast.success('Cart cleared successfully');
  } else if (itemToDelete.value) {
    cartStore.removeFromCart(itemToDelete.value.product_id);
    toast.success(`${itemToDelete.value.name} removed from cart`);
  }
  isConfirmOpen.value = false;
  itemToDelete.value = null;
};

const handleCancel = () => {
  isConfirmOpen.value = false;
  itemToDelete.value = null;
};

const calculateTotal = () => {
  let total = cartStore.totalPrice;
  
  // Apply discount if total > 100
  if (total > 100) {
    total = total * 0.9; // 10% discount
  }
  
  return total;
};

const goToCheckout = () => {
  if (cartStore.items.length === 0) {
    toast.error('Your cart is empty');
    return;
  }
  router.push('/checkout');
};
</script>
