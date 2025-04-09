import { Ref } from 'vue'

interface User {
  id: string
  email: string
  name: string
  role: string
  twoFactorEnabled: boolean
}

export const useUser = () => {
  return useState<User | null>('user', () => null)
}

 