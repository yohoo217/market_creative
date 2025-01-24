<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">募資專案</h1>

    <!-- 募資進度區塊 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl font-bold">Front Wheel A2</h2>
          <p class="text-gray-600">/A024014-001</p>
        </div>
        <div class="flex items-center">
          <div class="flex gap-1">
            <span v-for="i in 3" :key="i" class="text-2xl text-yellow-400"
              >★</span
            >
          </div>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">募資進度</span>
          <span class="font-bold">NT$ 34,020 / NT$ 100,000</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            class="bg-primary-600 h-2.5 rounded-full"
            style="width: 73%"
          ></div>
        </div>
        <div class="flex justify-between text-sm text-gray-500">
          <span>73% 達成</span>
          <span>剩餘 30 天</span>
        </div>
      </div>
    </div>

    <!-- 卡片詳情視圖 (當選中卡片時顯示) -->
    <div v-if="selectedCard" class="mb-8">
      <div class="flex justify-between mb-4">
        <!-- 返回按鈕 -->
        <button
          @click="selectedCard = null"
          class="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          返回查看所有方案
        </button>
      </div>

      <div class="flex gap-8">
        <!-- 左側大圖 -->
        <div class="w-60px">
          <div class="relative">
            <!-- 左箭頭 -->
            <button
              @click="selectPrevCard"
              class="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10"
            >
              <span class="text-2xl">←</span>
            </button>

            <img
              :src="selectedCard.image"
              :alt="selectedCard.name"
              class="w-full h-[600px] object-cover rounded-lg"
            />

            <!-- 右箭頭 -->
            <button
              @click="selectNextCard"
              class="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10"
            >
              <span class="text-2xl">→</span>
            </button>
          </div>
        </div>

        <!-- 右側說明 -->
        <div class="w-1/2 bg-white rounded-lg p-6 relative">
          <h3 class="text-2xl font-bold mb-4">{{ selectedCard.name }}</h3>
          <div class="text-gray-600">
            <p class="mb-4">{{ selectedCard.description }}</p>
            <ul class="list-disc list-inside mb-4">
              <li
                v-for="(benefit, index) in selectedCard.benefits"
                :key="index"
              >
                {{ benefit }}
              </li>
            </ul>
            <p class="text-xl font-bold mb-4">NT$ {{ selectedCard.price }}</p>
            <div class="text-gray-500 mb-4">
              這邊會有更多文字敘述文字敘述文字敘述文字敘述文字敘述文字敘述，
              讓購買的人更容易被說服，你做這個選擇是對的，更多故事敘述一下{{
                selectedCard.name
              }}的角色性格和背景...
            </div>
          </div>

          <!-- 立即下單按鈕 -->
          <button
            @click="startCheckout"
            class="absolute bottom-6 right-6 bg-primary-500 text-white py-2 px-6 rounded-lg hover:bg-primary-600 transition-colors"
          >
            立即下單
          </button>
        </div>
      </div>
    </div>

    <!-- 方案選擇區域 (當未選中卡片時顯示) -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- 方案 A -->
        <div
          class="relative group perspective card"
          @click="selectCard(cards[0])"
          @mouseenter="hoveredCard = cards[0]"
          @mouseleave="hoveredCard = null"
        >
          <div
            class="relative w-full h-[400px] transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180"
          >
            <!-- 卡片正面 -->
            <div
              class="absolute w-full h-full bg-red-100 rounded-lg p-6 backface-hidden"
            >
              <img
                src="https://raw.githubusercontent.com/crobertsbmw/deckofcards/master/static/img/back.png"
                alt="方案A封面"
                class="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 class="text-xl font-bold mb-2">方案 A (Ana Teresa)</h3>
              <p class="text-gray-600">NT$ 760</p>
            </div>

            <!-- 卡片背面 -->
            <div
              class="absolute w-full h-full bg-white rounded-lg p-6 backface-hidden rotate-y-180"
            >
              <h3 class="text-xl font-bold mb-4">方案 A (Ana Teresa)</h3>
              <div class="text-gray-600">
                <p class="mb-4">基礎支持方案</p>
                <ul class="list-disc list-inside mb-4">
                  <li>Front Wheel A2 黑色款 x 1</li>
                </ul>
                <p class="font-bold">NT$ 760</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 方案 B -->
        <div
          class="relative group perspective card"
          @click="selectCard(cards[1])"
          @mouseenter="hoveredCard = cards[1]"
          @mouseleave="hoveredCard = null"
        >
          <div
            class="relative w-full h-[400px] transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180"
          >
            <!-- 卡片正面 -->
            <div
              class="absolute w-full h-full bg-red-100 rounded-lg p-6 backface-hidden"
            >
              <img
                src="https://raw.githubusercontent.com/crobertsbmw/deckofcards/master/static/img/back.png"
                alt="方案B封面"
                class="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 class="text-xl font-bold mb-2">方案 B (Isabella)</h3>
              <p class="text-gray-600">NT$ 850</p>
            </div>

            <!-- 卡片背面 -->
            <div
              class="absolute w-full h-full bg-white rounded-lg p-6 backface-hidden rotate-y-180"
            >
              <h3 class="text-xl font-bold mb-4">方案 B (Isabella)</h3>
              <div class="text-gray-600">
                <p class="mb-4">進階支持方案</p>
                <ul class="list-disc list-inside mb-4">
                  <li>Front Wheel A2 灰色款 x 1</li>
                  <li>限定貼紙組</li>
                </ul>
                <p class="font-bold">NT$ 850</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 方案 C -->
        <div
          class="relative group perspective card"
          @click="selectCard(cards[2])"
          @mouseenter="hoveredCard = cards[2]"
          @mouseleave="hoveredCard = null"
        >
          <div
            class="relative w-full h-[400px] transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180"
          >
            <!-- 卡片正面 -->
            <div
              class="absolute w-full h-full bg-red-100 rounded-lg p-6 backface-hidden"
            >
              <img
                src="https://raw.githubusercontent.com/crobertsbmw/deckofcards/master/static/img/back.png"
                alt="方案C封面"
                class="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 class="text-xl font-bold mb-2">方案 C (Rodriga)</h3>
              <p class="text-gray-600">NT$ 950</p>
            </div>

            <!-- 卡片背面 -->
            <div
              class="absolute w-full h-full bg-white rounded-lg p-6 backface-hidden rotate-y-180"
            >
              <h3 class="text-xl font-bold mb-4">方案 C (Rodriga)</h3>
              <div class="text-gray-600">
                <p class="mb-4">豪華支持方案</p>
                <ul class="list-disc list-inside mb-4">
                  <li>Front Wheel A2 黑色&灰色 x 2</li>
                  <li>10點的color點數</li>
                </ul>
                <p class="font-bold">NT$ 950</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 方案說明欄 -->
      <div class="bg-white rounded-lg p-6 shadow-md">
        <div v-if="hoveredCard">
          <h3 class="text-xl font-bold mb-4">{{ hoveredCard.name }}</h3>
          <p class="text-gray-600">{{ hoveredCard.description }}</p>
          <div class="mt-4">
            <ul class="list-disc list-inside">
              <li v-for="(benefit, index) in hoveredCard.benefits" :key="index">
                {{ benefit }}
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="text-gray-500">
          請將游標移至方案卡片上查看詳細說明
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Card {
  id: number;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  image: string;
}

