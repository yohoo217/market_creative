<template>
  <div class="upload-box border-2 border-dashed border-gray-300 rounded-lg p-4">
    <FileUpload
      :multiple="true"
      accept="image/*"
      :maxFileSize="5000000"
      @upload="onUpload"
      :auto="true"
      chooseLabel="選擇檔案"
      uploadLabel="上傳"
      cancelLabel="取消"
      class="upload-component"
    >
      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-upload text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">拖曳檔案至此處或點擊上傳</p>
          <p class="text-sm text-gray-400 mt-2">支援 JPG, PNG 檔案</p>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const emit = defineEmits(['upload-success'])

const onUpload = async (event: any) => {
  try {
    const files = event.files
    const uploadedUrls = []

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)

      const { data, error } = await useFetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })

      if (error.value) {
        throw new Error(error.value.message || '上傳失敗')
      }

      if (data.value?.success) {
        uploadedUrls.push(data.value.data.url)
      }
    }

    emit('upload-success', uploadedUrls)
    
    toast.add({
      severity: 'success',
      summary: '上傳成功',
      detail: '檔案已成功上傳到媒體庫',
      life: 3000
    })
  } catch (error: any) {
    console.error('上傳失敗:', error)
    toast.add({
      severity: 'error',
      summary: '上傳失敗',
      detail: error.message || '上傳檔案時發生錯誤',
      life: 3000
    })
  }
}
</script>

<style scoped>
.upload-component :deep(.p-fileupload-content) {
  @apply border-none;
}

.upload-component :deep(.p-fileupload-buttonbar) {
  @apply border-none bg-transparent justify-center;
}

.upload-component :deep(.p-button) {
  @apply bg-primary-600;
}
</style>