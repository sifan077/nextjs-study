/**
 * Caching and Revalidating 首页
 *
 * 介绍缓存和重验证的核心概念
 */
export default function CachingPage() {
  return (
    <div>
      <h1>Caching and Revalidating</h1>

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
                <strong>Caching</strong>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                存储数据获取结果，后续请求直接返回缓存，无需重新计算
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <strong>Revalidating</strong>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                更新缓存条目，无需重建整个应用
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* API 列表 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>Next.js 16 缓存 API</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#bbdefb' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>API</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>用途</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>fetch + cache/revalidate</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>缓存 HTTP 请求</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>&apos;use cache&apos;</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                缓存任意函数/组件（数据库、计算等）
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>cacheTag()</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>为缓存打标签</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>revalidateTag()</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>按标签清除缓存</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <code>revalidatePath()</code>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>按路径清除缓存</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 对比 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>fetch vs use cache</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#c8e6c9', borderRadius: '8px' }}>
            <h3>fetch 缓存</h3>
            <p>适用于 HTTP 请求</p>
            <pre
              style={{
                backgroundColor: '#263238',
                color: '#aed581',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {`await fetch(url, {
  cache: 'force-cache',
  next: {
    revalidate: 3600,
    tags: ['posts']
  }
})`}
            </pre>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#c8e6c9', borderRadius: '8px' }}>
            <h3>use cache</h3>
            <p>适用于任意操作</p>
            <pre
              style={{
                backgroundColor: '#263238',
                color: '#aed581',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {`async function getData() {
  'use cache'
  cacheTag('posts')
  cacheLife('hours')

  return db.query(...)
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* 示例链接 */}
      <section>
        <h2>示例页面</h2>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>/caching/fetch</strong> - fetch 缓存控制（force-cache、revalidate、tags）
          </li>
          <li>
            <strong>/caching/use-cache</strong> - use cache + cacheTag + revalidateTag
          </li>
        </ul>
      </section>
    </div>
  )
}
