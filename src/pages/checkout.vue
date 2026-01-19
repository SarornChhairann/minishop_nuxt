<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
      <router-link to="/" class="text-blue-600 hover:text-blue-800 underline">
        Return to shop
      </router-link>
    </div>

    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
      <form @submit.prevent="submitOrder">
        <div class="md:flex">
          <!-- Customer Information -->
          <div class="md:w-1/2 p-8">
            <h2 class="text-xl font-bold mb-6">Customer Information</h2>

            <div class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                    v-model="form.name"
                    type="text"
                    id="name"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your fullname"
                >
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                    v-model="form.email"
                    type="email"
                    id="email"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="test@example.com"
                >
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                    v-model="form.phone"
                    type="tel"
                    id="phone"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(123) 456-7890"
                >
              </div>

              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <textarea
                    v-model="form.address"
                    id="address"
                    required
                    rows="4"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phnom Penh, Cambodia"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="md:w-1/2 bg-gray-50 p-8">
            <h2 class="text-xl font-bold mb-6">Order Summary</h2>

            <div class="mb-6">
              <div v-for="item in cartStore.items" :key="item.product_id" class="flex items-center mb-4">
                <img
                    :src="item.image_url || 'https://via.placeholder.com/60x60'"
                    :alt="item.name"
                    class="w-16 h-16 object-cover rounded mr-4"
                >
                <div class="flex-1">
                  <h3 class="font-medium">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">
                    {{ formatPrice(item.price) }} × {{ item.quantity }}
                  </p>
                </div>
                <span class="font-medium">
                  {{ formatPrice(item.price * item.quantity) }}
                </span>
              </div>
            </div>

            <div class="border-t pt-4">
              <div class="space-y-2 mb-6">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal</span>
                  {{ formatPrice(cartStore.totalPrice) }}
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Shipping</span>
                  <span class="text-green-600">FREE</span>
                </div>
                <div v-if="cartStore.totalPrice > 100" class="flex justify-between">
                  <span class="text-gray-600">Discount (10%)</span>
                  <span class="text-green-600">-{{ formatPrice(cartStore.totalPrice * 0.1) }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  {{ formatPrice(calculateTotal()) }}
                </div>
              </div>

              <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Place Order</span>
              </button>

              <p class="text-xs text-gray-500 mt-4 text-center">
                By placing your order, you agree to our
                <a href="#" class="text-blue-600 hover:underline">Terms of Service</a>
                and
                <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { orderService } from '../services/api';
import { useFormatters } from '@/composables/useFormatters';

const cartStore = useCartStore();
const router = useRouter();
const loading = ref(false);
const { formatPrice } = useFormatters();

const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
});

function calculateTotal() {
  let total = cartStore.totalPrice;
  if (total > 100) {
    total *= 0.9; // 10% discount
  }
  return total;
}

async function submitOrder() {
  if (loading.value) return;

  try {
    loading.value = true;

    const orderData = {
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      shipping_address: form.address,
      total_amount: calculateTotal(),
      items: cartStore.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }))
    };

    const order = await orderService.createOrder(orderData);
    // Clear cart and redirect to confirmation
    cartStore.clearCart();
    await router.push(`/order-confirmation/${order['order_id']}`);

  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order. Please try again.');
  } finally {
    loading.value = false;
  }
}
</script>