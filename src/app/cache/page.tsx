/**
 * Cache Components 学习首页
 *
 * 这是一个纯静态页面，没有任何动态数据
 * Next.js 会在构建时自动预渲染，加入静态 Shell
 */
export default function CachePage() {
  return (
    <div>
      <h1>Cache Components 学习</h1>

      <section style={{ marginTop: '20px' }}>
        <h2>核心概念</h2>
        <p>Cache Components 允许在同一个页面混合三种内容：</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '15px',
          }}
        >
          {/* 静态内容卡片 */}
          <div
            style={{
              padding: '15px',
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
            }}
          >
            <h3>🏗️ 静态内容</h3>
            <p>构建时生成，永不变化</p>
            <p>
              <small>如：导航栏、Logo、布局结构</small>
            </p>
          </div>

          {/* 缓存内容卡片 */}
          <div
            style={{
              padding: '15px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
            }}
          >
            <h3>📦 缓存内容</h3>
            <p>定期更新，可设置过期时间</p>
            <p>
              <small>如：商品列表、文章列表</small>
            </p>
          </div>

          {/* 动态内容卡片 */}
          <div
            style={{
              padding: '15px',
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
            }}
          >
            <h3>⚡ 动态内容</h3>
            <p>每次请求实时获取</p>
            <p>
              <small>如：用户信息、购物车数量</small>
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>示例导航</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>/cache/static</strong> - 静态内容示例（自动预渲染）
          </li>
          <li>
            <strong>/cache/dynamic</strong> - 动态内容 + Suspense 示例
          </li>
          <li>
            <strong>/cache/use-cache</strong> - use cache 缓存示例
          </li>
          <li>
            <strong>/cache/runtime</strong> - 运行时数据（cookies/headers）
          </li>
          <li>
            <strong>/cache/combined</strong> - 综合示例（三种内容混合）
          </li>
        </ul>
      </section>
    </div>
  )
}
