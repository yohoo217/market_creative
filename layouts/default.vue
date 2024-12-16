<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-primary-600">創意市集</NuxtLink>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/products" class="text-gray-600 hover:text-primary-600">商品</NuxtLink>
            <NuxtLink to="/crowdfunding" class="text-gray-600 hover:text-primary-600">募資</NuxtLink>
            <Button label="登入" class="p-button-outlined" />
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-grow">
      <slot />
    </main>

    <footer class="bg-gray-100">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 創意市集. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>