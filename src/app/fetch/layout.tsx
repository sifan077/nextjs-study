import Link from 'next/link'

/**
 * Fetching Data 学习示例布局
 *
 * 这个布局为所有 /fetch/* 页面提供统一的导航
 */
export default function FetchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 导航栏 */}
      <nav
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ margin: '0 0 10px 0' }}>Fetching Data 示例</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link href="/fetch">首页</Link>
          <Link href="/fetch/server">Server 获取</Link>
          <Link href="/fetch/client">Client 获取</Link>
          <Link href="/fetch/streaming">Streaming</Link>
          <Link href="/fetch/preload">Preload</Link>
        </div>
      </nav>

      {/* 子页面内容 */}
      {children}
    </div>
  )
}
