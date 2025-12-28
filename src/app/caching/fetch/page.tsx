import { Suspense } from 'react'
import { connection } from 'next/server'
import { revalidatePostsTag, revalidateFetchPath } from '../actions'

/**
 * fetch 缓存控制示例
 *
 * 演示：
 * 1. cache: 'force-cache' - 强制缓存
 * 2. cache: 'no-store' - 不缓存
 * 3. next.revalidate - 定时重验证
 * 4. next.tags - 打标签，支持按需刷新
 */

// 强制缓存示例
async function ForceCacheDemo() {
  await connection() // 确保动态渲染

  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=2', {
    cache: 'force-cache',
  })
  const posts = await res.json()
  const fetchTime = new Date().toISOString()

  return (
    <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
      <h3>force-cache（强制缓存）</h3>
      <ul>
        {posts.map((post: { id: number; title: string }) => (
          <li key={post.id}>{post.title.substring(0, 30)}...</li>
        ))}
      </ul>
      <p>
        <strong>获取时间：{fetchTime}</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>刷新页面，时间戳不变 = 使用缓存</p>
    </div>
  )
}

// 不缓存示例
async function NoStoreDemo() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users?_limit=2', {
    cache: 'no-store',
  })
  const users = await res.json()
  const fetchTime = new Date().toISOString()

  return (
    <div style={{ padding: '15px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
      <h3>no-store（不缓存）</h3>
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

// 定时重验证示例
async function RevalidateDemo() {
  await connection()

  const res = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=2', {
    next: { revalidate: 60 }, // 60秒后重验证
  })
  const comments = await res.json()
  const fetchTime = new Date().toISOString()

  return (
    <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
      <h3>revalidate: 60（60秒后重验证）</h3>
      <ul>
        {comments.map((comment: { id: number; name: string }) => (
          <li key={comment.id}>{comment.name.substring(0, 30)}...</li>
        ))}
      </ul>
      <p>
        <strong>获取时间：{fetchTime}</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>60秒内刷新使用缓存，60秒后会重新验证</p>
    </div>
  )
}

// 打标签示例
async function TagsDemo() {
  await connection()

  const res = await fetch('https://jsonplaceholder.typicode.com/albums?_limit=2', {
    cache: 'force-cache',
    next: { tags: ['posts'] }, // 打上 'posts' 标签
  })
  const albums = await res.json()
  const fetchTime = new Date().toISOString()

  return (
    <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
      <h3>tags: [&apos;posts&apos;]（打标签）</h3>
      <ul>
        {albums.map((album: { id: number; title: string }) => (
          <li key={album.id}>{album.title.substring(0, 30)}...</li>
        ))}
      </ul>
      <p>
        <strong>获取时间：{fetchTime}</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        点击下方按钮调用 revalidateTag(&apos;posts&apos;) 清除缓存
      </p>
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

export default function FetchCachingPage() {
  return (
    <div>
      <h1>fetch 缓存控制</h1>

      {/* 说明 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>fetch 缓存选项</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>选项</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>效果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>cache: &apos;force-cache&apos;</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>强制缓存结果</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>cache: &apos;no-store&apos;</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>不缓存，每次都请求</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>next: &#123; revalidate: N &#125;</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>N 秒后重新验证</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>next: &#123; tags: [...] &#125;</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                打标签，支持 revalidateTag 按需刷新
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 演示区域 */}
      <section
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}
      >
        <Suspense fallback={<LoadingSkeleton text="加载 force-cache 示例..." />}>
          <ForceCacheDemo />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton text="加载 no-store 示例..." />}>
          <NoStoreDemo />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton text="加载 revalidate 示例..." />}>
          <RevalidateDemo />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton text="加载 tags 示例..." />}>
          <TagsDemo />
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
        <h2>手动清除缓存</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <form action={revalidatePostsTag}>
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
              revalidateTag(&apos;posts&apos;)
            </button>
          </form>
          <form action={revalidateFetchPath}>
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
              revalidatePath(&apos;/caching/fetch&apos;)
            </button>
          </form>
        </div>
        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          点击后刷新页面，查看时间戳变化
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
          {`// 1. 强制缓存
await fetch(url, { cache: 'force-cache' })

// 2. 不缓存
await fetch(url, { cache: 'no-store' })

// 3. 定时重验证（60秒）
await fetch(url, { next: { revalidate: 60 } })

// 4. 打标签
await fetch(url, {
  cache: 'force-cache',
  next: { tags: ['posts'] }
})

// 5. 按标签清除缓存
import { revalidateTag } from 'next/cache'
revalidateTag('posts')`}
        </pre>
      </section>
    </div>
  )
}
