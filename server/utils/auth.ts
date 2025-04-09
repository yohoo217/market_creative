import { H3Event } from 'h3'

interface UserSession {
  id: string
  email: string
  role: string
}

export async function setUserSession(event: H3Event, user: UserSession) {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret
  })
  
  await session.update({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  return session
}

export async function getUserSession(event: H3Event) {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret
  })
  return session.data
}

export async function clearUserSession(event: H3Event) {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret
  })
  await session.clear()
} 