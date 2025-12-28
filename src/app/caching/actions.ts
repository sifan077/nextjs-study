'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Caching 示例的 Server Actions
 */

// ============ revalidateTag 示例 ============

/**
 * 清除 'posts' 标签的缓存
 * Next.js 16: revalidateTag 需要第二个参数 profile
 */
export async function revalidatePostsTag(): Promise<void> {
  console.log('🔄 revalidateTag("posts") 触发')
  revalidateTag('posts', {})
}

/**
 * 清除 'products' 标签的缓存
 */
export async function revalidateProductsTag(): Promise<void> {
  console.log('🔄 revalidateTag("products") 触发')
  revalidateTag('products', {})
}

// ============ revalidatePath 示例 ============

/**
 * 清除 /caching/fetch 路径的缓存
 */
export async function revalidateFetchPath(): Promise<void> {
  console.log('🔄 revalidatePath("/caching/fetch") 触发')
  revalidatePath('/caching/fetch')
}

/**
 * 清除 /caching/use-cache 路径的缓存
 */
export async function revalidateUseCachePath(): Promise<void> {
  console.log('🔄 revalidatePath("/caching/use-cache") 触发')
  revalidatePath('/caching/use-cache')
}
