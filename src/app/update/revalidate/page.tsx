import { Suspense } from 'react'
import {
  getCachedData,
  updateDataWithRevalidatePath,
  updateAndRedirect,
  getThemeCookie,
  setThemeCookie,
  deleteThemeCookie,
} from '../actions'

/**
 * Revalidate、Redirect、Cookies 示例
 *
 * 演示：
 * 1. revalidatePath - 按路径清除缓存
 * 2. redirect - 重定向（注意：必须在 revalidatePath 之后）
 * 3. cookies - 读取、设置、删除 Cookie
 *
 * 注意：cookies() 是运行时数据，必须用 Suspense 包裹
 */

// 数据展示组件（使用模拟数据，不需要 Suspense）
async function DataDisplay() {
  const data = await getCachedData()

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '4px',
        marginBottom: '15px',
      }}
    >
      <p>
        <strong>当前数据：</strong>
      </p>
      <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

// Cookie 展示组件（使用 cookies()，需要 Suspense）
async function ThemeDisplay() {
  const theme = await getThemeCookie()

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '4px',
        marginBottom: '15px',
      }}
    >
      <p>
        <strong>当前主题 Cookie：</strong>
        <span
          style={{
            padding: '5px 10px',
            backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
            color: theme === 'dark' ? 'white' : 'black',
            borderRadius: '4px',
            marginLeft: '10px',
          }}
        >
          {theme}
        </span>
      </p>
    </div>
  )
}

// Loading 骨架屏
function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        marginBottom: '15px',
      }}
    >
      <p>{text}</p>
    </div>
  )
}

export default function RevalidatePage() {
  return (
    <div>
      <h1>Revalidate、Redirect、Cookies</h1>

      {/* revalidatePath 演示 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>1. revalidatePath 缓存重验证</h2>
        <p>更新数据后清除缓存，让页面显示最新数据</p>

        <Suspense fallback={<LoadingSkeleton text="加载数据中..." />}>
          <DataDisplay />
        </Suspense>

        <form action={updateDataWithRevalidatePath}>
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
            更新数据（revalidatePath）
          </button>
        </form>

        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '15px',
            fontSize: '13px',
          }}
        >
          {`// 更新后清除缓存
revalidatePath('/update/revalidate')`}
        </pre>
      </section>

      {/* redirect 演示 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>2. redirect 重定向</h2>
        <p>更新数据后跳转到其他页面</p>

        <div
          style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            marginBottom: '15px',
          }}
        >
          <strong>重要：</strong>redirect 会抛异常，revalidatePath 必须在它之前！
          <pre
            style={{
              backgroundColor: '#263238',
              color: '#ffcdd2',
              padding: '10px',
              borderRadius: '4px',
              marginTop: '10px',
              fontSize: '13px',
            }}
          >
            {`// ✅ 正确顺序
revalidatePath('/posts')
redirect('/posts')

// ❌ 错误 - revalidate 不会执行
redirect('/posts')
revalidatePath('/posts')  // 永远执行不到`}
          </pre>
        </div>

        <form action={updateAndRedirect}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            更新并重定向回本页
          </button>
        </form>
      </section>

      {/* Cookies 演示 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>3. Cookies 操作</h2>
        <p>在 Server Action 中读取、设置、删除 Cookie</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          注意：cookies() 是运行时数据，必须用 Suspense 包裹
        </p>

        {/* cookies() 需要 Suspense */}
        <Suspense fallback={<LoadingSkeleton text="读取 Cookie..." />}>
          <ThemeDisplay />
        </Suspense>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <form action={setThemeCookie}>
            <input type="hidden" name="theme" value="light" />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#f5f5f5',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              设置 Light
            </button>
          </form>

          <form action={setThemeCookie}>
            <input type="hidden" name="theme" value="dark" />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              设置 Dark
            </button>
          </form>

          <form action={deleteThemeCookie}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              删除 Cookie
            </button>
          </form>
        </div>

        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '15px',
            fontSize: '13px',
          }}
        >
          {`import { cookies } from 'next/headers'

export async function setThemeCookie(formData: FormData) {
  'use server'
  const cookieStore = await cookies()

  // 读取
  const value = cookieStore.get('theme')?.value

  // 设置
  cookieStore.set('theme', 'dark', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7  // 7天
  })

  // 删除
  cookieStore.delete('theme')
}`}
        </pre>
      </section>

      {/* API 总结 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h2>API 总结</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>方法</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>用途</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                Java 类比
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>revalidatePath(path)</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>按路径清除缓存</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                redisTemplate.delete(key)
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>revalidateTag(tag)</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>按标签清除缓存</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>@CacheEvict(cacheNames)</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>redirect(path)</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>重定向（抛异常实现）</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                return &quot;redirect:/path&quot;
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>cookies()</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>读写删除 Cookie</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                HttpServletRequest/Response
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}
