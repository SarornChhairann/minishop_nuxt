<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">
        {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ isEditMode ? 'Update product information' : 'Add a new product to your store' }}
      </p>
    </div>

    <div v-if="loading && isEditMode" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <form v-else @submit.prevent="submitForm" enctype="multipart/form-data" class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="p-8">
        <!-- Image Upload at the Top -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-4">
            Product Image
          </label>

          <!-- Image Preview/Upload Area -->
          <div class="flex flex-col md:flex-row items-center gap-6">
            <!-- Image Preview -->
            <div class="w-full md:w-1/3">
              <div class="relative">
                <div class="aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50">
                  <div v-if="imagePreview || form.current_image_url" class="h-full">
                    <img
                        :src="imagePreview || form.current_image_url"
                        :alt="form.name || 'Product image'"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                    >
                  </div>
                  <div v-else class="h-full flex flex-col items-center justify-center p-4">
                    <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="mt-2 text-sm text-gray-500 text-center">
                      No image selected
                    </p>
                  </div>
                </div>

                <!-- Remove Image Button -->
                <button
                    v-if="imagePreview || form.current_image_url"
                    type="button"
                    @click="removeImage"
                    class="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
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
              <div class="space-y-4">
                <div>
                  <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Image
                  </label>
                  <div class="flex items-center space-x-4">
                    <label class="flex-1 cursor-pointer">
                      <div class="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-center">
                        <span class="text-blue-600 font-medium">Choose File</span>
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
                    <div class="text-sm text-gray-500">
                      or drag and drop
                    </div>
                  </div>
                  <p class="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF, WebP up to 5MB
                  </p>
                </div>

                <!-- Current Image Info -->
                <div v-if="isEditMode && form.current_image_url && !form.image" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    Current image will be kept unless you upload a new one.
                  </p>
                </div>

                <!-- Selected File Info -->
                <div v-if="form.image" class="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p class="text-sm text-green-700 flex items-center justify-between">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      {{ form.image.name }}
                    </span>
                    <span class="text-xs">
                      {{ formatFileSize(form.image.size) }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Details Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div>
            <div class="mb-6">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                  v-model="form.name"
                  type="text"
                  id="name"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
              >
            </div>

            <div class="mb-6">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                  v-model="form.description"
                  id="description"
                  rows="6"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description"
              ></textarea>
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <div class="mb-6">
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                Price *
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
                    class="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                >
              </div>
            </div>

            <div class="mb-6">
              <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                  v-model.number="form.stock"
                  type="number"
                  id="stock"
                  required
                  min="0"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter stock quantity"
              >
            </div>

            <div class="mb-6">
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                  v-model="form.status"
                  id="status"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Product Summary (Compact) -->
        <div class="mt-8 pt-8 border-t">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold">Product Summary</h3>
            <div class="text-sm text-gray-500">
              {{ (imagePreview || form.current_image_url) ? 'Image: Uploaded' : 'Image: No image' }}
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-4">
                <div class="w-16 h-16 rounded overflow-hidden bg-gray-200">
                  <img
                      v-if="imagePreview || form.current_image_url"
                      :src="imagePreview || form.current_image_url"
                      :alt="form.name || 'Product'"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                  >
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-lg">{{ form.name || 'Product Name' }}</h4>
                <p class="text-gray-600 text-sm mt-1 line-clamp-2">{{ form.description || 'No description provided' }}</p>
                <div class="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <span class="text-gray-500">Price:</span>
                    <span class="font-medium ml-1">${{ (form.price || 0) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Stock:</span>
                    <span class="font-medium ml-1">{{ form.stock || 0 }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Status:</span>
                    <span
                        :class="[
                        'ml-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        form.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ form.status || 'INACTIVE' }}
                    </span>
                  </div>
                </div>
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
import { useRoute, useRouter } from 'vue-router';
import { productService } from '@/services/api';

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => route.name === 'EditProduct');
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

    // Handle specific error messages
    if (error.response?.data?.error) {
      alert(`Failed to save product: ${error.response.data.error}`);
    } else if (error.message?.includes('Network Error')) {
      alert('Network error. Please check if the server is running.');
    } else {
      alert('Failed to save product. Please try again.');
    }
  } finally {
    submitting.value = false;
  }
}
</script>