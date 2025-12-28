import Link from 'next/link'

/**
 * Updating Data 学习示例布局
 *
 * 这个布局为所有 /update/* 页面提供统一的导航
 */
export default function UpdateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 导航栏 */}
      <nav
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ margin: '0 0 10px 0' }}>Updating Data 示例</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link href="/update">首页</Link>
          <Link href="/update/form">Form 表单</Link>
          <Link href="/update/event">Event 事件</Link>
          <Link href="/update/pending">Pending 状态</Link>
          <Link href="/update/revalidate">Revalidate 缓存</Link>
        </div>
      </nav>

      {/* 子页面内容 */}
      {children}
    </div>
  )
}
