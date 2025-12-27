/**
 * 静态内容示例
 *
 * 这个页面展示了哪些操作会被自动预渲染到静态 Shell 中
 *
 * 可以自动预渲染的操作：
 * 1. 同步文件读取 - fs.readFileSync()
 * 2. 模块导入 - import()
 * 3. 纯计算 - array.map(), JSON.parse() 等
 *
 * 这些操作在 next build 时就执行完了，结果直接写入 HTML
 */

// 模拟一些静态数据（构建时就确定）
const STATIC_MENU = [
  { id: 1, name: '首页', path: '/' },
  { id: 2, name: '博客', path: '/blog' },
  { id: 3, name: '关于', path: '/about' },
]

// 纯计算：构建时执行
const BUILD_TIME = new Date().toISOString()

export default function StaticPage() {
  // 纯计算：数组操作，构建时执行
  const menuItems = STATIC_MENU.map((item) => ({
    ...item,
    fullPath: `https://example.com${item.path}`,
  }))

  // 纯计算：数学运算，构建时执行
  const randomSeed = Math.floor(12345 * 0.5) // 注意：这不是 Math.random()，是确定性计算

  return (
    <div>
      <h1>静态内容示例</h1>

      {/* 说明区域 */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>✅ 这个页面完全是静态的</h3>
        <p>所有内容在 next build 时就生成好了，用户访问时直接返回 HTML</p>
        <p>
          <strong>构建时间：</strong>
          {BUILD_TIME}
        </p>
        <p>
          <small>刷新页面，这个时间不会变（因为是构建时确定的）</small>
        </p>
      </div>

      {/* 静态菜单 */}
      <section style={{ marginTop: '20px' }}>
        <h2>静态菜单（纯计算生成）</h2>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.fullPath}
            </li>
          ))}
        </ul>
      </section>

      {/* 确定性计算结果 */}
      <section style={{ marginTop: '20px' }}>
        <h2>确定性计算</h2>
        <p>计算结果: {randomSeed}（每次构建都是 6172，因为是确定性计算）</p>
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
          {`// ✅ 这些操作会自动预渲染

// 1. 静态数据定义
const STATIC_MENU = [{ id: 1, name: '首页' }]

// 2. 纯计算
const menuItems = STATIC_MENU.map(item => ({
  ...item,
  fullPath: \`https://example.com\${item.path}\`
}))

// 3. 确定性计算（不是 Math.random）
const result = Math.floor(12345 * 0.5)

// ❌ 这些操作不会自动预渲染
// await fetch('https://api...')  // 网络请求
// Math.random()                  // 非确定性
// await cookies()                // 运行时数据`}
        </pre>
      </section>
    </div>
  )
}