const cards: Card[] = [
  {
    id: 1,
    name: "方案 A (Ana Teresa)",
    price: 760,
    description: "基礎支持方案",
    benefits: ["Front Wheel A2 黑色款 x 1"],
    image:
      "https://raw.githubusercontent.com/crobertsbmw/deckofcards/master/static/img/back.png",
  },
  {
    id: 2,
    name: "方案 B (Isabella)",
    price: 850,
    description: "進階支持方案",
    benefits: ["Front Wheel A2 灰色款 x 1", "限定貼紙組"],
    image:
      "https://raw.githubusercontent.com/crobertsbmw/deckofcards/master/static/img/back.png",
  },
  {
    id: 3,
    name: "方案 C (Rodriga)",
    price: 950,
    description: "豪華支持方案",
    benefits: ["Front Wheel A2 黑色&灰色 x 2", "10點的color點數"],
    image:
      "https://raw.githubusercontent.com/crobertsbmw/deckofcards/master/static/img/back.png",
  },
];

const hoveredCard = ref<Card | null>(null);
const selectedCard = ref<Card | null>(null);

const selectCard = (card: Card) => {
  selectedCard.value = card;
};

const selectPrevCard = () => {
  const currentIndex = cards.findIndex(
    (card) => card.id === selectedCard.value?.id
  );
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
  selectedCard.value = cards[prevIndex];
};

const selectNextCard = () => {
  const currentIndex = cards.findIndex(
    (card) => card.id === selectedCard.value?.id
  );
  const nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
  selectedCard.value = cards[nextIndex];
};

const startCheckout = () => {
  // TODO: 實現結帳流程
  console.log("開始結帳流程", selectedCard.value);
};
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.group:hover .group-hover\:rotate-y-180 {
  transform: rotateY(180deg);
}

.card {
  width: 300px;
  height: 450px;
  cursor: pointer;
}
</style>
