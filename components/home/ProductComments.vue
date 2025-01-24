<template>
  <div class="product-comments">
    <!-- 載入狀態 -->
    <div v-if="commentStore.loading" 
         class="flex justify-center items-center py-8">
      <i class="pi pi-spinner animate-spin text-4xl text-primary-500"></i>
    </div>

    <!-- 錯誤提示 -->
    <div v-else-if="commentStore.error" 
         class="text-center py-8 text-red-500">
      {{ commentStore.error }}
    </div>

    <div v-else>
      <!-- 評論統計 -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold">用戶評價</h3>
        <div class="flex items-center">
          <span class="text-2xl font-bold text-yellow-400 mr-2">
            {{ averageRating.toFixed(1) }}
          </span>
          <div class="flex">
            <span v-for="i in 5" :key="i" 
                  class="text-xl"
                  :class="i <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'">
              ★
            </span>
          </div>
          <span class="ml-2 text-gray-500">({{ comments.length }} 則評價)</span>
        </div>
      </div>

      <!-- 新增評論 -->
      <div v-if="userStore.isLoggedIn" class="mb-8">
        <div class="flex items-start space-x-4">
          <img :src="userStore.user?.avatar || '/default-avatar.png'" 
               :alt="userStore.user?.name"
               class="w-10 h-10 rounded-full">
          <div class="flex-grow">
            <textarea v-model="newComment" 
                      rows="3"
                      class="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="分享您的使用心得..."></textarea>
            <div class="mt-2 flex justify-between items-center">
              <div class="flex items-center">
                <span class="mr-2">評分：</span>
                <div class="flex">
                  <span v-for="i in 5" :key="i"
                        class="text-xl cursor-pointer"
                        :class="i <= newRating ? 'text-yellow-400' : 'text-gray-300'"
                        @click="newRating = i">
                    ★
                  </span>
                </div>
              </div>
              <button @click="submitComment"
                      class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                發表評論
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 評論列表 -->
      <div class="space-y-6">
        <div v-for="comment in comments" 
             :key="comment.id"
             class="flex space-x-4">
          <img :src="comment.userAvatar" 
               :alt="comment.userName"
               class="w-10 h-10 rounded-full">
          <div class="flex-grow">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold">{{ comment.userName }}</h4>
                <div class="flex items-center mt-1">
                  <div class="flex">
                    <span v-for="i in 5" :key="i"
                          class="text-sm"
                          :class="i <= comment.rating ? 'text-yellow-400' : 'text-gray-300'">
                      ★
                    </span>
                  </div>
                  <span class="text-sm text-gray-500 ml-2">
                    {{ new Date(comment.createdAt).toLocaleDateString() }}
                  </span>
                </div>
              </div>
              <button v-if="userStore.user?.id === comment.userId"
                      @click="deleteComment(comment.id)"
                      class="text-gray-400 hover:text-red-500">
                <i class="pi pi-trash"></i>
              </button>
            </div>
            <p class="mt-2 text-gray-700">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCommentStore } from '~/stores/comments'
import { useUserStore } from '~/stores/user'
import { useRoute } from 'vue-router'

const route = useRoute()
const commentStore = useCommentStore()
const userStore = useUserStore()

const newComment = ref('')
const newRating = ref(5)

onMounted(async () => {
  const productId = route.params.id as string
  await commentStore.fetchComments(productId)
})

// 使用 getters 獲取評論數據
const comments = computed(() => commentStore.getComments)
const averageRating = computed(() => {
  const productId = route.params.id as string
  return commentStore.getAverageRating(productId)
})

// 提交評論
const submitComment = async () => {
  if (!newComment.value.trim() || !userStore.user) return

  try {
    await commentStore.addComment({
      productId: route.params.id as string,
      userId: userStore.user.id,
      userName: userStore.user.name,
      userAvatar: userStore.user.avatar || '/default-avatar.png',
      content: newComment.value.trim(),
      rating: newRating.value
    })
    
    // 清空輸入
    newComment.value = ''
    newRating.value = 5
  } catch (error) {
    console.error('Failed to submit comment:', error)
  }
}

// 刪除評論
const deleteComment = async (commentId: string) => {
  try {
    await commentStore.deleteComment(commentId)
  } catch (error) {
    console.error('Failed to delete comment:', error)
  }
}
</script>

<style scoped>
.comment-item {
  border-bottom: 1px solid #eee;
}
</style>
