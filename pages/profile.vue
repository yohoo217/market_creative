# 創建新的個人資料頁面
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- 頁面標題 -->
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-3xl font-bold text-gray-800 mb-2 relative inline-block">
          個人資料
          <span class="absolute bottom-0 left-0 w-full h-1 bg-primary-500 opacity-50 rounded-full"></span>
        </h1>
        <p class="text-gray-600 mt-2">管理您的個人信息和帳戶設置</p>
      </div>

      <!-- 主要內容區域 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 左側個人信息卡片 -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <!-- 頂部裝飾帶 -->
            <div class="h-12 bg-gradient-to-r from-primary-500 to-primary-400"></div>
            
            <!-- 頭像上傳區域 -->
            <div class="text-center -mt-8 mb-6 px-6 pt-2">
              <div class="relative inline-block">
                <div class="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    :src="form.avatarPreview || currentUser?.avatar || '/avatars/ideator.jpg'" 
                    class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    alt="用戶頭像"
                  />
                </div>
                <Button
                  icon="pi pi-camera"
                  class="absolute bottom-2 right-2 p-button-rounded p-button-sm shadow-md"
                  @click="$refs.avatarInput.click()"
                />
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onAvatarSelect"
                />
              </div>
              <h3 class="mt-6 text-2xl font-semibold text-gray-800">{{ currentUser?.name || '創意用戶' }}</h3>
              <div class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm inline-block mt-2">
                {{ roleLabels[currentUser?.activeRole || 'visitor'] }}
              </div>
            </div>

            <!-- 分隔線 -->
            <div class="w-3/4 h-px bg-gray-200 mx-auto"></div>

            <!-- 帳戶狀態信息 -->
            <div class="p-6 space-y-4 text-sm">
              <div class="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span class="text-gray-600 flex items-center">
                  <i class="pi pi-check-circle mr-2 text-green-500"></i>
                  帳戶狀態
                </span>
                <span class="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">已驗證</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span class="text-gray-600 flex items-center">
                  <i class="pi pi-calendar mr-2 text-blue-500"></i>
                  註冊時間
                </span>
                <span class="text-gray-800">{{ formatDate(currentUser?.createdAt) }}</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span class="text-gray-600 flex items-center">
                  <i class="pi pi-clock mr-2 text-orange-500"></i>
                  最後登入
                </span>
                <span class="text-gray-800">{{ formatDate(currentUser?.lastLoginAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側表單區域 -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <TabView class="profile-tabs">
              <!-- 基本信息標籤頁 -->
              <TabPanel header="基本信息">
                <div class="p-6">
                  <form @submit.prevent="handleBasicInfoSubmit" class="space-y-6">
                    <!-- 用戶名 -->
                    <div class="form-group">
                      <label for="name" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <i class="pi pi-user mr-2 text-primary-500"></i>
                        用戶名
                      </label>
                      <InputText
                        id="name"
                        v-model="form.name"
                        class="w-full rounded-lg transition-all duration-200 focus:shadow-md"
                        :class="{ 'p-invalid': v$.name.$error }"
                      />
                      <small v-if="v$.name.$error" class="text-red-500 flex items-center mt-1">
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        {{ v$.name.$errors[0].$message }}
                      </small>
                    </div>

                    <!-- 電子郵件 -->
                    <div class="form-group">
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <i class="pi pi-envelope mr-2 text-primary-500"></i>
                        電子郵件
                      </label>
                      <InputText
                        id="email"
                        v-model="form.email"
                        type="email"
                        class="w-full rounded-lg bg-gray-50"
                        :class="{ 'p-invalid': v$.email.$error }"
                        disabled
                      />
                      <small class="text-gray-500 flex items-center mt-1">
                        <i class="pi pi-lock mr-1"></i>
                        郵箱地址不可修改
                      </small>
                    </div>

                    <!-- 自我介紹 -->
                    <div class="form-group">
                      <label for="bio" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <i class="pi pi-comment mr-2 text-primary-500"></i>
                        自我介紹
                      </label>
                      <Textarea
                        id="bio"
                        v-model="form.bio"
                        rows="4"
                        class="w-full rounded-lg resize-none transition-all duration-200 focus:shadow-md"
                        :class="{ 'p-invalid': v$.bio.$error }"
                        placeholder="簡短介紹一下您自己..."
                      />
                      <small v-if="v$.bio.$error" class="text-red-500 flex items-center mt-1">
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        {{ v$.bio.$errors[0].$message }}
                      </small>
                      <small v-else class="text-gray-500 flex items-center mt-1 justify-end">
                        {{ form.bio.length }}/500
                      </small>
                    </div>

                    <!-- 提交按鈕 -->
                    <div class="flex justify-end pt-4">
                      <Button
                        type="submit"
                        label="保存更改"
                        icon="pi pi-check"
                        class="p-button-rounded shadow-md transition-transform hover:scale-105"
                        :loading="loading"
                        :disabled="!isBasicInfoChanged"
                      />
                    </div>
                  </form>
                </div>
              </TabPanel>

              <!-- 修改密碼標籤頁 -->
              <TabPanel header="修改密碼">
                <div class="p-6">
                  <form @submit.prevent="handlePasswordSubmit" class="space-y-6">
                    <!-- 當前密碼 -->
                    <div class="form-group">
                      <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <i class="pi pi-key mr-2 text-primary-500"></i>
                        當前密碼
                      </label>
                      <Password
                        id="currentPassword"
                        v-model="form.currentPassword"
                        :feedback="false"
                        class="w-full rounded-lg"
                        inputClass="w-full rounded-lg transition-all duration-200 focus:shadow-md"
                        :class="{ 'p-invalid': v$.currentPassword.$error }"
                        placeholder="請輸入當前密碼"
                      />
                      <small v-if="v$.currentPassword.$error" class="text-red-500 flex items-center mt-1">
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        {{ v$.currentPassword.$errors[0].$message }}
                      </small>
                    </div>

                    <!-- 新密碼 -->
                    <div class="form-group">
                      <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <i class="pi pi-lock mr-2 text-primary-500"></i>
                        新密碼
                      </label>
                      <Password
                        id="newPassword"
                        v-model="form.newPassword"
                        class="w-full rounded-lg"
                        inputClass="w-full rounded-lg transition-all duration-200 focus:shadow-md"
                        :class="{ 'p-invalid': v$.newPassword.$error }"
                        placeholder="請設置新密碼"
                      >
                        <template #footer>
                          <div class="p-3 bg-gray-50 rounded-lg">
                            <div class="text-xs text-gray-600 mb-2">密碼強度：
                              <span :class="{
                                'text-red-500': passwordStrength === 'weak',
                                'text-yellow-500': passwordStrength === 'medium',
                                'text-green-500': passwordStrength === 'strong'
                              }">{{ passwordStrengthText }}</span>
                            </div>
                            <div class="h-1.5 w-full bg-gray-200 rounded-full mb-3">
                              <div class="h-full rounded-full transition-all duration-300"
                                   :class="{
                                     'bg-red-500': passwordStrength === 'weak',
                                     'bg-yellow-500': passwordStrength === 'medium',
                                     'bg-green-500': passwordStrength === 'strong'
                                   }"
                                   :style="{ width: passwordStrengthPercent + '%' }">
                              </div>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                              <div v-for="(rule, key) in passwordRules" :key="key"
                                   class="flex items-center text-sm"
                                   :class="rule.valid ? 'text-green-600' : 'text-gray-500'">
                                <i class="pi" :class="rule.valid ? 'pi-check-circle text-green-500' : 'pi-circle-fill text-gray-300'"></i>
                                <span class="ml-2">{{ rule.message }}</span>
                              </div>
                            </div>
                          </div>
                        </template>
                      </Password>
                    </div>

                    <!-- 確認新密碼 -->
                    <div class="form-group">
                      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <i class="pi pi-lock mr-2 text-primary-500"></i>
                        確認新密碼
                      </label>
                      <Password
                        id="confirmPassword"
                        v-model="form.confirmPassword"
                        :feedback="false"
                        class="w-full rounded-lg"
                        inputClass="w-full rounded-lg transition-all duration-200 focus:shadow-md"
                        :class="{ 'p-invalid': v$.confirmPassword.$error }"
                        placeholder="請再次輸入新密碼"
                      />
                      <small v-if="v$.confirmPassword.$error" class="text-red-500 flex items-center mt-1">
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        {{ v$.confirmPassword.$errors[0].$message }}
                      </small>
                    </div>

                    <!-- 提交按鈕 -->
                    <div class="flex justify-end pt-4">
                      <Button
                        type="submit"
                        label="更改密碼"
                        icon="pi pi-key"
                        class="p-button-rounded shadow-md transition-transform hover:scale-105"
                        :loading="loading"
                        :disabled="!isPasswordFormValid"
                      />
                    </div>
                  </form>
                </div>
              </TabPanel>

              <!-- 通知設置標籤頁 -->
              <TabPanel header="通知設置">
                <div class="p-6 space-y-6">
                  <!-- 電子郵件通知 -->
                  <div class="space-y-4">
                    <h3 class="text-lg font-medium text-gray-900 flex items-center">
                      <i class="pi pi-envelope mr-2 text-primary-500"></i>
                      電子郵件通知
                    </h3>
                    <div class="space-y-3 bg-gray-50 p-4 rounded-xl">
                      <div v-for="(setting, key) in emailNotificationSettings" 
                           :key="key"
                           class="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <p class="text-sm font-medium text-gray-700">{{ setting.label }}</p>
                          <p class="text-xs text-gray-500 mt-1">{{ setting.description }}</p>
                        </div>
                        <InputSwitch v-model="setting.value" @change="saveNotificationSettings" 
                                     class="transform transition-transform hover:scale-105"/>
                      </div>
                    </div>
                  </div>

                  <!-- 站內通知 -->
                  <div class="space-y-4">
                    <h3 class="text-lg font-medium text-gray-900 flex items-center">
                      <i class="pi pi-bell mr-2 text-primary-500"></i>
                      站內通知
                    </h3>
                    <div class="space-y-3 bg-gray-50 p-4 rounded-xl">
                      <div v-for="(setting, key) in inAppNotificationSettings" 
                           :key="key"
                           class="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <p class="text-sm font-medium text-gray-700">{{ setting.label }}</p>
                          <p class="text-xs text-gray-500 mt-1">{{ setting.description }}</p>
                        </div>
                        <InputSwitch v-model="setting.value" @change="saveNotificationSettings"
                                     class="transform transition-transform hover:scale-105"/>
                      </div>
                    </div>
                  </div>

                  <!-- 儲存按鈕 -->
                  <div class="flex justify-end pt-4">
                    <Button
                      label="儲存設置"
                      icon="pi pi-save"
                      class="p-button-rounded shadow-md transition-transform hover:scale-105"
                      @click="saveAllNotificationSettings"
                    />
                  </div>
                </div>
              </TabPanel>

              <!-- 項目管理標籤頁 -->
              <TabPanel header="項目管理">
                <div class="p-6 space-y-6">
                  <!-- 項目狀態過濾 -->
                  <div class="flex flex-wrap gap-3 mb-4">
                    <div class="text-lg font-medium text-gray-900 flex items-center mr-4">
                      <i class="pi pi-th-large mr-2 text-primary-500"></i>
                      我的項目
                    </div>
                    <div class="flex-1 flex flex-wrap gap-2">
                      <Button 
                        :class="[
                          'p-button-rounded p-button-sm',
                          projectFilter === 'all' ? 'p-button-primary' : 'p-button-outlined p-button-secondary'
                        ]"
                        label="全部" 
                        @click="projectFilter = 'all'"
                      />
                      <Button 
                        :class="[
                          'p-button-rounded p-button-sm',
                          projectFilter === 'idea' ? 'p-button-primary' : 'p-button-outlined p-button-secondary'
                        ]"
                        label="創意階段" 
                        @click="projectFilter = 'idea'"
                      />
                      <Button 
                        :class="[
                          'p-button-rounded p-button-sm',
                          projectFilter === 'in_progress' ? 'p-button-primary' : 'p-button-outlined p-button-secondary'
                        ]"
                        label="進行中" 
                        @click="projectFilter = 'in_progress'"
                      />
                      <Button 
                        :class="[
                          'p-button-rounded p-button-sm',
                          projectFilter === 'fundraising' ? 'p-button-primary' : 'p-button-outlined p-button-secondary'
                        ]"
                        label="募資中" 
                        @click="projectFilter = 'fundraising'"
                      />
                      <Button 
                        :class="[
                          'p-button-rounded p-button-sm',
                          projectFilter === 'completed' ? 'p-button-primary' : 'p-button-outlined p-button-secondary'
                        ]"
                        label="已完成" 
                        @click="projectFilter = 'completed'"
                      />
                    </div>
                    <div>
                      <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="projectSearchQuery" placeholder="搜索項目" class="p-inputtext-sm" />
                      </span>
                    </div>
                  </div>

                  <!-- 項目排序選項 -->
                  <div class="flex justify-between items-center mb-6">
                    <div class="text-sm text-gray-500">
                      顯示 {{ filteredProjects.length }} 個項目
                    </div>
                    <Dropdown
                      v-model="projectSortOption"
                      :options="projectSortOptions"
                      optionLabel="label"
                      placeholder="排序方式"
                      class="w-40 text-sm"
                    />
                  </div>

                  <!-- 項目列表 -->
                  <div v-if="isLoadingProjects" class="flex justify-center py-8">
                    <ProgressSpinner strokeWidth="4" class="w-12 h-12" />
                  </div>
                  <div v-else-if="projectsError" class="text-center py-8 bg-red-50 rounded-lg">
                    <i class="pi pi-exclamation-triangle text-red-500 text-3xl mb-2"></i>
                    <p class="text-red-600">無法載入項目列表</p>
                    <Button icon="pi pi-refresh" label="重試" class="mt-4 p-button-sm" @click="loadProjects" />
                  </div>
                  <div v-else-if="filteredProjects.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
                    <img src="/empty-box.svg" alt="無項目" class="w-24 h-24 mx-auto mb-4 opacity-70">
                    <p class="text-gray-600 mb-2">暫無項目</p>
                    <p class="text-gray-500 text-sm mb-6">您當前沒有任何符合條件的項目</p>
                    <Button icon="pi pi-plus" label="創建新項目" @click="navigateToCreateProject" class="p-button-primary" />
                  </div>
                  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="project in filteredProjects" :key="project.id" 
                         class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                      <!-- 項目頭部 -->
                      <div class="relative">
                        <!-- 項目封面圖片 -->
                        <img :src="project.image || '/default-product-image.png'" :alt="project.name" 
                             class="w-full h-48 object-cover">
                        
                        <!-- 項目狀態標籤 -->
                        <div class="absolute top-3 right-3">
                          <span :class="[
                            'px-3 py-1 rounded-full text-xs font-medium',
                            project.status === 'idea' ? 'bg-blue-100 text-blue-700' :
                            project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                            project.status === 'fundraising' ? 'bg-purple-100 text-purple-700' :
                            'bg-green-100 text-green-700'
                          ]">
                            {{ projectStatusText[project.status] }}
                          </span>
                        </div>
                      </div>
                      
                      <!-- 項目內容 -->
                      <div class="p-4">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{{ project.name }}</h3>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ project.shortDescription }}</p>
                        
                        <!-- 項目統計信息 -->
                        <div class="flex justify-between items-center text-xs text-gray-500 mb-4">
                          <div class="flex items-center">
                            <i class="pi pi-calendar mr-1"></i>
                            <span>{{ formatDate(project.createdAt) }}</span>
                          </div>
                          <div class="flex items-center">
                            <i class="pi pi-comment mr-1"></i>
                            <span>{{ project.comments || 0 }} 評論</span>
                          </div>
                          <div class="flex items-center">
                            <i class="pi pi-file mr-1"></i>
                            <span>{{ project.proposals || 0 }} 提案</span>
                          </div>
                        </div>
                        
                        <!-- 項目進度條 -->
                        <div v-if="project.status === 'in_progress'" class="mb-4">
                          <div class="flex justify-between text-xs mb-1">
                            <span class="text-gray-600">完成進度</span>
                            <span class="text-primary-700 font-medium">{{ project.progress || 0 }}%</span>
                          </div>
                          <ProgressBar :value="project.progress || 0" class="h-2" />
                        </div>
                        
                        <!-- 募資進度 -->
                        <div v-else-if="project.status === 'fundraising'" class="mb-4">
                          <div class="flex justify-between text-xs mb-1">
                            <span class="text-gray-600">募資進度</span>
                            <span class="text-primary-700 font-medium">{{ project.fundingProgress || 0 }}%</span>
                          </div>
                          <ProgressBar :value="project.fundingProgress || 0" class="h-2" />
                          <div class="flex justify-between text-xs mt-1">
                            <span class="text-gray-500">已籌 {{ formatCurrency(project.fundingCurrent || 0) }}</span>
                            <span class="text-gray-500">目標 {{ formatCurrency(project.fundingTarget || 0) }}</span>
                          </div>
                        </div>
                        
                        <!-- 項目操作按鈕 -->
                        <div class="flex justify-end space-x-2 mt-2">
                          <Button icon="pi pi-eye" class="p-button-rounded p-button-outlined p-button-sm"
                                  @click="navigateToProjectDetail(project.id)" tooltip="查看詳情" tooltipOptions="{ position: 'top' }" />
                          <Button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-button-sm p-button-primary"
                                  @click="navigateToEditProject(project.id)" tooltip="編輯項目" tooltipOptions="{ position: 'top' }" />
                          <Button icon="pi pi-trash" class="p-button-rounded p-button-outlined p-button-sm p-button-danger"
                                  @click="confirmDeleteProject(project)" tooltip="刪除項目" tooltipOptions="{ position: 'top' }" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <!-- 交易與贊助記錄 -->
              <TabPanel header="交易與贊助">
                <div class="p-6 space-y-4">
                  <h3 class="text-xl font-bold mb-6">我的設定</h3>
                  
                  <!-- 個人設置 -->
                  <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h4 class="text-lg font-medium mb-4">個人資料設定</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                        <input 
                          type="text" 
                          v-model="form.name" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                        <input 
                          type="email" 
                          v-model="form.email" 
                          disabled
                          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        >
                      </div>
                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">個人簡介</label>
                        <textarea 
                          v-model="form.bio" 
                          rows="4"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        ></textarea>
                      </div>
                    </div>
                    <div class="mt-6 flex justify-end">
                      <button 
                        @click="handleBasicInfoSubmit" 
                        :disabled="loading"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <i v-if="loading" class="pi pi-spinner animate-spin mr-2"></i>
                        {{ loading ? '保存中...' : '保存設定' }}
                      </button>
                    </div>
                  </div>
                  
                  <!-- 安全設置 -->
                  <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h4 class="text-lg font-medium mb-4">安全設定</h4>
                    <div class="mb-6">
                      <button 
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <i class="pi pi-lock mr-2"></i>
                        修改密碼
                      </button>
                    </div>
                    <div class="border-t border-gray-200 pt-4">
                      <h5 class="text-sm font-medium text-gray-500 mb-2">登入狀態</h5>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-sm text-gray-600">
                            上次登入時間：{{ formatDate(currentUser?.lastLoginAt) }}
                          </p>
                        </div>
                        <button 
                          @click="logout"
                          class="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <i class="pi pi-sign-out mr-1"></i>
                          登出
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 交易與贊助記錄 -->
                  <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h4 class="text-lg font-medium mb-4">交易與贊助</h4>
                    <div class="space-y-3">
                      <NuxtLink 
                        to="/profile/sponsorships" 
                        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                      >
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                            <i class="pi pi-heart-fill"></i>
                          </div>
                          <div>
                            <h5 class="font-medium">贊助記錄</h5>
                            <p class="text-sm text-gray-500">查看您對創意的所有贊助</p>
                          </div>
                        </div>
                        <i class="pi pi-chevron-right text-gray-400"></i>
                      </NuxtLink>
                      
                      <NuxtLink 
                        to="/profile/payments" 
                        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                      >
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <i class="pi pi-wallet"></i>
                          </div>
                          <div>
                            <h5 class="font-medium">支付管理</h5>
                            <p class="text-sm text-gray-500">管理您的支付方式和交易記錄</p>
                          </div>
                        </div>
                        <i class="pi pi-chevron-right text-gray-400"></i>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength, sameAs, helpers } from '@vuelidate/validators'
