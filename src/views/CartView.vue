<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <div class="text-gray-400 mb-4">
        <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
      <p class="text-gray-500 mb-6">Add some products to your cart to continue shopping</p>
      <router-link to="/" class="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
        Continue Shopping
      </router-link>
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
                  <span class="text-gray-900">${{ item.price }}</span>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center">
                    <button
                        @click="updateQuantity(item.product_id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="w-8 h-8 flex items-center justify-center border rounded-l hover:bg-gray-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                        v-model.number="item.quantity"
                        @change="updateQuantity(item.product_id, item.quantity)"
                        type="number"
                        min="1"
                        class="w-12 h-8 text-center border-y"
                    >
                    <button
                        @click="updateQuantity(item.product_id, item.quantity + 1)"
                        class="w-8 h-8 flex items-center justify-center border rounded-r hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="py-4 px-4">
                    <span class="font-medium text-gray-900">
                      ${{ item.price * item.quantity }}
                    </span>
                </td>
                <td class="py-4 px-4">
                  <button
                      @click="removeItem(item.product_id)"
                      class="text-red-600 hover:text-red-800 p-1"
                      title="Remove item"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-between">
          <router-link to="/" class="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Continue Shopping
          </router-link>
          <button
              @click="clearCart"
              class="text-red-600 hover:text-red-800 font-medium flex items-center"
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
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span class="text-green-600">FREE</span>
            </div>
            <div v-if="cartStore.totalPrice > 100" class="flex justify-between">
              <span class="text-gray-600">Discount (10%)</span>
              <span class="text-green-600">-${{ (cartStore.totalPrice * 0.1).toFixed(2) }}</span>
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${{ calculateTotal().toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex items-center text-green-600 mb-2">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span>Free shipping on all orders</span>
            </div>
            <div class="flex items-center text-green-600">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span>10% off on orders over $100</span>
            </div>
          </div>

          <button
              @click="goToCheckout"
              class="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition duration-200"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message-->
    <div v-if="showErrorMessage" class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import {ref} from "vue";

const cartStore = useCartStore();
const router = useRouter();
const errorMessage = ref('')
const showErrorMessage = ref(false)

 function updateQuantity(productId: number, newQuantity: number) {
  if(cartStore.items.length >= 1){
    const item = cartStore.items.find((e)=> e.product_id == productId)
    if(item && item.availableStock < newQuantity){
      errorMessage.value = 'Not enough stock available'
      showErrorMessage.value = true
      // Hide error message after 3 seconds
      setTimeout(() => {
        showErrorMessage.value = false
      }, 3000)
    }else{
      if (newQuantity >= 1) {
        cartStore.updateQuantity(productId, newQuantity);
      }
    }
  }else{
    if (newQuantity >= 1) {
      cartStore.updateQuantity(productId, newQuantity);
    }
  }
}

function removeItem(productId: number) {
  if (confirm('Are you sure you want to remove this item from your cart?')) {
    cartStore.removeFromCart(productId);
  }
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart();
  }
}

function calculateTotal() {
  let total = cartStore.totalPrice;
  if (total > 100) {
    total *= 0.9; // 10% discount
  }
  return total;
}

function goToCheckout() {
  router.push('/checkout');
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  const fallbackUrl = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
  if (img.src !== fallbackUrl && !img.src.includes('placeholder.com')) {
    img.src = fallbackUrl
    img.onerror = null
  }
}
</script>