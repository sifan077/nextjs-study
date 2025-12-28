/**
 * Updating Data 首页
 *
 * 介绍 Server Actions 的核心概念
 */
export default function UpdatePage() {
  return (
    <div>
      <h1>Updating Data（数据更新）</h1>

      {/* 核心概念 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>核心概念</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>概念</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <strong>Server Function</strong>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                在服务器上执行的异步函数，客户端通过网络请求调用
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <strong>Server Action</strong>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                用于数据变更场景的 Server Function（本质相同，叫法不同）
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 对比 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>传统方式 vs Server Action</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`// 传统方式：需要手动写 API
前端 → fetch('/api/posts') → API Route → 数据库

// Server Action：省去 API 层
前端 → createPost() → 数据库`}
        </pre>
      </section>

      {/* 使用方式 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>两种调用方式</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#c8e6c9',
              borderRadius: '8px',
            }}
          >
            <h3>1. Form Action</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>自动获取 FormData</li>
              <li>支持渐进增强（无 JS 也能用）</li>
              <li>Server & Client 都能用</li>
            </ul>
          </div>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#c8e6c9',
              borderRadius: '8px',
            }}
          >
            <h3>2. Event Handler</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>可以获取返回值</li>
              <li>需要 JavaScript</li>
              <li>只能在 Client Component 用</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 代码示例 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>代码示例</h2>
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
          {`// 1. 定义 Server Action（actions.ts）
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // 写入数据库...
  revalidatePath('/posts')  // 清除缓存
}

// 2. Form 方式调用
<form action={createPost}>
  <input name="title" />
  <button type="submit">提交</button>
</form>

// 3. Event Handler 方式调用
<button onClick={async () => {
  const result = await incrementLike()
  setLikes(result)
}}>
  点赞
</button>`}
        </pre>
      </section>

      {/* 示例链接 */}
      <section>
        <h2>示例页面</h2>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>/update/form</strong> - Form 表单提交（创建、删除文章）
          </li>
          <li>
            <strong>/update/event</strong> - Event Handler（点赞功能）
          </li>
          <li>
            <strong>/update/pending</strong> - useActionState 显示加载状态
          </li>
          <li>
            <strong>/update/revalidate</strong> - 缓存重验证、重定向、Cookies
          </li>
        </ul>
      </section>
    </div>
  )
}
