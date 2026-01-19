<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Product Management</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your product inventory and details</p>
      </div>
      <NuxtLink
          to="/admin/product/new"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add New Product
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow-sm rounded-lg p-4 mb-6 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                @input="debouncedSearch"
            >
          </div>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
              id="status"
              v-model="statusFilter"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
              @change="fetchProducts"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
              id="sort"
              v-model="sortBy"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
          >
            <option value="created_at">Date Added</option>
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading products...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div class="text-center py-16 px-4">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
          <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
        </div>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
        <div class="mt-6">
          <NuxtLink
              to="/admin/product/new"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Product
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div v-else class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.product_id" class="hover:bg-gray-50 transition-colors">
                <!-- Product Info -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                          :src="product.image_url || 'https://via.placeholder.com/60x60'"
                          :alt="product.name"
                          class="h-10 w-10 rounded-md object-cover"
                          @error="handleImageError"
                      >
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-xs text-gray-500">#{{ product.product_id }}</div>
                    </div>
                  </div>
                </td>

                <!-- Price -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">${{ product.price }}</div>
                </td>

                <!-- Stock -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                      <span
                          :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          product.stock === 0
                            ? 'bg-red-100 text-red-800'
                            : product.stock < 10
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        ]"
                      >
                        {{ product.stock }} in stock
                      </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                    <span
                        :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ product.status }}
                    </span>
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(product.created_at,"short") }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center space-x-2 justify-end">
                    <NuxtLink
                        :to="`/admin/product/edit/${product.product_id}`"
                        class="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        title="Edit"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    </NuxtLink>
                    <button
                        @click="showDeleteConfirmation(product)"
                        class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                        title="Delete"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            Previous
          </button>
          <button
              @click="nextPage"
              :disabled="filteredProducts.length < itemsPerPage"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': filteredProducts.length < itemsPerPage }"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }}</span>
              of <span class="font-medium">{{ filteredProducts.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                  @click="nextPage"
                  :disabled="filteredProducts.length < itemsPerPage"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': filteredProducts.length < itemsPerPage }"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Product
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this product? This action cannot be undone.
                  </p>
                  <p v-if="selectedProduct && (selectedProduct?.stock > 0)" class="mt-2 text-sm text-yellow-600">
                    ⚠️ This product has {{ selectedProduct?.stock || 0 }} items in stock.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
                @click="confirmDelete"
                type="button"
                class="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                :disabled="isDeleting"
                :class="{
                  'opacity-75': isDeleting,
                  'hover:bg-red-700': !isDeleting,
                  'bg-red-500': isDeleting
                }"
            >
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDeleting ? 'Deleting...' : 'Delete Product' }}
            </button>
            <button
                @click="cancelDelete"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                :disabled="isDeleting"
                :class="{
                  'opacity-50 cursor-not-allowed': isDeleting,
                  'hover:bg-gray-50': !isDeleting
                }"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {productService} from '~/services/api';
import {useAppToast} from "~/composables/useAppToast";
import {formatDate} from "~/composables/useDateFormatter";

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

// State
const products = ref<Product[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const deletingProductId = ref<number | null>(null);
const statusFilter = ref('');
const sortBy = ref('created_at');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalProducts = ref(0);

// Delete Dialog State
const showDeleteDialog = ref(false);
const selectedProduct = ref<Product | null>(null);
const isDeleting = ref(false);
const dialogAnimation = ref('scale-100');

const { toast } = useAppToast();

// Debounce for search
let searchTimeout: ReturnType<typeof setTimeout>;

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchProducts();
  }, 300);
};

// Computed
const filteredProducts = computed(() => {
  if (!Array.isArray(products.value) || products.value.length === 0) {
    return [];
  }

  let filtered = [...products.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.product_id.toString().includes(query)
    );
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value);
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'id':
        return a.product_id - b.product_id;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filtered.slice(startIndex, endIndex);
});

// Lifecycle
onMounted(async () => {
  await fetchProducts();
});

const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPage.value);
});

// Methods
async function fetchProducts() {
  try {
    loading.value = true;
    products.value = await productService.getProducts({
      status: statusFilter.value,
      search: searchQuery.value
    });
    totalProducts.value = products.value.length;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to load products. Please try again.');
  } finally {
    loading.value = false;
  }
}

function showDeleteConfirmation(product: Product) {
  selectedProduct.value = product;
  showDeleteDialog.value = true;
  dialogAnimation.value = 'scale-100';
}

function cancelDelete() {
  dialogAnimation.value = 'scale-95 opacity-0';
  setTimeout(() => {
    showDeleteDialog.value = false;
    selectedProduct.value = null;
    deletingProductId.value = null;
    isDeleting.value = false;
    dialogAnimation.value = 'scale-100';
  }, 150);
}

async function confirmDelete() {
  if (!selectedProduct.value || isDeleting.value) return;
  
  isDeleting.value = true;
  

  try {
    await productService.deleteProduct(selectedProduct.value.product_id);

    const index = products.value.findIndex(p => p.product_id === selectedProduct.value!.product_id);
    if (index !== -1) {
      products.value.splice(index, 1);
    }

    toast.success('Product deleted successfully');

  } catch (error: any) {
    console.error('Error deleting product:', error);
    const message = error?.data?.error || 'Failed to delete product';
    toast.error(message);
  } finally {
    deletingProductId.value = null;
    cancelDelete();
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (filteredProducts.value.length === itemsPerPage.value) {
    currentPage.value++;
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  const fallbackUrl = 'https://via.placeholder.com/60x60?text=No+Image';
  if (img.src !== fallbackUrl && !img.src.includes('placeholder.com')) {
    img.src = fallbackUrl;
    img.onerror = null;
  }
}

// Watchers
watch([statusFilter, sortBy], () => {
  currentPage.value = 1;
  fetchProducts();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scale-100 {
  transform: scale(1);
}

.scale-95 {
  transform: scale(0.95);
}

.opacity-0 {
  opacity: 0;
}

.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
