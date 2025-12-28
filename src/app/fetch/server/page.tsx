import { cache } from 'react'
import { Suspense } from 'react'
import { connection } from 'next/server'

/**
 * Server Component 获取数据示例
 *
 * 演示：
 * 1. 直接 async/await 获取数据
 * 2. fetch API 调用外部接口
 * 3. React cache 实现请求去重
 */

// 模拟数据库查询（用 cache 包装实现去重）
const getUsers = cache(async () => {
  console.log('🔍 getUsers 被调用（只会打印一次）')
  // 模拟数据库延迟
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
  ]
})

// 模拟获取统计数据（也调用 getUsers，会复用缓存）
const getUserStats = cache(async () => {
  const users = await getUsers() // 这里会复用上面的缓存
  return {
    total: users.length,
    timestamp: new Date().toISOString(),
  }
})

// 用户列表组件
async function UserList() {
  const users = await getUsers()

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
      }}
    >
      <h3>用户列表</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 统计组件（也使用 getUsers，但会复用缓存）
async function UserStats() {
  const stats = await getUserStats()
  const users = await getUsers() // 再次调用，仍然复用缓存

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
      }}
    >
      <h3>统计信息</h3>
      <p>用户总数：{stats.total}</p>
      <p>查询时间：{stats.timestamp}</p>
      <p>
        <small>（UserList 和 UserStats 都调用了 getUsers，但只查询一次）</small>
      </p>
    </div>
  )
}

// Loading 骨架屏组件
function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}
    >
      <p>⏳ {text}</p>
      <div
        style={{
          height: '40px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          animation: 'pulse 1.5s infinite',
        }}
      />
    </div>
  )
}

// 外部 API 获取示例 - 带缓存
async function CachedApiDemo() {
  // connection() 告诉 Next.js：等请求来了再执行后面的代码
  await connection()

  // force-cache: 缓存结果，下次请求直接返回缓存
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3', {
    cache: 'force-cache',
  })
  const posts = await res.json()

  // 现在可以安全使用 new Date()
  const fetchTime = new Date().toISOString()

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
      }}
    >
      <h3>缓存 API（force-cache）</h3>
      <ul>
        {posts.map((post: { id: number; title: string }) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <p>
        <strong>获取时间：{fetchTime}</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>刷新页面，时间戳不变 = 用的是缓存数据</p>
    </div>
  )
}

// 外部 API 获取示例 - 不缓存
async function UncachedApiDemo() {
  // no-store: 每次都重新请求
  const res = await fetch('https://jsonplaceholder.typicode.com/users?_limit=3', {
    cache: 'no-store',
  })
  const users = await res.json()

  // 注意：new Date() 必须在 fetch 之后调用
  const fetchTime = new Date().toISOString()

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
      }}
    >
      <h3>不缓存 API（no-store）</h3>
      <ul>
        {users.map((user: { id: number; name: string }) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <p>
        <strong>获取时间：{fetchTime}</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>刷新页面，时间戳会变 = 每次都重新请求</p>
    </div>
  )
}

export default async function ServerFetchPage() {
  return (
    <div>
      <h1>Server Component 获取数据</h1>

      {/* 说明区域 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>特点</h2>
        <ul>
          <li>直接使用 async/await，代码简洁</li>
          <li>可以安全访问数据库、文件系统、密钥</li>
          <li>代码不会发送到浏览器</li>
          <li>使用 React cache 实现请求去重</li>
        </ul>
      </section>

      {/* 数据展示 - 异步组件必须用 Suspense 包裹 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Suspense fallback={<LoadingSkeleton text="加载用户列表..." />}>
          <UserList />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton text="加载统计信息..." />}>
          <UserStats />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton text="加载缓存 API 数据..." />}>
          <CachedApiDemo />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton text="加载不缓存 API 数据..." />}>
          <UncachedApiDemo />
        </Suspense>
      </section>

      {/* 代码说明 */}
      <section style={{ marginTop: '20px' }}>
        <h2>代码说明</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`// 1. 用 cache 包装函数，实现请求去重
import { cache } from 'react'

const getUsers = cache(async () => {
  // 同一渲染周期内，多次调用只执行一次
  return await db.select().from(users)
})

// 2. 外部 API 获取
const res = await fetch('https://api.example.com/data')
const data = await res.json()

// 3. 缓存控制
await fetch(url, { cache: 'no-store' })  // 不缓存
await fetch(url, { cache: 'force-cache' })  // 强制缓存`}
        </pre>
      </section>
    </div>
  )
}
