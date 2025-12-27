import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

/**
 * use cache 缓存示例
 *
 * 如何验证缓存生效：
 * 1. 运行 npm run build && npm run start（生产模式）
 * 2. 多次刷新页面，观察"获取时间"是否变化
 *    - 有缓存：时间不变（在缓存有效期内）
 *    - 无缓存：每次刷新时间都变
 */

// ============================================
// 有缓存的数据获取（use cache）
// ============================================
async function getCachedTime() {
  'use cache'
  cacheLife('minutes') // 缓存几分钟

  // 模拟 API 请求延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    time: new Date().toLocaleTimeString(),
    timestamp: Date.now(),
    message: '这个时间在缓存有效期内不会变化',
  }
}

// 调用真实 API 并缓存结果
async function getCachedPosts() {
  'use cache'
  cacheLife('minutes')

  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3')
  const posts = await res.json()

  return {
    posts,
    fetchedAt: new Date().toLocaleTimeString(),
  }
}

// ============================================
// 无缓存的数据获取（对比用）
// ============================================
async function getUncachedTime() {
  // 没有 'use cache'，每次请求都会执行
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    time: new Date().toLocaleTimeString(),
    timestamp: Date.now(),
    message: '这个时间每次刷新都会变化',
  }
}

// ============================================
// 展示组件
// ============================================
async function CachedTimeDisplay() {
  const data = await getCachedTime()

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        border: '2px solid #4caf50',
      }}
    >
      <h3>✅ 有缓存 (use cache)</h3>
      <p>
        <strong>获取时间：</strong> {data.time}
      </p>
      <p>
        <strong>时间戳：</strong> {data.timestamp}
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>{data.message}</p>
    </div>
  )
}

async function UncachedTimeDisplay() {
  const data = await getUncachedTime()

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        border: '2px solid #f44336',
      }}
    >
      <h3>❌ 无缓存</h3>
      <p>
        <strong>获取时间：</strong> {data.time}
      </p>
      <p>
        <strong>时间戳：</strong> {data.timestamp}
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>{data.message}</p>
    </div>
  )
}

async function CachedPostsDisplay() {
  const { posts, fetchedAt } = await getCachedPosts()

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        border: '2px solid #2196f3',
      }}
    >
      <h3>📦 缓存的 API 数据</h3>
      <p>
        <strong>获取时间：</strong> {fetchedAt}
        <small>（缓存期内刷新，这个时间不变）</small>
      </p>
      <ul>
        {posts.map((post: { id: number; title: string }) => (
          <li key={post.id}>{post.title.slice(0, 40)}...</li>
        ))}
      </ul>
    </div>
  )
}

function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}
    >
      ⏳ {text}
    </div>
  )
}

export default function UseCachePage() {
  return (
    <div>
      <h1>use cache 缓存效果演示</h1>

      {/* 重要提示 */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #ff9800',
        }}
      >
        <h3>⚠️ 如何验证缓存效果</h3>
        <ol>
          <li>
            <strong>开发模式</strong>下缓存效果不明显
          </li>
          <li>
            运行 <code>npm run build && npm run start</code> 进入生产模式
          </li>
          <li>多次刷新页面，对比下面两个时间：</li>
        </ol>
        <ul>
          <li>
            <span style={{ color: '#4caf50' }}>绿色框</span>：时间不变 = 缓存生效 ✅
          </li>
          <li>
            <span style={{ color: '#f44336' }}>红色框</span>：时间变化 = 无缓存 ❌
          </li>
        </ul>
      </div>

      {/* 对比展示 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <Suspense fallback={<LoadingSkeleton text="加载缓存数据..." />}>
          <CachedTimeDisplay />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton text="加载无缓存数据..." />}>
          <UncachedTimeDisplay />
        </Suspense>
      </div>

      {/* 真实 API 缓存示例 */}
      <section style={{ marginTop: '20px' }}>
        <h2>真实 API 请求缓存</h2>
        <Suspense fallback={<LoadingSkeleton text="从 API 加载数据..." />}>
          <CachedPostsDisplay />
        </Suspense>
      </section>

      {/* 代码说明 */}
      <section
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3>代码对比</h3>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`// ✅ 有缓存：多次调用返回相同结果
async function getCachedTime() {
  'use cache'           // ← 启用缓存
  cacheLife('minutes')  // ← 缓存几分钟

  return {
    time: new Date().toLocaleTimeString(),  // 缓存期内不变
  }
}

// ❌ 无缓存：每次调用都重新执行
async function getUncachedTime() {
  // 没有 'use cache'
  return {
    time: new Date().toLocaleTimeString(),  // 每次都变
  }
}`}
        </pre>
      </section>

      {/* 缓存配置说明 */}
      <section
        style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#e8eaf6',
          borderRadius: '8px',
        }}
      >
        <h3>cacheLife 配置</h3>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`// 预设配置
cacheLife('seconds')  // 几秒
cacheLife('minutes')  // 几分钟
cacheLife('hours')    // 几小时
cacheLife('days')     // 几天
cacheLife('weeks')    // 几周
cacheLife('max')      // 最长时间

// 自定义配置
cacheLife({
  stale: 60,        // 60秒内直接返回缓存
  revalidate: 120,  // 120秒后重新验证
  expire: 3600,     // 1小时后删除缓存
})`}
        </pre>
      </section>
    </div>
  )
}
