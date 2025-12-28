'use client'

import { useState, useEffect } from 'react'
import { incrementLike, decrementLike, getLikes } from '../actions'

/**
 * Event Handler 调用 Server Action 示例
 *
 * 演示：
 * 1. onClick 事件调用 Server Action
 * 2. 获取返回值更新本地状态
 * 3. 手动管理 loading 状态
 */
export default function EventPage() {
  const [likes, setLikes] = useState(0)
  const [loading, setLoading] = useState(false)

  // 初始加载点赞数
  useEffect(() => {
    getLikes().then(setLikes)
  }, [])

  // 点赞
  const handleLike = async () => {
    setLoading(true)
    try {
      const newLikes = await incrementLike()
      setLikes(newLikes)
    } finally {
      setLoading(false)
    }
  }

  // 取消点赞
  const handleUnlike = async () => {
    setLoading(true)
    try {
      const newLikes = await decrementLike()
      setLikes(newLikes)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Event Handler 调用</h1>

      {/* 说明 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>特点</h2>
        <ul>
          <li>在 onClick 等事件中调用 Server Action</li>
          <li>可以获取返回值（Form action 不常用返回值）</li>
          <li>需要手动管理 loading 状态</li>
          <li>必须是 Client Component（&apos;use client&apos;）</li>
          <li>需要 JavaScript 才能工作</li>
        </ul>
      </section>

      {/* 点赞演示 */}
      <section
        style={{
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <h2>点赞演示</h2>
        <p style={{ fontSize: '48px', margin: '20px 0' }}>{loading ? '...' : likes}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={handleUnlike}
            disabled={loading || likes === 0}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: loading ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            -1
          </button>
          <button
            onClick={handleLike}
            disabled={loading}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: loading ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            +1
          </button>
        </div>
        <p style={{ marginTop: '15px', color: '#666' }}>
          {loading ? '处理中...' : '点击按钮更新点赞数（模拟 500ms 延迟）'}
        </p>
      </section>

      {/* 与 Form 对比 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>Form vs Event Handler</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#bbdefb' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>特性</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                Form action
              </th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                Event Handler
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>自动获取 FormData</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>✅</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>❌ 需要手动传参</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>获取返回值</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>不常用</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>✅ 常用</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>渐进增强</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>✅ 无 JS 也能用</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>❌ 需要 JS</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>使用场景</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>表单提交</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>点赞、收藏等交互</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 代码说明 */}
      <section>
        <h2>代码说明</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px',
          }}
        >
          {`// actions.ts
'use server'

export async function incrementLike() {
  likes++
  return likes  // 返回新值给客户端
}

// page.tsx (Client Component)
'use client'

export default function LikeButton() {
  const [likes, setLikes] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    setLoading(true)
    try {
      const newLikes = await incrementLike()  // 调用 Server Action
      setLikes(newLikes)  // 用返回值更新状态
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleLike} disabled={loading}>
      {loading ? '...' : likes}
    </button>
  )
}`}
        </pre>
      </section>
    </div>
  )
}
