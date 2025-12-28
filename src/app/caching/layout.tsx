import Link from 'next/link'

/**
 * Caching and Revalidating 学习示例布局
 */
export default function CachingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <nav
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#e1f5fe',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ margin: '0 0 10px 0' }}>Caching & Revalidating 示例</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link href="/caching">首页</Link>
          <Link href="/caching/fetch">fetch 缓存</Link>
          <Link href="/caching/use-cache">use cache</Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
