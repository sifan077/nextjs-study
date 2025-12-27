import { Suspense } from 'react'
import { cookies } from 'next/headers'

/**
 * 综合示例：静态 + 缓存 + 动态 三种内容混合
 *
 * 这个页面演示了 Cache Components 的核心价值：
 * 在同一个页面中混合使用三种不同的渲染策略
 *
 * 渲染时间线：
 * 1. 静态内容 → 构建时生成，立即可见
 * 2. 缓存内容 → 构建时生成并缓存，立即可见（数据可能有延迟）
 * 3. 动态内容 → 请求时获取，显示 loading 后替换
 */

// ============================================
// 1️⃣ 静态内容组件
// 这些内容在构建时就确定，所有用户看到相同的内容
// ============================================
function StaticHeader() {
  return (
    <header
      style={{
        padding: '20px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <h1>🏪 在线商店</h1>
      <p>
        <strong>类型：静态内容</strong> - 构建时生成，永不变化
      </p>
      <nav style={{ marginTop: '10px' }}>
        <span style={{ marginRight: '15px' }}>首页</span>
        <span style={{ marginRight: '15px' }}>商品</span>
        <span style={{ marginRight: '15px' }}>关于我们</span>
        <span>联系我们</span>
      </nav>
    </header>
  )
}

// ============================================
// 2️⃣ 缓存内容组件（模拟 use cache 效果）
// 实际使用时加上 'use cache' 和 cacheLife()
// 这里用普通 async 函数模拟
// ============================================

// 模拟从 API 获取商品列表（实际应该用 use cache）
async function getProducts() {
  // 实际代码：
  // 'use cache'
  // cacheLife('hours')

  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    { id: 1, name: 'MacBook Pro', price: 12999, stock: 50 },
    { id: 2, name: 'iPhone 15', price: 7999, stock: 100 },
    { id: 3, name: 'AirPods Pro', price: 1899, stock: 200 },
    { id: 4, name: 'iPad Air', price: 4799, stock: 80 },
  ]
}

async function CachedProductList() {
  const products = await getProducts()
  const fetchTime = new Date().toLocaleTimeString()

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
      }}
    >
      <h2>📦 商品列表</h2>
      <p>
        <strong>类型：缓存内容</strong> - 所有用户共享，定期更新
      </p>
      <p>
        <small>获取时间: {fetchTime}（启用 use cache 后，这个时间在缓存期内不变）</small>
      </p>

      <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#bbdefb' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>商品名</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>价格</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>库存</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td style={{ padding: '10px' }}>{product.name}</td>
              <td style={{ padding: '10px', textAlign: 'right' }}>¥{product.price}</td>
              <td style={{ padding: '10px', textAlign: 'right' }}>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#fff',
          borderRadius: '4px',
        }}
      >
        <small>
          💡 实际代码中应该这样写：
          <pre style={{ margin: '5px 0', color: '#666' }}>
            {`async function CachedProductList() {
  'use cache'           // 启用缓存
  cacheLife('hours')    // 每小时更新
  cacheTag('products')  // 打标签，方便手动刷新
  ...
}`}
          </pre>
        </small>
      </div>
    </div>
  )
}

// ============================================
// 3️⃣ 动态内容组件（运行时数据）
// 必须用 Suspense 包裹，不能缓存
// ============================================
async function DynamicUserInfo() {
  const cookieStore = await cookies()

  // 模拟用户数据获取延迟
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 从 cookie 读取用户信息（实际项目中可能是 session/token）
  const username = cookieStore.get('username')?.value || '游客'
  const cartCount = cookieStore.get('cart_count')?.value || '0'
  const theme = cookieStore.get('theme')?.value || 'light'

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
      }}
    >
      <h2>👤 用户信息</h2>
      <p>
        <strong>类型：动态内容</strong> - 每个用户不同，每次请求实时获取
      </p>

      <div style={{ marginTop: '15px' }}>
        <p>
          <strong>用户名：</strong>
          {username}
        </p>
        <p>
          <strong>购物车：</strong>
          {cartCount} 件商品
        </p>
        <p>
          <strong>主题：</strong>
          {theme}
        </p>
        <p>
          <strong>请求时间：</strong>
          {new Date().toLocaleTimeString()}
          <small>（每次刷新都变）</small>
        </p>
      </div>

      <div
        style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#fff',
          borderRadius: '4px',
        }}
      >
        <small>
          💡 设置 Cookie 试试效果：
          <br />
          打开浏览器控制台，输入：
          <pre style={{ margin: '5px 0', color: '#666' }}>
            {`document.cookie = "username=张三"
document.cookie = "cart_count=5"
document.cookie = "theme=dark"`}
          </pre>
          然后刷新页面
        </small>
      </div>
    </div>
  )
}

// Loading 组件
function UserInfoSkeleton() {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
        opacity: 0.7,
      }}
    >
      <h2>👤 用户信息</h2>
      <p>
        <strong>类型：动态内容</strong>
      </p>
      <div style={{ marginTop: '15px' }}>
        <p>⏳ 正在加载用户信息...（2秒）</p>
        <div
          style={{
            height: '20px',
            backgroundColor: '#ffe0b2',
            borderRadius: '4px',
            marginTop: '10px',
            animation: 'pulse 1.5s infinite',
          }}
        />
        <div
          style={{
            height: '20px',
            backgroundColor: '#ffe0b2',
            borderRadius: '4px',
            marginTop: '10px',
            width: '60%',
            animation: 'pulse 1.5s infinite',
          }}
        />
      </div>
    </div>
  )
}

// ============================================
// 页面主组件
// ============================================
export default async function CombinedPage() {
  return (
    <div>
      {/* 说明区域 */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>综合示例：三种内容混合</h2>
        <p>这个页面展示了 Cache Components 的核心价值：</p>
        <ul>
          <li>
            <span style={{ color: '#4caf50' }}>🏗️ 静态内容</span> - Header 立即显示
          </li>
          <li>
            <span style={{ color: '#2196f3' }}>📦 缓存内容</span> - 商品列表（所有用户共享）
          </li>
          <li>
            <span style={{ color: '#ff9800' }}>👤 动态内容</span> - 用户信息（每个用户不同）
          </li>
        </ul>
      </div>

      {/* 1️⃣ 静态内容 - 立即显示 */}
      <StaticHeader />

      {/* 主内容区域 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
      >
        {/* 2️⃣ 缓存内容 - 立即显示（实际使用 use cache 时） */}
        <CachedProductList />

        {/* 3️⃣ 动态内容 - 先显示骨架屏，2秒后替换 */}
        <Suspense fallback={<UserInfoSkeleton />}>
          <DynamicUserInfo />
        </Suspense>
      </div>

      {/* 底部说明 */}
      <footer
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#eceff1',
          borderRadius: '8px',
        }}
      >
        <h3>渲染时间线</h3>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`用户请求页面
    │
    ├── 立即返回（静态 Shell）：
    │   ├── StaticHeader（静态）
    │   ├── CachedProductList（缓存，启用 use cache 后）
    │   └── UserInfoSkeleton（fallback）
    │
    └── 2秒后（流式填充）：
        └── DynamicUserInfo 替换 Skeleton

总体验：
- 首屏秒开（静态 + 缓存内容）
- 用户信息异步加载（不阻塞其他内容）
- 商品列表所有用户共享（减少服务器压力）`}
        </pre>
      </footer>
    </div>
  )
}
