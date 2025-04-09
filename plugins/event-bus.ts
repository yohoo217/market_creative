import { defineNuxtPlugin } from '#app'

// 定義擴展的全局窗口接口
declare global {
  interface Window {
    $eventBus: EventBus;
  }
}

// 簡單的事件匯流排實現
class EventBus {
  private events: Record<string, Function[]> = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args));
    }
  }

  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  console.log('Event bus plugin initialized');
  
  // 創建事件匯流排實例
  const eventBus = new EventBus();

  // 添加到全局屬性
  nuxtApp.vueApp.config.globalProperties.$eventBus = eventBus;
  
  // 添加到全局窗口對象 (客戶端)
  if (process.client) {
    window.$eventBus = eventBus;
  }
  
  return {
    provide: {
      eventBus
    }
  }
}) 