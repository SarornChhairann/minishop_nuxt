<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Products</h1>
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading products...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="fetchProducts" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Retry
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="products.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-600 mb-4">No products available</h2>
      <p class="text-gray-500 mb-6">Check back later for new products.</p>
    </div>

    <!-- Products grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="product in products"
          :key="product.product_id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <div class="relative">
          <img
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-48 object-cover"
              @error="handleImageError"
          >
          <div class="absolute top-2 right-2">
            <span v-if="product.stock < 10 && product.stock > 0" class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              Low Stock
            </span>
            <span v-else-if="product.stock === 0" class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        </div>

        <div class="p-4">
          <h3 class="font-bold text-lg mb-2 truncate">{{ product.name }}</h3>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>

          <div class="flex justify-between items-center mb-4">
            <span class="text-xl font-bold text-blue-600">${{ product.price }}</span>
            <span class="text-sm text-gray-500">Stock: {{ product.stock }}</span>
          </div>

          <div class="flex space-x-2">
            <router-link
                :to="`/product/${product.product_id}`"
                class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded text-center hover:bg-gray-200 transition-colors"
            >
              View Details
            </router-link>
            <button
                @click="addToCart(product)"
                :disabled="product.stock === 0 || addingToCartId === product.product_id"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <template v-if="addingToCartId === product.product_id">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </template>
              <template v-else>
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success message (toast) -->
    <div v-if="showSuccessMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        {{ successMessage }}
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
import {onMounted, ref} from 'vue'
import {useCartStore} from '@/stores/cart'
import {productService} from '@/services/api'

// Define interface for Product
interface Product {
  product_id: number
  name: string
  description: string
  price: number | string
  stock: number
  image_url?: string
  status: string
  created_at: string
}

// Define reactive variables
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const addingToCartId = ref<number | null>(null)
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Initialize cart store
const cartStore = useCartStore()

// Fetch products on mount
onMounted(() => {
  fetchProducts()
})

// Fetch products function
async function fetchProducts() {
  try {
    loading.value = true
    error.value = ''

    products.value = await productService.getProducts({status: 'active'})

  } catch (err: any) {
    error.value = err.message || 'Failed to load products. Please try again.'
  } finally {
    loading.value = false
  }
}

// Add to cart function
async function addToCart(product: Product) {
  if (product.stock <= 0) return

  try {
    addingToCartId.value = product.product_id

    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))

    const item = cartStore.items.find((e) => e.product_id == product.product_id);
    if(item && item.quantity >= product.stock){
      showErrorMessage.value = true;
      errorMessage.value = `Influenced stock: ${product.stock}`
      // Hide error message after 3 seconds
      setTimeout(() => {
        showErrorMessage.value = false
      }, 3000)
    } else {
      cartStore.addToCart({
        product_id: product.product_id,
        name: product.name,
        price: parseFloat(product.price.toString()),
        quantity: 1,
        image_url: product.image_url,
        availableStock: product.stock
      })

      // Show success message
      successMessage.value = `Added ${product.name} to cart!`
      showSuccessMessage.value = true

      // Hide success message after 3 seconds
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    }

  } catch (err) {
    error.value = 'Failed to add item to cart. Please try again.'
  } finally {
    addingToCartId.value = null
  }
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

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>