<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Product Management</h1>
      <router-link
          to="/admin/product/new"
          class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add New Product
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Filters -->
      <div class="p-6 border-b">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full px-4 py-2 border rounded-lg"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="statusFilter" class="px-4 py-2 border rounded-lg">
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select v-model="sortBy" class="px-4 py-2 border rounded-lg">
              <option value="created_at">Date Added</option>
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>

      <!-- Products Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">ID</th>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">Product</th>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">Price</th>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">Stock</th>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">Status</th>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">Created</th>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
          <tr v-for="product in filteredProducts" :key="product.product_id" class="hover:bg-gray-50">
            <td class="py-4 px-6">
              <span class="font-mono text-gray-500">#{{ product.product_id }}</span>
            </td>
            <td class="py-4 px-6">
              <div class="flex items-center">
                <img
                    :src="product.image_url || 'https://via.placeholder.com/60x60'"
                    :alt="product.name"
                    class="w-12 h-12 object-cover rounded mr-4"
                    @error="handleImageError"
                >
                <div>
                  <h3 class="font-medium text-gray-900">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500 truncate max-w-xs">{{ product.description }}</p>
                </div>
              </div>
            </td>
            <td class="py-4 px-6">
              <span class="font-medium">${{ product.price }}</span>
            </td>
            <td class="py-4 px-6">
                <span :class="product.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-900'">
                  {{ product.stock }}
                </span>
            </td>
            <td class="py-4 px-6">
                <span
                    :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    product.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.status }}
                </span>
            </td>
            <td class="py-4 px-6">
              <span class="text-sm text-gray-500">{{ formatDate(product.created_at) }}</span>
            </td>
            <td class="py-4 px-6">
              <div class="flex space-x-2">
                <router-link
                    :to="`/admin/product/edit/${product.product_id}`"
                    class="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </router-link>
                <button
                    @click="deleteProduct(product.product_id)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredProducts.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p class="text-gray-500">Get started by creating a new product.</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredProducts.length > 0" class="p-6 border-t">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ filteredProducts.length }}</span> products
          </div>
          <div class="flex space-x-2">
            <button class="px-3 py-1 border rounded">Previous</button>
            <button class="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
            <button class="px-3 py-1 border rounded">Next</button>
          </div>
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
import {computed, onMounted, ref} from 'vue';
import {productService} from '@/services/api.ts';
import {AxiosError} from "axios";

const errorMessage = ref('')
const showErrorMessage = ref(false)

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  status: string;
  created_at: string;
}

const products = ref<Product[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('');
const sortBy = ref('created_at');

onMounted(async () => {
  await fetchProducts();
});

async function fetchProducts() {
  try {
    loading.value = true;
    products.value = await productService.getProducts({status: statusFilter.value, search: searchQuery.value});
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
}

const filteredProducts = computed(() => {
  // Always ensure products.value is an array
  const productArray = Array.isArray(products.value) ? products.value : [];

  if (productArray.length === 0) {
    return [];
  }

  let filtered = [...productArray];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value);
  }

  // Sort products
  filtered.sort((a, b) => {
    if (sortBy.value == 'id'){
      return a.product_id - b.product_id;
    }else if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy.value === 'price') {
      return a.price - b.price;
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return filtered;
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US');
}

async function deleteProduct(productId: number) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    await productService.deleteProduct(productId);
    await fetchProducts(); // Refresh the list
  } catch (error) {
    console.error('Error deleting product:', error);
    errorMessage.value = error instanceof AxiosError ? error.response?.data.error : 'Failed to delete product';
    showErrorMessage.value = true;

    setTimeout(() => {
      showErrorMessage.value = false;
    }, 3000);
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  const fallbackUrl = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
  if (img.src !== fallbackUrl && !img.src.includes('placeholder.com')) {
    img.src = fallbackUrl
    img.onerror = null
    return null
  }
}
</script>