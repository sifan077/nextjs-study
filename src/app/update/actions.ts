'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

/**
 * Server Actions 定义文件
 *
 * 文件顶部使用 'use server'，所有导出的函数都是 Server Action
 */

// 模拟内存数据库
let posts: { id: number; title: string; content: string; createdAt: string }[] = [
  { id: 1, title: '第一篇文章', content: '这是第一篇文章的内容', createdAt: '2024-01-01' },
  { id: 2, title: '第二篇文章', content: '这是第二篇文章的内容', createdAt: '2024-01-02' },
]

let likes = 10

// ============ 基础 Form Action ============

/**
 * 创建文章 - Form action 示例
 * 自动接收 FormData
 */
export async function createPost(formData: FormData): Promise<void> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    console.log('❌ 标题和内容不能为空')
    return
  }

  // 模拟写入数据库
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    createdAt: new Date().toISOString().split('T')[0],
  }
  posts.push(newPost)

  console.log('✅ 文章已创建:', newPost)

  // 重新验证缓存
  revalidatePath('/update/form')
}

/**
 * 删除文章
 */
export async function deletePost(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const id = Number(formData.get('id'))
  posts = posts.filter((p) => p.id !== id)

  console.log('🗑️ 文章已删除:', id)

  revalidatePath('/update/form')
}

/**
 * 获取所有文章（非 action，用于读取数据）
 */
export async function getPosts() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...posts]
}

// ============ Event Handler Action ============

/**
 * 点赞 - Event Handler 调用示例
 * 可以返回值给客户端
 */
export async function incrementLike() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  likes++
  console.log('👍 点赞成功，当前点赞数:', likes)

  return likes
}

/**
 * 取消点赞
 */
export async function decrementLike() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (likes > 0) likes--
  console.log('👎 取消点赞，当前点赞数:', likes)

  return likes
}

/**
 * 获取当前点赞数
 */
export async function getLikes() {
  return likes
}

// ============ Pending State Action ============

/**
 * 模拟慢速提交 - 用于演示 pending 状态
 */
export async function slowSubmit(formData: FormData) {
  const delay = Number(formData.get('delay')) || 2000

  console.log(`⏳ 开始处理，延迟 ${delay}ms...`)
  await new Promise((resolve) => setTimeout(resolve, delay))

  const message = formData.get('message') as string
  console.log('✅ 处理完成:', message)

  return {
    success: true,
    message: `消息 "${message}" 已处理`,
    timestamp: new Date().toISOString(),
  }
}

// ============ Revalidate 示例 ============

// 模拟带缓存的数据
let cachedData = {
  value: Math.random().toString(36).substring(7),
  updatedAt: new Date().toISOString(),
}

/**
 * 获取缓存数据
 */
export async function getCachedData() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return cachedData
}

/**
 * 更新数据并重新验证路径
 */
export async function updateDataWithRevalidatePath(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  cachedData = {
    value: Math.random().toString(36).substring(7),
    updatedAt: new Date().toISOString(),
  }

  console.log('🔄 数据已更新，revalidatePath 触发')

  // 按路径清除缓存
  revalidatePath('/update/revalidate')
}

/**
 * 更新数据并重定向
 */
export async function updateAndRedirect(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  cachedData = {
    value: Math.random().toString(36).substring(7),
    updatedAt: new Date().toISOString(),
  }

  console.log('🔄 数据已更新，即将重定向')

  // 注意：revalidatePath 必须在 redirect 之前！
  revalidatePath('/update/revalidate')
  redirect('/update/revalidate')
}

// ============ Cookies 示例 ============

/**
 * 设置 Cookie
 */
export async function setThemeCookie(formData: FormData) {
  const theme = formData.get('theme') as string
  const cookieStore = await cookies()

  cookieStore.set('theme', theme, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7天
  })

  console.log('🍪 Cookie 已设置:', theme)

  revalidatePath('/update/revalidate')
}

/**
 * 获取 Cookie
 */
export async function getThemeCookie() {
  const cookieStore = await cookies()
  return cookieStore.get('theme')?.value || 'light'
}

/**
 * 删除 Cookie
 */
export async function deleteThemeCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('theme')

  console.log('🗑️ Cookie 已删除')

  revalidatePath('/update/revalidate')
}
