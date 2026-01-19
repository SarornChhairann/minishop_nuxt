<template>
  <div class="max-w-5xl mx-auto p-6 sm:p-8">
    <div class="mb-10">
      <div class="flex items-center space-x-3">
        <button @click="goBack" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
          {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
        </h1>
      </div>
      <p class="text-gray-500 mt-2 ml-11">
        {{ isEditMode ? 'Update product information' : 'Fill in the details below to add a new product' }}
      </p>
    </div>

    <div v-if="loading && isEditMode" class="text-center py-16">
      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="animate-spin rounded-full h-14 w-14 border-4 border-blue-100 border-t-blue-500"></div>
        <p class="text-gray-500">Loading product details...</p>
      </div>
    </div>

    <form v-else @submit.prevent="submitForm" enctype="multipart/form-data" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div class="p-6 md:p-8">
        <!-- Image Upload Section -->
        <div class="mb-10">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
            </div>
            <h2 class="text-lg font-medium text-gray-900">Product Image</h2>
          </div>

          <div class="flex flex-col md:flex-row items-start gap-8">
            <!-- Image Preview -->
            <div class="w-full md:w-1/3">
              <div class="relative group">
                <div class="aspect-square w-full rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 transition-all duration-200 group-hover:border-blue-400">
                  <div v-if="imagePreview || form.current_image_url" class="h-full">
                    <img
                        :src="imagePreview || form.current_image_url"
                        :alt="form.name || 'Product image'"
                        class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        @error="handleImageError"
                    >
                  </div>
                  <div v-else class="h-full flex flex-col items-center justify-center p-6 text-center">
                    <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="text-sm text-gray-500">
                      No image selected
                    </p>
                  </div>
                </div>

                <!-- Remove Image Button -->
                <button
                    v-if="imagePreview || form.current_image_url"
                    type="button"
                    @click="removeImage"
                    class="absolute -top-2 -right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-all duration-200 transform hover:scale-110"
                    title="Remove image"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Upload Controls -->
            <div class="w-full md:w-2/3">
              <div class="space-y-6">
                <div class="bg-gray-50 p-5 rounded-xl">
                  <label for="image" class="block text-sm font-medium text-gray-700 mb-3">
                    Upload New Image
                  </label>
                  
                  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label class="flex-1 w-full cursor-pointer group">
                      <div class="px-5 py-3.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 bg-white transition-all duration-200 group-hover:shadow-sm text-center">
                        <div class="flex items-center justify-center space-x-2">
                          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <span class="text-blue-600 font-medium">Choose File</span>
                        </div>
                        <input
                            id="image"
                            ref="fileInput"
                            type="file"
                            accept="image/*"
                            class="sr-only"
                            @change="handleImageUpload"
                        >
                      </div>
                    </label>
                    
                    <div class="text-sm text-gray-500 flex-shrink-0">
                      or drag and drop
                    </div>
                  </div>
                  
                  <p class="mt-3 text-xs text-gray-500">
                    <span class="inline-flex items-center">
                      <svg class="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      PNG, JPG, GIF, WebP up to 5MB
                    </span>
                  </p>
                </div>

                <!-- Current Image Info -->
                <div v-if="isEditMode && form.current_image_url && !form.image" class="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
                  <svg class="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <p class="text-sm text-blue-800 font-medium">Current Image</p>
                    <p class="text-sm text-blue-600 mt-0.5">Your existing image will be kept unless you upload a new one.</p>
                  </div>
                </div>

                <!-- Selected File Info -->
                <div v-if="form.image" class="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <div class="w-full">
                    <div class="flex justify-between items-start w-full">
                      <p class="text-sm font-medium text-green-800 truncate max-w-[200px]">{{ form.image.name }}</p>
                      <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {{ formatFileSize(form.image.size) }}
                      </span>
                    </div>
                    <div class="mt-2 w-full bg-green-100 rounded-full h-1.5">
                      <div class="bg-green-500 h-1.5 rounded-full" style="width: 100%"></div>
                    </div>
                    <p class="text-xs text-green-600 mt-1.5">Ready to upload</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Details Form -->
        <div class="mt-12">
          <div class="flex items-center mb-6">
            <div class="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
            </div>
            <h2 class="text-lg font-medium text-gray-900">Product Details</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-5">
              <div class="relative group">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Name <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                      v-model="form.name"
                      type="text"
                      id="name"
                      required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-700"
                      placeholder="e.g., Premium Wireless Headphones"
                  >
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <p class="mt-1 text-xs text-gray-500">A descriptive name for your product</p>
              </div>

              <div class="relative group">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <div class="relative">
                  <textarea
                      v-model="form.description"
                      id="description"
                      rows="6"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-700 resize-none"
                      placeholder="Describe your product in detail..."
                  ></textarea>
                </div>
                <p class="mt-1 text-xs text-gray-500">Detailed information about the product features and benefits</p>
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-5">
              <div class="grid grid-cols-2 gap-5">
                <div class="relative group">
                  <label for="price" class="block text-sm font-medium text-gray-700 mb-1.5">
                    Price <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                        v-model.number="form.price"
                        type="number"
                        id="price"
                        required
                        min="0"
                        step="0.01"
                        class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="0.00"
                    >
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Selling price per unit</p>
                </div>

                <div class="relative group">
                  <label for="stock" class="block text-sm font-medium text-gray-700 mb-1.5">
                    Stock <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                        v-model.number="form.stock"
                        type="number"
                        id="stock"
                        required
                        min="0"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="0"
                    >
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Available quantity</p>
                </div>
              </div>

              <div class="relative group">
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Status <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select
                      v-model="form.status"
                      id="status"
                      required
                      class="appearance-none w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="ACTIVE" class="py-2">Active</option>
                    <option value="INACTIVE" class="py-2">Inactive</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                <p class="mt-1 text-xs text-gray-500">Product visibility status</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="bg-gray-50 px-8 py-6 border-t">
        <div class="flex justify-between">
          <button
              type="button"
              @click="goBack"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <div class="flex space-x-4">
            <button
                v-if="isEditMode"
                type="button"
                @click="resetForm"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
                type="submit"
                :disabled="submitting"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              <svg v-if="submitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { productService } from '~/services/api';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const loading = ref(false);
const submitting = ref(false);
const imagePreview = ref<string>('');
const fileInput = ref<HTMLInputElement | null>(null);

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  image: null as File | null,
  current_image_url: '',
  status: 'ACTIVE'
});

