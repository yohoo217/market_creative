<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Banner 區域 -->
      <Banner class="w-full h-[400px]" />

      <!-- 最新創意 -->
      <section class="container mx-auto px-4 py-8">
        <IdeaSection />
      </section>

      <!-- 火熱募資中產品 -->
      <section class="container mx-auto px-4 py-8 bg-white">
        <FundraisingSection />
      </section>

      <!-- 熱門作品 -->
      <section class="container mx-auto px-4 py-8">
        <PopularProductsSection />
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
        <h2 class="text-2xl font-bold mb-6"></h2>
        <QuotationSection />
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import Banner from '~/components/home/Banner.vue'
  import IdeaSection from '~/components/home/IdeaSection.vue'
  import FundraisingSection from '~/components/home/FundraisingSection.vue'
  import PopularProductsSection from '~/components/home/PopularProductsSection.vue'
  import CreatorSection from '~/components/home/CreatorSection.vue'
  import EngineerSection from '~/components/home/EngineerSection.vue'
  import QuotationSection from '~/components/home/QuotationSection.vue'
  </script>
  