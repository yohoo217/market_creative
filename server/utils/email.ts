import nodemailer from 'nodemailer'

// 創建郵件傳輸器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"創意市集" <noreply@example.com>',
      to,
      subject,
      html
    })

    console.log('郵件發送成功:', info.messageId)
    return info
  } catch (error) {
    console.error('郵件發送失敗:', error)
    throw new Error('郵件發送失敗')
  }
} 