import { useUserStore } from '~/stores/user'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { useConfirm } from 'primevue/useconfirm'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
const toast = useToast()
const loading = ref(false)
const router = useRouter()

// 頁面載入動畫
onMounted(() => {
  document.querySelector('.min-h-screen').classList.add('fade-in')
  loadProjects()
})

// 表單數據
const form = reactive({
  name: currentUser.value?.name || '',
  email: currentUser.value?.email || '',
  bio: currentUser.value?.bio || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  avatarPreview: '',
  avatar: null
})

// 角色標籤
const roleLabels = {
  visitor: '訪客',
  ideator: '創意者',
  engineer: '工程師',
  vendor: '廠商',
  admin: '管理員'
}

// 密碼規則
const passwordRules = computed(() => ({
  length: {
    valid: form.newPassword.length >= 8,
    message: '至少8個字符'
  },
  uppercase: {
    valid: /[A-Z]/.test(form.newPassword),
    message: '包含大寫字母'
  },
  lowercase: {
    valid: /[a-z]/.test(form.newPassword),
    message: '包含小寫字母'
  },
  number: {
    valid: /[0-9]/.test(form.newPassword),
    message: '包含數字'
  }
}))

// 表單驗證規則
const rules = {
  name: { 
    required: helpers.withMessage('請輸入用戶名', required),
    minLength: helpers.withMessage('用戶名至少需要2個字符', minLength(2)),
    maxLength: helpers.withMessage('用戶名不能超過20個字符', maxLength(20))
  },
  email: { 
    required: helpers.withMessage('請輸入電子郵件', required),
    email: helpers.withMessage('請輸入有效的電子郵件地址', email)
  },
  bio: { 
    maxLength: helpers.withMessage('自我介紹不能超過500個字符', maxLength(500))
  },
  currentPassword: { 
    required: helpers.withMessage('請輸入當前密碼', required)
  },
  newPassword: {
    required: helpers.withMessage('請輸入新密碼', required),
    minLength: helpers.withMessage('密碼至少需要8個字符', minLength(8)),
    containsUppercase: helpers.withMessage('密碼必須包含大寫字母', helpers.regex(/[A-Z]/)),
    containsLowercase: helpers.withMessage('密碼必須包含小寫字母', helpers.regex(/[a-z]/)),
    containsNumber: helpers.withMessage('密碼必須包含數字', helpers.regex(/[0-9]/))
  },
  confirmPassword: { 
    required: helpers.withMessage('請確認新密碼', required),
    sameAsPassword: helpers.withMessage('兩次輸入的密碼不一致', sameAs(computed(() => form.newPassword)))
  }
}

