import { Suspense } from 'react'
import { cacheTag } from 'next/cache'
import { revalidateProductsTag, revalidateUseCachePath } from '../actions'

/**
 * use cache 示例
 *
 * 演示：
 * 1. 'use cache' 指令缓存函数结果
 * 2. cacheTag() 打标签
 * 3. revalidateTag() 按标签清除缓存
 *
 * 注意：需要在 next.config.ts 中启用 cacheComponents: true
 */

// 模拟数据库查询 - 使用 'use cache' 缓存
async function getProducts() {
  'use cache'
  cacheTag('products')

  // 模拟数据库延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  const products = [
    { id: 1, name: 'iPhone 15', price: 7999 },
    { id: 2, name: 'MacBook Pro', price: 14999 },
    { id: 3, name: 'AirPods Pro', price: 1899 },
  ]

  console.log('🔍 getProducts() 被调用（有缓存时不会打印）')

  return {
    products,
    fetchedAt: new Date().toISOString(),
  }
}

// 模拟统计查询 - 使用 'use cache' 缓存
async function getStats() {
  'use cache'
  cacheTag('products') // 同一个标签，revalidateTag 会一起清除

  await new Promise((resolve) => setTimeout(resolve, 300))

  console.log('📊 getStats() 被调用（有缓存时不会打印）')

  return {
    totalProducts: 3,
    totalValue: 24897,
    calculatedAt: new Date().toISOString(),
  }
}

// 产品列表组件
async function ProductList() {
  const { products, fetchedAt } = await getProducts()

  return (
    <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
      <h3>产品列表（use cache + cacheTag）</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ¥{p.price}
          </li>
        ))}
      </ul>
      <p>
        <strong>查询时间：{fetchedAt}</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>刷新页面，时间戳不变 = 使用缓存</p>
    </div>
  )
}

// 统计组件
async function StatsDisplay() {
  const stats = await getStats()

  return (
    <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
      <h3>统计信息（同一个 cacheTag）</h3>
      <p>产品总数：{stats.totalProducts}</p>
      <p>总价值：¥{stats.totalValue}</p>
      <p>
        <strong>计算时间：{stats.calculatedAt}</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>与产品列表使用同一个 tag，会一起被清除</p>
    </div>
  )
}

function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <p>{text}</p>
    </div>
  )
}

export default function UseCachePage() {
  return (
    <div>
      <h1>use cache 缓存</h1>

      {/* 说明 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>use cache vs fetch 缓存</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>特性</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                fetch 缓存
              </th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                use cache
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>适用范围</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>HTTP 请求</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                任意操作（数据库、计算、文件）
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>打标签</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                next: &#123; tags: [] &#125;
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>cacheTag()</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>缓存键</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>URL</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>函数参数自动成为键</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 演示区域 */}
      <section
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}
      >
        <Suspense fallback={<LoadingSkeleton text="加载产品列表..." />}>
          <ProductList />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton text="加载统计信息..." />}>
          <StatsDisplay />
        </Suspense>
      </section>

      {/* 操作按钮 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#fce4ec',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>清除缓存</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <form action={revalidateProductsTag}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#e91e63',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              revalidateTag(&apos;products&apos;)
            </button>
          </form>
          <form action={revalidateUseCachePath}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              revalidatePath(&apos;/caching/use-cache&apos;)
            </button>
          </form>
        </div>
        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          点击 revalidateTag 会同时清除产品列表和统计信息的缓存（因为用了同一个 tag）
        </p>
      </section>

      {/* 代码示例 */}
      <section>
        <h2>代码示例</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '13px',
          }}
        >
          {`import { cacheTag } from 'next/cache'

// 1. 定义缓存函数
async function getProducts() {
  'use cache'              // 启用缓存
  cacheTag('products')     // 打标签

  // 数据库查询、计算等
  const products = await db.query('SELECT * FROM products')
  return products
}

// 2. 在 Server Action 中清除缓存
'use server'
import { revalidateTag } from 'next/cache'

export async function updateProduct() {
  await db.update(...)
  revalidateTag('products')  // 清除所有 'products' 标签的缓存
}`}
        </pre>
      </section>

      {/* Java 对比 */}
      <section style={{ marginTop: '20px' }}>
        <h2>对比 Java Spring</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#ffcc80',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '13px',
          }}
        >
          {`// Next.js
async function getProducts() {
  'use cache'
  cacheTag('products')
  return db.query(...)
}
revalidateTag('products')

// Java Spring
@Cacheable(cacheNames = "products")
public List<Product> getProducts() { ... }

@CacheEvict(cacheNames = "products")
public void updateProduct() { ... }`}
        </pre>
      </section>
    </div>
  )
}
