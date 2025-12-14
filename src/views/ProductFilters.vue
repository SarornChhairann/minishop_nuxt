<!--<template>-->
<!--  <div class="bg-white p-6 rounded-lg shadow mb-6">-->
<!--    <div class="flex flex-wrap gap-4 items-end">-->
<!--      &lt;!&ndash; Search Input &ndash;&gt;-->
<!--      <div class="flex-1 min-w-[200px]">-->
<!--        <label class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Search Products-->
<!--        </label>-->
<!--        <input-->
<!--            v-model="localFilters.search"-->
<!--            type="text"-->
<!--            placeholder="Search by name or description..."-->
<!--            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"-->
<!--            @input="onFilterChange"-->
<!--        >-->
<!--      </div>-->

<!--      &lt;!&ndash; Status Filter &ndash;&gt;-->
<!--      <div>-->
<!--        <label class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Status-->
<!--        </label>-->
<!--        <select-->
<!--            v-model="localFilters.status"-->
<!--            class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"-->
<!--            @change="onFilterChange"-->
<!--        >-->
<!--          <option value="all">All Status</option>-->
<!--          <option value="ACTIVE">Active</option>-->
<!--          <option value="INACTIVE">Inactive</option>-->
<!--        </select>-->
<!--      </div>-->

<!--      &lt;!&ndash; Price Range &ndash;&gt;-->
<!--      <div class="flex gap-2">-->
<!--        <div>-->
<!--          <label class="block text-sm font-medium text-gray-700 mb-2">-->
<!--            Min Price-->
<!--          </label>-->
<!--          <input-->
<!--              v-model.number="localFilters.min_price"-->
<!--              type="number"-->
<!--              min="0"-->
<!--              step="0.01"-->
<!--              placeholder="Min"-->
<!--              class="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"-->
<!--              @input="onFilterChange"-->
<!--          >-->
<!--        </div>-->
<!--        <div>-->
<!--          <label class="block text-sm font-medium text-gray-700 mb-2">-->
<!--            Max Price-->
<!--          </label>-->
<!--          <input-->
<!--              v-model.number="localFilters.max_price"-->
<!--              type="number"-->
<!--              min="0"-->
<!--              step="0.01"-->
<!--              placeholder="Max"-->
<!--              class="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"-->
<!--              @input="onFilterChange"-->
<!--          >-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; Stock Range &ndash;&gt;-->
<!--      <div class="flex gap-2">-->
<!--        <div>-->
<!--          <label class="block text-sm font-medium text-gray-700 mb-2">-->
<!--            Min Stock-->
<!--          </label>-->
<!--          <input-->
<!--              v-model.number="localFilters.min_stock"-->
<!--              type="number"-->
<!--              min="0"-->
<!--              placeholder="Min"-->
<!--              class="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"-->
<!--              @input="onFilterChange"-->
<!--          >-->
<!--        </div>-->
<!--        <div>-->
<!--          <label class="block text-sm font-medium text-gray-700 mb-2">-->
<!--            Max Stock-->
<!--          </label>-->
<!--          <input-->
<!--              v-model.number="localFilters.max_stock"-->
<!--              type="number"-->
<!--              min="0"-->
<!--              placeholder="Max"-->
<!--              class="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"-->
<!--              @input="onFilterChange"-->
<!--          >-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; Sort Options &ndash;&gt;-->
<!--      <div>-->
<!--        <label class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Sort By-->
<!--        </label>-->
<!--        <select-->
<!--            v-model="localFilters.sort_by"-->
<!--            class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"-->
<!--            @change="onFilterChange"-->
<!--        >-->
<!--          <option value="product_id">ID</option>-->
<!--          <option value="name">Name</option>-->
<!--          <option value="price">Price</option>-->
<!--          <option value="stock">Stock</option>-->
<!--          <option value="created_at">Date Added</option>-->
<!--        </select>-->
<!--      </div>-->

<!--      <div>-->
<!--        <label class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Order-->
<!--        </label>-->
<!--        <select-->
<!--            v-model="localFilters.sort_order"-->
<!--            class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"-->
<!--            @change="onFilterChange"-->
<!--        >-->
<!--          <option value="ASC">Ascending</option>-->
<!--          <option value="DESC">Descending</option>-->
<!--        </select>-->
<!--      </div>-->

