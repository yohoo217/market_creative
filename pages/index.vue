<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Banner 區域 -->
      <Banner class="w-full h-[400px]" />

      <!-- 三區塊展示 -->
      <section class="container mx-auto px-4 py-8">
        <IdeaSection />
      </section>

      <!-- 新版商品展示 -->
      <section class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-8">熱門作品</h2>
        <ProductLayout />
      </section>

      <!-- 創作者專區 -->
      <section class="container mx-auto px-4 py-8 bg-white">
        <h2 class="text-2xl font-bold mb-6">熱門創作者專區</h2>
        <CreatorSection />
      </section>
  
      <!-- 工程師接案專區 -->
      <section class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">工程師接案專區</h2>
        <EngineerSection />
      </section>
  
      <!-- 報價諮詢區 -->
      <section class="container mx-auto px-4 py-8 bg-white">
        <h2 class="text-2xl font-bold mb-6">專人協助</h2>
        <QuotationSection />
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import Banner from '~/components/home/Banner.vue'
  import IdeaSection from '~/components/home/IdeaSection.vue'
  import ProductLayout from '~/components/home/ProductLayout.vue'
  import CreatorSection from '~/components/home/CreatorSection.vue'
  import EngineerSection from '~/components/home/EngineerSection.vue'
  import QuotationSection from '~/components/home/QuotationSection.vue'
  </script>
  