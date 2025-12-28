import { createPost, deletePost, getPosts } from '../actions'

/**
 * Form 表单提交示例
 *
 * 演示：
 * 1. form action 绑定 Server Action
 * 2. 自动获取 FormData
 * 3. revalidatePath 刷新页面数据
 */
export default async function FormPage() {
  // Server Component 直接获取数据
  const posts = await getPosts()

  return (
    <div>
      <h1>Form 表单提交</h1>

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
          <li>
            <code>&lt;form action=&#123;serverAction&#125;&gt;</code> 直接绑定 Server Action
          </li>
          <li>自动接收 FormData，用 formData.get(&apos;name&apos;) 获取值</li>
          <li>提交后自动调用 revalidatePath 刷新数据</li>
          <li>支持渐进增强：禁用 JS 也能提交（会刷新页面）</li>
        </ul>
      </section>

      {/* 创建表单 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>创建文章</h2>
        <form action={createPost} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label htmlFor="title">标题：</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
              placeholder="请输入标题"
            />
          </div>
          <div>
            <label htmlFor="content">内容：</label>
            <textarea
              id="content"
              name="content"
              required
              rows={3}
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
              placeholder="请输入内容"
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            提交（模拟 1 秒延迟）
          </button>
        </form>
      </section>

      {/* 文章列表 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>文章列表（共 {posts.length} 篇）</h2>
        {posts.length === 0 ? (
          <p style={{ color: '#666' }}>暂无文章，请创建</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {posts.map((post) => (
              <li
                key={post.id}
                style={{
                  padding: '15px',
                  backgroundColor: 'white',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{post.title}</h3>
                  <p style={{ margin: '0 0 5px 0', color: '#666' }}>{post.content}</p>
                  <small style={{ color: '#999' }}>创建于 {post.createdAt}</small>
                </div>
                {/* 删除表单 - 使用 formAction */}
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    删除
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
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

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  // 写入数据库
  await db.post.create({ data: { title, content } })

  // 重新验证路径，刷新页面数据
  revalidatePath('/update/form')
}

// page.tsx (Server Component)
<form action={createPost}>
  <input name="title" />
  <textarea name="content" />
  <button type="submit">提交</button>
</form>`}
        </pre>
      </section>
    </div>
  )
}
