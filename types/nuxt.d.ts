declare module '#app' {
  interface NuxtApp {
    $toast: {
      success: (message: string) => void
      error: (message: string) => void
      info: (message: string) => void
      warning: (message: string) => void
    }
  }
} 