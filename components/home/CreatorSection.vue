<template>
  <div class="creator-section">
    <div
      v-if="workStore.loading"
      class="flex justify-center items-center min-h-[200px]"
    >
      <ProgressSpinner />
    </div>

    <div
      v-else-if="workStore.error"
      class="text-red-500 text-center min-h-[200px] flex items-center justify-center"
    >
      {{ workStore.error }}
    </div>

    <div v-else>
      <!-- IDEATOR作品展示 -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">熱門創作者作品</h3>
        <div class="relative">
          <button 
            @click="ideatorCurrentPage > 0 && ideatorCurrentPage--"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            :class="{ 'opacity-50 cursor-not-allowed': ideatorCurrentPage === 0 }"
          >
            <i class="pi pi-chevron-left text-xl"></i>
          </button>
          <div class="overflow-hidden">
            <div 
              class="flex transition-transform duration-300 ease-in-out"
              :style="{ transform: `translateX(-${ideatorCurrentPage * 100}%)` }"
            >
              <div
                v-for="work in ideatorWorks"
                :key="work._id"
                class="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
              >
                <div class="work-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    :src="work.image"
                    :alt="work.title"
                    class="w-full h-48 object-cover"
                  />
                  <div class="p-4">
                    <h4 class="text-lg font-semibold mb-2 line-clamp-1">{{ work.title }}</h4>
                    <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ work.description }}</p>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <Rating
                          :modelValue="work.rating || 0"
                          readonly
                          :cancel="false"
                        />
                        <span class="ml-2 text-sm text-gray-500"
                          >({{ work.comments?.length || 0 }})</span
                        >
                      </div>
                      <span class="text-sm text-gray-500">{{ work.user?.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button 
            @click="ideatorCurrentPage < maxIdeatorPage && ideatorCurrentPage++"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            :class="{ 'opacity-50 cursor-not-allowed': ideatorCurrentPage === maxIdeatorPage }"
          >
            <i class="pi pi-chevron-right text-xl"></i>
          </button>
        </div>
      </div>

      <!-- ENGINEER作品展示 -->
      <div>
        <h3 class="text-xl font-semibold mb-4">工程師作品</h3>
        <div class="relative">
          <button 
            @click="engineerCurrentPage > 0 && engineerCurrentPage--"
            class="left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            :class="{ 'opacity-50 cursor-not-allowed': engineerCurrentPage === 0 }"
          >
            <i class="pi pi-chevron-left text-xl"></i>
          </button>
          <div class="overflow-hidden">
            <div 
              class="flex transition-transform duration-300 ease-in-out"
              :style="{ transform: `translateX(-${engineerCurrentPage * 100}%)` }"
            >
              <div
                v-for="work in engineerWorks"
                :key="work._id"
                class="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
              >
                <div class="work-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    :src="work.image"
                    :alt="work.title"
                    class="w-full h-48 object-cover"
                  />
                  <div class="p-4">
                    <h4 class="text-lg font-semibold mb-2 line-clamp-1">{{ work.title }}</h4>
                    <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ work.description }}</p>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <Rating
                          :modelValue="work.rating || 0"
                          readonly
                          :cancel="false"
                        />
                        <span class="ml-2 text-sm text-gray-500"
                          >({{ work.comments?.length || 0 }})</span
                        >
                      </div>
                      <span class="text-sm text-gray-500">{{ work.user?.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button 
            @click="engineerCurrentPage < maxEngineerPage && engineerCurrentPage++"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            :class="{ 'opacity-50 cursor-not-allowed': engineerCurrentPage === maxEngineerPage }"
          >
            <i class="pi pi-chevron-right text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useWorkStore } from "~/stores/works";
import { UserRole } from "~/server/models/User";

interface UserRoleInfo {
  type: UserRole;
  isActive: boolean;
  rating?: number;
}

interface User {
  _id: string;
  name: string;
  roles: UserRoleInfo[];
  activeRole: UserRole;
}

interface Work {
  _id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  comments?: Array<{
    id: string;
    content: string;
    rating: number;
  }>;
  user?: User;
}

const workStore = useWorkStore();

onMounted(async () => {
  await workStore.fetchWorks();
});

const ideatorWorks = computed<Work[]>(() => {
  return workStore.works
    .filter((work) =>
      work.user?.roles.some(
        (role) => role.type === UserRole.IDEATOR && role.isActive
      )
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
});

const engineerWorks = computed<Work[]>(() => {
  return workStore.works
    .filter((work) =>
      work.user?.roles.some(
        (role) => role.type === UserRole.ENGINEER && role.isActive
      )
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
});

const ideatorCurrentPage = ref(0);
const engineerCurrentPage = ref(0);

const maxIdeatorPage = computed(() => Math.max(0, Math.ceil(ideatorWorks.value.length / 3) - 1));
const maxEngineerPage = computed(() => Math.max(0, Math.ceil(engineerWorks.value.length / 3) - 1));
</script>

<style scoped>
.creator-section {
  padding: 2rem;
  background-color: #f8f9fa;
}

.work-card {
  transition: transform 0.2s;
}

.work-card:hover {
  transform: translateY(-4px);
}

/* 添加滑動按鈕樣式 */
button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

button:hover:not(.cursor-not-allowed) {
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.transition-transform {
  transition: transform 0.3s ease-in-out;
}
</style>
