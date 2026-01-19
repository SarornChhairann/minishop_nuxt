<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-8">About MiniShop</h1>
      
      <div class="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Our Story</h2>
        <p class="text-gray-700 mb-6 leading-relaxed">
          Founded in 2023, MiniShop started as a small passion project with a big vision: to bring high-quality products 
          to customers at affordable prices. What began as a humble online store has grown into a trusted destination 
          for shoppers who value quality, convenience, and excellent customer service.
        </p>
        
        <h2 class="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p class="text-gray-700 mb-6 leading-relaxed">
          We're committed to providing our customers with a seamless shopping experience, from browsing our curated 
          selection to the moment your order arrives at your doorstep. We carefully select each product in our inventory 
          to ensure it meets our high standards of quality and value.
        </p>
        
        <h2 class="text-2xl font-semibold mt-8 mb-4">Why Choose Us?</h2>
        <ul class="space-y-4">
          <li class="flex items-start">
            <svg class="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-gray-700">Carefully curated selection of high-quality products</span>
          </li>
          <li class="flex items-start">
            <svg class="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-gray-700">Fast and reliable shipping</span>
          </li>
          <li class="flex items-start">
            <svg class="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-gray-700">Exceptional customer service</span>
          </li>
          <li class="flex items-start">
            <svg class="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-gray-700">Secure checkout process</span>
          </li>
        </ul>
      </div>
      
      <div class="bg-blue-50 rounded-lg p-6 text-center">
        <h2 class="text-2xl font-semibold mb-4">Have Questions?</h2>
        <p class="text-gray-700 mb-6">We'd love to hear from you! Visit our <router-link to="/contact" class="text-blue-600 hover:underline">Contact Us</router-link> page to get in touch with our team.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