const defaultForm = { ...form };

onMounted(async () => {
  if (isEditMode.value) {
    await fetchProduct();
  }
});

async function fetchProduct() {
  try {
    loading.value = true;
    const productId = parseInt(route.params.id as string);
    const product = await productService.getProduct(productId);

    Object.assign(form, {
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      current_image_url: product.image_url || '',
      status: product.status
    });

    Object.assign(defaultForm, { ...form });
  } catch (error) {
    alert('Failed to load product');
    await router.push('/admin');
  } finally {
    loading.value = false;
  }
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      if (fileInput.value) fileInput.value.value = '';
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Only image files are allowed (JPEG, PNG, GIF, WebP)');
      if (fileInput.value) fileInput.value.value = '';
      return;
    }

    form.image = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function removeImage() {
  form.image = null;
  form.current_image_url = '';
  imagePreview.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  const fallbackUrl = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
  if (img.src !== fallbackUrl && !img.src.includes('placeholder.com')) {
    img.src = fallbackUrl;
    img.onerror = null;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function resetForm() {
  Object.assign(form, { ...defaultForm });
  imagePreview.value = form.current_image_url || '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function goBack() {
  router.push('/admin');
}

async function submitForm() {
  if (submitting.value) return;

  try {
    submitting.value = true;

    // Create FormData
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price.toString());
    formData.append('stock', form.stock.toString());
    formData.append('status', form.status);

    if (isEditMode.value) {
      formData.append('current_image_url', form.current_image_url || '');
    }

    if (form.image) {
      formData.append('image', form.image);
    }

    if (isEditMode.value) {
      const productId = parseInt(route.params.id as string);
      await productService.updateProduct(productId, formData);
    } else {
      await productService.createProduct(formData);
    }

    await router.push('/admin');
  } catch (error: any) {
    console.error('Error saving product:', error);

    if (error?.data?.error) {
      alert(`Failed to save product: ${error.data.error}`);
    } else if (error?.message?.includes('Network Error')) {
      alert('Network error. Please check if the server is running.');
    } else {
      alert('Failed to save product. Please try again.');
    }
  } finally {
    submitting.value = false;
  }
}
</script>
