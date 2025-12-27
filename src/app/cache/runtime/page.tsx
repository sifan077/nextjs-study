import { Suspense } from 'react'
import { cookies, headers } from 'next/headers'

/**
 * 运行时数据示例
 *
 * 运行时数据是只有在用户发起请求时才能获取的数据：
 * 1. cookies() - 用户的 Cookie
 * 2. headers() - 请求头
 * 3. searchParams - URL 查询参数
 * 4. params - 动态路由参数
 *
 * 特点：
 * - 构建时不存在这些数据（用户还没来）
 * - 不能用 use cache（每个用户数据不同）
 * - 只能用 Suspense 包裹
 */

// 读取 Cookies 的组件
async function UserCookies() {
  const cookieStore = await cookies()

  // 获取所有 cookies
  const allCookies = cookieStore.getAll()

  // 模拟延迟以展示 Suspense 效果
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
      }}
    >
      <h4>🍪 用户 Cookies</h4>
      {allCookies.length > 0 ? (
        <ul>
          {allCookies.map((cookie) => (
            <li key={cookie.name}>
              <strong>{cookie.name}</strong>: {cookie.value}
            </li>
          ))}
        </ul>
      ) : (
        <p>没有 cookies（这是正常的，浏览器可能没有设置）</p>
      )}
      <p>
        <small>
          Java 类比: <code>request.getCookies()</code>
        </small>
      </p>
    </div>
  )
}

// 读取 Headers 的组件
async function RequestHeaders() {
  const headerStore = await headers()

  // 获取一些常用的 headers
  const userAgent = headerStore.get('user-agent') || '未知'
  const acceptLanguage = headerStore.get('accept-language') || '未知'
  const host = headerStore.get('host') || '未知'

  await new Promise((resolve) => setTimeout(resolve, 1500))

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#f3e5f5',
        borderRadius: '8px',
      }}
    >
      <h4>📋 请求头信息</h4>
      <ul>
        <li>
          <strong>User-Agent</strong>: {userAgent.slice(0, 50)}...
        </li>
        <li>
          <strong>Accept-Language</strong>: {acceptLanguage}
        </li>
        <li>
          <strong>Host</strong>: {host}
        </li>
      </ul>
      <p>
        <small>
          Java 类比: <code>request.getHeader(&quot;User-Agent&quot;)</code>
        </small>
      </p>
    </div>
  )
}

// Loading 组件
function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
      }}
    >
      <p>⏳ {text}</p>
    </div>
  )
}

// 使用 searchParams
async function SearchParamsDisplay({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
      }}
    >
      <h4>🔍 URL 查询参数</h4>
      {Object.keys(params).length > 0 ? (
        <ul>
          {Object.entries(params).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>: {String(value)}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          没有查询参数。试试访问: <code>/cache/runtime?name=张三&age=25</code>
        </p>
      )}
      <p>
        <small>
          Java 类比: <code>request.getParameter(&quot;name&quot;)</code>
        </small>
      </p>
    </div>
  )
}

export default async function RuntimePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <div>
      <h1>运行时数据示例</h1>

      {/* 说明区域 - 静态内容 */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>⚠️ 重要概念</h3>
        <p>运行时数据只有在用户请求到来时才能确定：</p>
        <ul>
          <li>构建时用户还没来，这些数据不存在</li>
          <li>
            <strong>不能用 use cache</strong>
            （每个用户数据不同，缓存会泄露数据）
          </li>
          <li>
            <strong>只能用 Suspense</strong>
          </li>
        </ul>
      </div>

      {/* searchParams - 可以直接在 Page 组件中使用 */}
      <section style={{ marginTop: '20px' }}>
        <h2>查询参数 (searchParams)</h2>
        <SearchParamsDisplay searchParams={searchParams} />
      </section>

      {/* Cookies - 需要 Suspense */}
      <section style={{ marginTop: '20px' }}>
        <h2>Cookies（延迟 1 秒）</h2>
        <Suspense fallback={<LoadingSkeleton text="正在读取 Cookies..." />}>
          <UserCookies />
        </Suspense>
      </section>

      {/* Headers - 需要 Suspense */}
      <section style={{ marginTop: '20px' }}>
        <h2>请求头（延迟 1.5 秒）</h2>
        <Suspense fallback={<LoadingSkeleton text="正在读取请求头..." />}>
          <RequestHeaders />
        </Suspense>
      </section>

      {/* 代码说明 */}
      <section
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3>代码说明</h3>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`import { cookies, headers } from 'next/headers'

// 运行时数据必须用 Suspense 包裹
async function UserCookies() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value || 'light'
  return <div>主题: {theme}</div>
}

async function RequestHeaders() {
  const headerStore = await headers()
  const userAgent = headerStore.get('user-agent')
  return <div>浏览器: {userAgent}</div>
}

// 在页面中使用
export default function Page({ searchParams }) {
  return (
    <>
      {/* searchParams 直接用 */}
      <div>搜索: {searchParams.q}</div>

      {/* cookies/headers 需要 Suspense */}
      <Suspense fallback={<Loading />}>
        <UserCookies />
      </Suspense>
    </>
  )
}`}
        </pre>
      </section>

      {/* connection() 说明 */}
      <section
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff8e1',
          borderRadius: '8px',
        }}
      >
        <h3>特殊情况：connection()</h3>
        <p>如果只想延迟到请求时执行，但不需要访问 cookies/headers：</p>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`import { connection } from 'next/server'

async function UniqueContent() {
  await connection()  // ← 只是延迟，不读取任何数据

  // 现在这些是请求时执行的
  const uuid = crypto.randomUUID()
  const now = Date.now()

  return <div>UUID: {uuid}</div>
}`}
        </pre>
      </section>
    </div>
  )
}
