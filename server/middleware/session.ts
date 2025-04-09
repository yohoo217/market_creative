import { H3Event } from 'h3'

export default defineEventHandler((event: H3Event) => {
  const config = useRuntimeConfig()
  
  // 設置 session 配置
  event.context.session = {
    name: 'session',
    password: config.sessionSecret,
    maxAge: 60 * 60 * 24 * 7, // 7 天
    sameSite: true,
    secure: process.env.NODE_ENV === 'production'
  }
}) 