const v$ = useVuelidate(rules, form)

// 檢查基本信息是否有變更
const isBasicInfoChanged = computed(() => {
  return form.name !== currentUser.value?.name ||
         form.bio !== currentUser.value?.bio ||
         form.avatar !== null
})

// 檢查密碼表單是否有效
const isPasswordFormValid = computed(() => {
  return form.currentPassword &&
         form.newPassword &&
         form.confirmPassword &&
         Object.values(passwordRules.value).every(rule => rule.valid) &&
         form.newPassword === form.confirmPassword
})

// 處理頭像選擇
const onAvatarSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.add({
        severity: 'error',
        summary: '上傳失敗',
        detail: '請選擇圖片文件',
        life: 3000
      })
      return
    }
    
    if (file.size > 5000000) {
      toast.add({
        severity: 'error',
        summary: '上傳失敗',
        detail: '圖片大小不能超過 5MB',
        life: 3000
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      form.avatarPreview = e.target.result
    }
    reader.readAsDataURL(file)
    form.avatar = file
  }
}

// 提交基本信息
const handleBasicInfoSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  loading.value = true
  try {
    // 創建 FormData 對象來處理文件上傳
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('bio', form.bio)
    if (form.avatar) {
      formData.append('avatar', form.avatar)
    }

    // TODO: 調用更新用戶信息的 API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 更新成功動畫
    document.querySelector('.form-group').classList.add('success-animation')
    setTimeout(() => {
      document.querySelector('.form-group').classList.remove('success-animation')
    }, 1000)

    toast.add({
      severity: 'success',
      summary: '更新成功',
      detail: '個人資料已更新',
      life: 3000
    })
  } catch (error) {
    console.error('更新個人資料失敗:', error)
    toast.add({
      severity: 'error',
      summary: '更新失敗',
      detail: error.message || '無法更新個人資料',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// 提交密碼修改
const handlePasswordSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  loading.value = true
  try {
    // TODO: 調用修改密碼的 API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 清空密碼表單
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''

    toast.add({
      severity: 'success',
      summary: '更新成功',
      detail: '密碼已修改',
      life: 3000
    })
  } catch (error) {
    console.error('修改密碼失敗:', error)
    toast.add({
      severity: 'error',
      summary: '更新失敗',
      detail: error.message || '無法修改密碼',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// 密碼強度計算
const passwordStrength = computed(() => {
  const rules = Object.values(passwordRules.value)
  const validCount = rules.filter(rule => rule.valid).length
  
  if (validCount === 0) return 'weak'
  if (validCount <= 2) return 'weak'
  if (validCount === 3) return 'medium'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'weak':
      return '弱'
    case 'medium':
      return '中'
    case 'strong':
      return '強'
    default:
      return ''
  }
})

const passwordStrengthPercent = computed(() => {
  switch (passwordStrength.value) {
    case 'weak':
      return 33
    case 'medium':
      return 66
    case 'strong':
      return 100
    default:
      return 0
  }
})

// 通知設置
const emailNotificationSettings = reactive({
  newProposal: {
    label: '新提案通知',
    description: '當收到新的工程師提案時通知我',
    value: true
  },
  projectUpdate: {
    label: '項目更新',
    description: '當項目有新的進展時通知我',
    value: true
  },
  comments: {
    label: '評論回覆',
    description: '當有人回覆我的評論時通知我',
    value: true
  }
})

const inAppNotificationSettings = reactive({
  systemNotice: {
    label: '系統公告',
    description: '接收系統維護、更新等重要通知',
    value: true
  },
  activityReminder: {
    label: '活動提醒',
    description: '接收活動開始、截止等提醒',
    value: true
  },
  messageNotification: {
    label: '即時消息',
    description: '接收聊天、評論等即時消息提醒',
    value: true
  }
})

// 通知設置保存狀態
const isNotificationSaving = ref(false)

// 單個設置變更時的保存
const saveNotificationSettings = async () => {
  try {
    isNotificationSaving.value = true
    // TODO: 調用保存通知設置的 API
    await new Promise(resolve => setTimeout(resolve, 300))

    toast.add({
      severity: 'info',
      summary: '設置已更新',
      detail: '通知偏好已保存',
      life: 1500
    })
  } catch (error) {
    console.error('保存通知設置失敗:', error)
    toast.add({
      severity: 'error',
      summary: '保存失敗',
      detail: error.message || '無法保存通知設置',
      life: 3000
    })
  } finally {
    isNotificationSaving.value = false
  }
}

// 保存所有通知設置
const saveAllNotificationSettings = async () => {
  try {
    isNotificationSaving.value = true
    // TODO: 調用保存通知設置的 API
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.add({
      severity: 'success',
      summary: '設置已保存',
      detail: '所有通知設置更新成功',
      life: 3000
    })
  } catch (error) {
    console.error('保存通知設置失敗:', error)
    toast.add({
      severity: 'error',
      summary: '保存失敗',
      detail: error.message || '無法保存通知設置',
      life: 3000
    })
  } finally {
    isNotificationSaving.value = false
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未知'
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 項目管理
const projectFilter = ref('all')
const projectSearchQuery = ref('')
const projectSortOption = ref({ label: '最新創建', value: 'newest' })
const projectSortOptions = [
  { label: '最新創建', value: 'newest' },
  { label: '最早創建', value: 'oldest' },
  { label: '提案數量', value: 'proposals' },
  { label: '評論數量', value: 'comments' }
]
const isLoadingProjects = ref(false)
const projectsError = ref(null)
const myProjects = ref([])

// 項目狀態文字對照
const projectStatusText = {
  idea: '創意階段',
  in_progress: '進行中',
  fundraising: '募資中',
  completed: '已完成'
}

// 過濾並排序項目
const filteredProjects = computed(() => {
  let result = [...myProjects.value]
  
  // 按狀態過濾
  if (projectFilter.value !== 'all') {
    result = result.filter(project => project.status === projectFilter.value)
  }
  
  // 按搜索詞過濾
  if (projectSearchQuery.value) {
    const query = projectSearchQuery.value.toLowerCase()
    result = result.filter(project => 
      project.name.toLowerCase().includes(query) || 
      project.shortDescription.toLowerCase().includes(query)
    )
  }
  
  // 排序
  result.sort((a, b) => {
    switch (projectSortOption.value.value) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'proposals':
        return (b.proposals || 0) - (a.proposals || 0)
      case 'comments':
        return (b.comments || 0) - (a.comments || 0)
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })
  
  return result
})

// 載入項目數據
const loadProjects = async () => {
  isLoadingProjects.value = true
  projectsError.value = null
  
  try {
    // TODO: 這裡應該發送API請求獲取用戶的項目列表
    // 使用模擬數據作為示例
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    myProjects.value = [
      {
        id: 1,
        name: '智能音箱設計創新',
        shortDescription: '一款融合獨特設計與先進語音技術的智能音箱，提供更自然的交互體驗。',
        status: 'idea',
        createdAt: '2023-05-15',
        comments: 7,
        proposals: 4,
        image: '/default-product-image.png'
      },
      {
        id: 2,
        name: '可持續時尚手錶項目',
        shortDescription: '使用環保材料製作的智能手錶，具有時尚外觀和多種健康監測功能。',
        status: 'in_progress',
        createdAt: '2023-06-20',
        comments: 12,
        proposals: 6,
        progress: 65,
        image: '/default-product-image.png'
      },
      {
        id: 3,
        name: '創新太陽能充電背包',
        shortDescription: '集成太陽能面板的都市背包，可為移動設備提供清潔能源充電。',
        status: 'fundraising',
        createdAt: '2023-07-10',
        comments: 21,
        proposals: 9,
        fundingProgress: 78,
        fundingCurrent: 39000,
        fundingTarget: 50000,
        image: '/default-product-image.png'
      },
      {
        id: 4,
        name: '模塊化智能家居系統',
        shortDescription: '一套可自由組合的智能家居模塊，讓用戶能夠根據需求自定義智能家居體驗。',
        status: 'completed',
        createdAt: '2023-04-05',
        comments: 30,
        proposals: 12,
        image: '/default-product-image.png'
      }
    ]
  } catch (error) {
    console.error('載入項目失敗:', error)
    projectsError.value = error
  } finally {
    isLoadingProjects.value = false
  }
}

// 確認刪除項目
const confirmDeleteProject = (project) => {
  // 使用PrimeVue的confirm對話框
  const confirmService = useConfirm()
  confirmService.require({
    message: `確定要刪除「${project.name}」嗎？`,
    header: '刪除確認',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '確定刪除',
    rejectLabel: '取消',
    accept: () => deleteProject(project.id)
  })
}

// 刪除項目
const deleteProject = async (projectId) => {
  try {
    // TODO: 發送API請求刪除項目
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 從列表中移除項目
    myProjects.value = myProjects.value.filter(p => p.id !== projectId)
    
    toast.add({
      severity: 'success',
      summary: '刪除成功',
      detail: '項目已成功刪除',
      life: 3000
    })
  } catch (error) {
    console.error('刪除項目失敗:', error)
    toast.add({
      severity: 'error',
      summary: '刪除失敗',
      detail: error.message || '無法刪除項目',
      life: 3000
    })
  }
}

// 導航到項目詳情頁
const navigateToProjectDetail = (projectId) => {
  router.push(`/products/${projectId}`)
}

// 導航到項目編輯頁
const navigateToEditProject = (projectId) => {
  router.push(`/products/${projectId}/edit`)
}

// 導航到創建項目頁
const navigateToCreateProject = () => {
  router.push('/products/create')
}

// 格式化貨幣
const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(value)
}

// 登出
const logout = () => {
  // TODO: 實現登出邏輯
  console.log('登出')
}
</script>

<style scoped>
.form-group {
  @apply space-y-1;
}

/* 標籤頁樣式 */
:deep(.p-tabview) {
  @apply border-none;
}

:deep(.p-tabview-nav) {
  @apply border-b border-gray-200 px-6 pt-4;
}

:deep(.p-tabview-nav li) {
  @apply mr-4;
}

:deep(.p-tabview-nav li .p-tabview-nav-link) {
  @apply text-gray-500 hover:text-gray-700 rounded-t-lg px-5 py-3 transition-all duration-200;
}

:deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  @apply text-primary-600 border-primary-600 font-semibold;
}

:deep(.p-tabview-panels) {
  @apply pt-0 px-0;
}

/* 密碼輸入框樣式 */
:deep(.p-password) {
  @apply w-full;
}

:deep(.p-password-input) {
  @apply w-full;
}

/* 開關樣式 */
:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  @apply bg-primary-600;
}

:deep(.p-inputswitch:not(.p-disabled):hover .p-inputswitch-slider) {
  @apply bg-gray-300;
}

:deep(.p-inputswitch.p-inputswitch-checked:not(.p-disabled):hover .p-inputswitch-slider) {
  @apply bg-primary-500;
}

/* 輸入框聚焦效果 */
:deep(.p-inputtext:enabled:focus) {
  @apply border-primary-500 shadow-none ring-2 ring-primary-200;
}

/* 按鈕與表單元素過渡效果 */
:deep(.p-button), 
:deep(.p-inputtext), 
:deep(.p-inputtextarea),
:deep(.p-password) {
  @apply transition-all duration-200;
}

:deep(.p-button:enabled:hover) {
  @apply transform scale-105 shadow-lg;
}

/* 淡入動畫 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* 成功動畫 */
@keyframes successPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.success-animation {
  animation: successPulse 1s;
}
</style> 