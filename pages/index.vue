<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Banner 區域 -->
      <Banner class="w-full h-[400px]" />
  
      <!-- 搜索欄 -->
      <div class="container mx-auto px-4 -mt-8 relative z-10">
        <SearchBar />
      </div>
  
      <!-- 精選商品展示 -->
      <section class="featured-section container mx-auto px-4 py-12">
        <h2 class="text-2xl font-bold mb-8 text-center">精選商品展示</h2>
        <div class="featured-gallery">
          <ImageGallery :images="featuredImages" class="featured" />
        </div>
      </section>
  
      <!-- 產品列表 -->
      <section class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-8">所有商品</h2>
        <ProductGrid />
      </section>
  
      <!-- 創作者專區 -->
      <section class="container mx-auto px-4 py-8 bg-white">
        <h2 class="text-2xl font-bold mb-6">創作者專區</h2>
        <CreatorSection />
      </section>
  
      <!-- 工程師接案專區 -->
      <section class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">工程師接案專區</h2>
        <EngineerSection />
      </section>
  
      <!-- 報價諮詢區 -->
      <section class="container mx-auto px-4 py-8 bg-white">
        <h2 class="text-2xl font-bold mb-6">報價諮詢</h2>
        <QuotationSection />
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import Banner from '~/components/home/Banner.vue'
  import SearchBar from '~/components/home/SearchBar.vue'
  import ImageGallery from '~/components/common/ImageGallery.vue'
  import ProductGrid from '~/components/home/ProductGrid.vue'
  import CreatorSection from '~/components/home/CreatorSection.vue'
  import EngineerSection from '~/components/home/EngineerSection.vue'
  import QuotationSection from '~/components/home/QuotationSection.vue'
  
  // 精選商品圖片
  const featuredImages = [
    'https://picsum.photos/seed/featured1/800/500',
    'https://picsum.photos/seed/featured2/800/500',
    'https://picsum.photos/seed/featured3/800/500',
    'https://picsum.photos/seed/featured4/800/500',
    'https://picsum.photos/seed/featured5/800/500'
  ]
  </script>
  
  <style scoped>
  .featured-section {
    background: linear-gradient(to bottom, #f8fafc, #ffffff);
  }

  .featured-gallery {
    max-width: 1200px;
    margin: 0 auto;
  }

  .featured-gallery :deep(.image-gallery-container) {
    height: 450px !important;
  }

  .featured-gallery :deep(.gallery-item) {
    width: 360px !important;
    height: 270px !important;
    margin-top: -135px !important;
    margin-left: -180px !important;
  }

  .featured-gallery :deep(.gallery-position-0) {
    transform: translate(-360px, 0) scale(0.8) !important;
  }

  .featured-gallery :deep(.gallery-position-1) {
    transform: translate(-180px, 0) scale(0.9) !important;
  }

  .featured-gallery :deep(.gallery-position-2) {
    transform: translate(0, 0) scale(1) !important;
  }

  .featured-gallery :deep(.gallery-position-3) {
    transform: translate(180px, 0) scale(0.9) !important;
  }

  .featured-gallery :deep(.gallery-position-4) {
    transform: translate(360px, 0) scale(0.8) !important;
  }

  .featured-gallery :deep(.gallery-item:hover) {
    transform: scale(1.15) translateZ(30px) !important;
  }
  </style>