<!--      &lt;!&ndash; Reset Filters Button &ndash;&gt;-->
<!--      <div>-->
<!--        <button-->
<!--            @click="resetFilters"-->
<!--            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"-->
<!--        >-->
<!--          Reset Filters-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; Active Filters Display &ndash;&gt;-->
<!--    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t">-->
<!--      <div class="flex items-center">-->
<!--        <span class="text-sm text-gray-600 mr-2">Active filters:</span>-->
<!--        <div class="flex flex-wrap gap-2">-->
<!--          <span-->
<!--              v-if="localFilters.search"-->
<!--              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"-->
<!--          >-->
<!--            Search: "{{ localFilters.search }}"-->
<!--            <button @click="removeFilter('search')" class="ml-2 text-blue-600 hover:text-blue-800">-->
<!--              ×-->
<!--            </button>-->
<!--          </span>-->
<!--          <span-->
<!--              v-if="localFilters.status && localFilters.status !== 'all'"-->
<!--              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"-->
<!--          >-->
<!--            Status: {{ localFilters.status }}-->
<!--            <button @click="removeFilter('status')" class="ml-2 text-green-600 hover:text-green-800">-->
<!--              ×-->
<!--            </button>-->
<!--          </span>-->
<!--          <span-->
<!--              v-if="localFilters.min_price"-->
<!--              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"-->
<!--          >-->
<!--            Min Price: ${{ localFilters.min_price }}-->
<!--            <button @click="removeFilter('min_price')" class="ml-2 text-yellow-600 hover:text-yellow-800">-->
<!--              ×-->
<!--            </button>-->
<!--          </span>-->
<!--          <span-->
<!--              v-if="localFilters.max_price"-->
<!--              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"-->
<!--          >-->
<!--            Max Price: ${{ localFilters.max_price }}-->
<!--            <button @click="removeFilter('max_price')" class="ml-2 text-yellow-600 hover:text-yellow-800">-->
<!--              ×-->
<!--            </button>-->
<!--          </span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref, computed, watch } from 'vue';-->

<!--interface ProductFilters {-->
<!--  status?: string;-->
<!--  search?: string;-->
<!--  min_price?: number;-->
<!--  max_price?: number;-->
<!--  min_stock?: number;-->
<!--  max_stock?: number;-->
<!--  sort_by?: string;-->
<!--  sort_order?: string;-->
<!--  page?: number;-->
<!--  limit?: number;-->
<!--}-->

<!--const props = defineProps<{-->
<!--  filters: ProductFilters;-->
<!--}>();-->

<!--const emit = defineEmits<{-->
<!--  (e: 'update:filters', filters: ProductFilters): void;-->
<!--}>();-->

<!--const localFilters = ref<ProductFilters>({-->
<!--  ...props.filters,-->
<!--  status: props.filters.status || 'all',-->
<!--  sort_by: props.filters.sort_by || 'product_id',-->
<!--  sort_order: props.filters.sort_order || 'ASC'-->
<!--});-->

<!--const hasActiveFilters = computed(() => {-->
<!--  const { status, search, min_price, max_price, min_stock, max_stock } = localFilters.value;-->
<!--  return (-->
<!--      (status && status !== 'all') ||-->
<!--      search ||-->
<!--      min_price !== undefined ||-->
<!--      max_price !== undefined ||-->
<!--      min_stock !== undefined ||-->
<!--      max_stock !== undefined-->
<!--  );-->
<!--});-->

<!--// Debounce filter changes-->
<!--let debounceTimer: NodeJS.Timeout;-->
<!--const onFilterChange = () => {-->
<!--  clearTimeout(debounceTimer);-->
<!--  debounceTimer = setTimeout(() => {-->
<!--    // Clean up empty values before emitting-->
<!--    const cleanedFilters: ProductFilters = {};-->
<!--    Object.entries(localFilters.value).forEach(([key, value]) => {-->
<!--      if (value !== undefined && value !== null && value !== '' && value !== 'all') {-->
<!--        cleanedFilters[key as keyof ProductFilters] = value;-->
<!--      }-->
<!--    });-->
<!--    emit('update:filters', cleanedFilters);-->
<!--  }, 300);-->
<!--};-->

<!--const resetFilters = () => {-->
<!--  localFilters.value = {-->
<!--    status: 'all',-->
<!--    sort_by: 'product_id',-->
<!--    sort_order: 'ASC'-->
<!--  };-->
<!--  emit('update:filters', {});-->
<!--};-->

<!--const removeFilter = (filterKey: keyof ProductFilters) => {-->
<!--  localFilters.value[filterKey] = undefined;-->
<!--  onFilterChange();-->
<!--};-->

<!--// Watch for external filter changes-->
<!--watch(() => props.filters, (newFilters) => {-->
<!--  localFilters.value = {-->
<!--    ...newFilters,-->
<!--    status: newFilters.status || 'all',-->
<!--    sort_by: newFilters.sort_by || 'product_id',-->
<!--    sort_order: newFilters.sort_order || 'ASC'-->
<!--  };-->
<!--}, { deep: true });-->
<!--</script>-->