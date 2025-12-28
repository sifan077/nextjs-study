import { Suspense } from 'react'
import PostsList from './posts-list'

/**
 * Client Component 获取数据示例
 *
 * 演示：
 * 1. use hook 模式：Server 传 Promise，Client 用 use 解包
 * 2. 配合 Suspense 实现流式传输
 */

// 模拟获取文章数据（在 Server 执行）
async function getPosts() {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return [
    { id: 1, title: 'Next.js 15 新特性', date: '2024-12-01', author: '张三' },
    { id: 2, title: 'React 19 的 use hook', date: '2024-12-05', author: '李四' },
    { id: 3, title: 'Server Components 详解', date: '2024-12-10', author: '王五' },
  ]
}

// Loading 骨架屏
function PostsSkeleton() {
  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
      }}
    >
      <h3>文章列表</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: '40px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              animation: 'pulse 1.5s infinite',
            }}
          />
        ))}
      </div>
      <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>加载中...（1.5 秒）</p>
    </div>
  )
}

export default function ClientFetchPage() {
  // 关键：不 await！直接拿 Promise
  const posts = getPosts()

  return (
    <div>
      <h1>Client Component 获取数据</h1>

      {/* 说明区域 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>use hook 模式</h2>
        <p>这个模式的数据流：</p>
        <ol>
          <li>
            Server Component 调用 <code>getPosts()</code> 但<strong>不 await</strong>
          </li>
          <li>把 Promise 作为 props 传给 Client Component</li>
          <li>
            Client Component 用 <code>use(posts)</code> 解包 Promise
          </li>
          <li>
            配合 <code>&lt;Suspense&gt;</code> 显示 loading 状态
          </li>
        </ol>
      </section>

      {/* 演示区域 */}
      <section style={{ marginBottom: '20px' }}>
        <h2>演示</h2>
        <Suspense fallback={<PostsSkeleton />}>
          <PostsList posts={posts} />
        </Suspense>
      </section>

      {/* 代码说明 */}
      <section>
        <h2>代码结构</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`// page.tsx (Server Component)
export default function Page() {
  const posts = getPosts()  // ⚠️ 不 await，拿到 Promise

  return (
    <Suspense fallback={<Skeleton />}>
      <PostsList posts={posts} />  {/* 传 Promise */}
    </Suspense>
  )
}

// posts-list.tsx (Client Component)
'use client'
import { use } from 'react'

export default function PostsList({ posts }) {
  const allPosts = use(posts)  // 解包 Promise
  return <ul>...</ul>
}

// 优势：
// 1. 服务端不阻塞，立即返回 HTML + fallback
// 2. 数据 ready 后流式替换
// 3. 用户更快看到页面骨架`}
        </pre>
      </section>
    </div>
  )
}
