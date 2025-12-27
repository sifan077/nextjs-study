import Link from 'next/link'

/**
 * Cache Components 学习示例布局
 *
 * 这个布局为所有 /cache/* 页面提供统一的导航
 */
export default function CacheLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 导航栏 - 静态内容，自动预渲染 */}
      <nav
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ margin: '0 0 10px 0' }}>Cache Components 示例</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link href="/cache">首页</Link>
          <Link href="/cache/static">静态内容</Link>
          <Link href="/cache/dynamic">动态内容</Link>
          <Link href="/cache/use-cache">use cache</Link>
          <Link href="/cache/runtime">运行时数据</Link>
          <Link href="/cache/combined">综合示例</Link>
        </div>
      </nav>

      {/* 子页面内容 */}
      {children}
    </div>
  )
}
