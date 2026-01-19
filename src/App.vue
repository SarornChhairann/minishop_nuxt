<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Top Announcement Bar -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 px-4 text-sm">
      🚚 Free shipping on orders over $50 | Shop now!
    </div>
    
    <!-- Main Navigation -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex-shrink-0 flex items-center" @click="forceUpdate">
              <img class="h-8 w-auto" src="~/assets/mini-shop.png" alt="MiniShop">
              <span class="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MiniShop</span>
            </NuxtLink>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <NuxtLink 
              to="/" 
              class="px-3 py-2 text-sm font-medium hover:text-blue-600 transition-colors"
              :class="{ 'text-blue-600': currentRoute === '/' }"
            >
              Home
            </NuxtLink>
            <NuxtLink to="/about" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" :class="{ 'text-blue-600': currentRoute === '/about' }">
              About
            </NuxtLink>
            <NuxtLink to="/contact" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" :class="{ 'text-blue-600': currentRoute === '/contact' }">
              Contact
            </NuxtLink>
          </div>
          
          <!-- Right side icons -->
          <div class="flex items-center space-x-4">
            <NuxtLink 
              to="/cart" 
              class="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"
              @click="forceUpdate"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span v-if="cartStore.items.length > 0" 
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ cartStore.items.length }}
              </span>
            </NuxtLink>
            
            <NuxtLink 
              to="/admin" 
              class="hidden md:flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="forceUpdate"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </NuxtLink>
            
            <!-- Mobile menu button -->
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink 
            to="/" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="isMobileMenuOpen = false"
          >
            Home
          </NuxtLink>
          <a href="#" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            Shop
          </a>
          <a href="#" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            Categories
          </a>
          <a href="#" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            About
          </a>
          <a href="#" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
            Contact
          </a>
          <NuxtLink 
            to="/admin" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="isMobileMenuOpen = false"
          >
            Admin Dashboard
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow">
      <NuxtPage :key="routeKey" />
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-white pt-12 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- About Column -->
          <div>
            <h3 class="text-lg font-semibold mb-4">About MiniShop</h3>
            <p class="text-gray-400 text-sm">
              Your one-stop shop for the latest products and trends. We offer high-quality items with fast shipping and excellent customer service.
            </p>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Home</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Shop</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">About Us</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
              <li><NuxtLink to="/admin" class="text-gray-400 hover:text-white text-sm transition-colors">Admin</NuxtLink></li>
            </ul>
          </div>
          
          <!-- Customer Service -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">FAQs</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Shipping & Returns</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <!-- Newsletter -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Newsletter</h3>
            <p class="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div class="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                class="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
            <div class="flex space-x-4 mt-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <span class="sr-only">Twitter</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <span class="sr-only">Instagram</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="mt-12 border-t border-gray-800 pt-8">
          <p class="text-center text-gray-400 text-sm">
            &copy; {{ new Date().getFullYear() }} MiniShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

    <!-- Scroll to Top Button -->
    <button 
      v-show="isScrolled"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label="Scroll to top"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useRoute } from 'vue-router';

const route = useRoute();
const routeKey = computed(() => route.fullPath);

const cartStore = useCartStore();
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const currentRoute = computed(() => route.path);

const checkScroll = () => {
  isScrolled.value = window.scrollY > 100;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const forceUpdate = () => {
  isMobileMenuOpen.value = false;
  // In Nuxt 3, navigation automatically handles updates, 
  // but if we need to force refresh, we can use refreshNuxtData or key change
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>