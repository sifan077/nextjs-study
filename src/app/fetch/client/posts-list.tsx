'use client'

import { use } from 'react'

/**
 * Client Component - 使用 use hook 解包 Promise
 *
 * 这个组件接收一个 Promise 作为 props，
 * 使用 React 19 的 use hook 来"等待"并解包数据
 */

type Post = {
  id: number
  title: string
  date: string
  author: string
}

export default function PostsList({ posts }: { posts: Promise<Post[]> }) {
  // use() 会"暂停"组件渲染，直到 Promise resolve
  // 配合外层的 Suspense，会显示 fallback
  const allPosts = use(posts)

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
      }}
    >
      <h3>文章列表（use hook 解包）</h3>
      <ul>
        {allPosts.map((post) => (
          <li key={post.id} style={{ marginBottom: '10px' }}>
            <strong>{post.title}</strong>
            <br />
            <small>
              {post.author} · {post.date}
            </small>
          </li>
        ))}
      </ul>
      <p style={{ color: '#666', fontSize: '14px' }}>
        这是 Client Component，数据通过 use(promise) 从 Server 传递过来
      </p>
    </div>
  )
}
