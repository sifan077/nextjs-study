import ThemeProvider from './theme-provider'
import ThemeButton from './theme-button'

// 这是 Server Component（默认）
// 模拟从服务端获取数据
async function getServerData() {
  return {
    title: 'Context Provider Demo',
    description: '演示如何在 Next.js 中使用 React Context',
  }
}

export default async function ThemeDemoPage() {
  // Server Component 可以 async/await
  const data = await getServerData()

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>

      <hr style={{ margin: '20px 0' }} />

      {/*
        ThemeProvider 是 Client Component
        但它的 children 可以包含 Server Component 渲染的内容
      */}
      <ThemeProvider>
        {/* 这部分内容在服务端渲染好，作为 children 传入 */}
        <div>
          <h2>这是 Server Component 渲染的内容</h2>
          <p>这段文字在服务端生成，但会随主题变色</p>

          {/* ThemeButton 是 Client Component，使用 useContext */}
          <ThemeButton />
        </div>
      </ThemeProvider>

      <hr style={{ margin: '20px 0' }} />

      <h3>结构说明：</h3>
      <pre
        style={{
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        {`ThemeDemoPage (Server Component)
├── h1, p (服务端渲染)
└── ThemeProvider (Client Component)
    └── children (服务端渲染，传入 Client)
        ├── h2, p (服务端渲染)
        └── ThemeButton (Client Component)
            └── useContext(ThemeContext)`}
      </pre>
    </div>
  )
}
