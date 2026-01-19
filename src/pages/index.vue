<template>
  <div class="m-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div class="relative w-full md:w-96">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products by name or description..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
      </div>
    </div>
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
    <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-600 mb-4">No products available</h2>
      <p class="text-gray-500 mb-6">Check back later for new products.</p>
    </div>

    <!-- Products grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
          v-for="product in filteredProducts"
          :key="product.product_id"
          class="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
      >
        <div class="relative overflow-hidden">
          <div class="aspect-w-1 aspect-h-1 w-full">
            <img
                :src="product.image_url"
                :alt="product.name"
                class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                @error="handleImageError"
            >
          </div>
          
          <!-- Stock Status Badge -->
          <div class="absolute top-3 right-3">
            <span v-if="product.stock < 10 && product.stock > 0" 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
              <span class="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
              Only {{ product.stock }} left
            </span>
            <span v-else-if="product.stock === 0" 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <span class="w-2 h-2 mr-1 bg-gray-500 rounded-full"></span>
              Out of Stock
            </span>
            <span v-else
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span class="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
              In Stock
            </span>
          </div>
        </div>

        <div class="p-5 flex flex-col flex-grow">
          <div class="flex-grow">
            <h3 class="text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
              {{ product.name }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
          </div>

          <div class="mt-auto">
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="text-2xl font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
                <span v-if="(Number(product.price) + 1) > Number(product.price)" class="ml-2 text-sm text-gray-500 line-through">
                  {{ formatPrice(Number(product.price) + 1) }}
                </span>
              </div>
              <span class="text-sm text-gray-500">{{ product.stock }} in stock</span>
            </div>

            <div class="flex space-x-3">
              <NuxtLink
                  :to="`/product/${product.product_id}`"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </NuxtLink>
              
              <button
                  @click="addToCart(product)"
                  :disabled="product.stock === 0 || addingToCartId === product.product_id"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                <template v-if="addingToCartId === product.product_id">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </template>
                <template v-else>
                  <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {useCartStore} from '~/stores/cart'
import {productService} from '~/services/api'
import { useFormatters } from '~/composables/useFormatters'
import {useAppToast} from "~/composables/useAppToast";

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
const filteredProducts = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    filteredProducts.value = [...products.value]
    return
  }
  
  const query = newQuery.toLowerCase().trim()
  filteredProducts.value = products.value.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.description?.toLowerCase().includes(query)
  )
})
const addingToCartId = ref<number | null>(null)

// Initialize cart store
const cartStore = useCartStore()
const { formatPrice } = useFormatters()
const {toast} = useAppToast()

// Fetch products on mount
onMounted(() => {
  fetchProducts()
})

// Fetch products function
async function fetchProducts() {
  try {
    loading.value = true
    products.value = await productService.getProducts({status: 'active'})
    filteredProducts.value = [...products.value]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load products'
  } finally {
    loading.value = false
  }
}

// Add to cart function
async function addToCart(product: Product) {
  if (product.stock <= 0) return

  try {
    addingToCartId.value = product.product_id


    await new Promise(resolve => setTimeout(resolve, 300))

    const item = cartStore.items.find((e) => e.product_id == product.product_id);
    if(item && item.quantity >= product.stock){
      toast.error(`Influenced stock: ${product.stock}`)
    } else {
      cartStore.addToCart({
        product_id: product.product_id,
        name: product.name,
        price: parseFloat(product.price.toString()),
        quantity: 1,
        image_url: product.image_url,
        availableStock: product.stock
      })
      toast.success(`Added ${product.name} to cart!`)
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