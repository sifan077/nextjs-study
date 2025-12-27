import { Suspense } from 'react'

/**
 * 动态内容示例
 *
 * 展示如何使用 Suspense 处理动态内容
 *
 * 动态内容包括：
 * 1. 网络请求 - fetch()
 * 2. 数据库查询 - db.query()
 * 3. 异步文件读取 - fs.promises.readFile()
 * 4. 任何 async/await 操作
 *
 * 这些操作必须用 <Suspense> 包裹，否则会报错：
 * "Uncached data was accessed outside of <Suspense>"
 */

// 模拟 API 请求的组件（会延迟 2 秒）
async function SlowDataFetch() {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 模拟从 API 获取的数据
  const data = {
    id: 1,
    title: '这是从 API 获取的数据',
    timestamp: new Date().toISOString(),
  }

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
      }}
    >
      <h4>✅ 数据加载完成</h4>
      <p>ID: {data.id}</p>
      <p>标题: {data.title}</p>
      <p>
        时间: {data.timestamp}
        <small>（每次刷新都会变，因为是请求时获取）</small>
      </p>
    </div>
  )
}

// 另一个慢速组件（延迟 3 秒）
async function AnotherSlowComponent() {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#f3e5f5',
        borderRadius: '8px',
      }}
    >
      <h4>✅ 另一个组件加载完成</h4>
      <p>这个组件比上面那个慢 1 秒</p>
      <p>但因为用了独立的 Suspense，它们是并行加载的</p>
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
        animation: 'pulse 1.5s infinite',
      }}
    >
      <p>⏳ {text}</p>
    </div>
  )
}

export default function DynamicPage() {
  return (
    <div>
      <h1>动态内容 + Suspense 示例</h1>

      {/* 说明区域 - 静态内容，立即显示 */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>📝 说明</h3>
        <p>这个页面演示了如何用 Suspense 处理动态内容</p>
        <p>下面两个组件分别延迟 2 秒和 3 秒加载</p>
        <p>
          <strong>注意观察：</strong>它们是并行加载的，不是串行等待
        </p>
      </div>

      {/* 第一个动态组件 */}
      <section style={{ marginTop: '20px' }}>
        <h2>动态组件 1（延迟 2 秒）</h2>
        <Suspense fallback={<LoadingSkeleton text="正在加载数据...（2秒）" />}>
          <SlowDataFetch />
        </Suspense>
      </section>

      {/* 第二个动态组件 - 独立的 Suspense 边界 */}
      <section style={{ marginTop: '20px' }}>
        <h2>动态组件 2（延迟 3 秒）</h2>
        <Suspense fallback={<LoadingSkeleton text="正在加载另一个组件...（3秒）" />}>
          <AnotherSlowComponent />
        </Suspense>
      </section>

      {/* 静态内容 - 立即显示，不受动态组件影响 */}
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
          {`// 动态组件必须用 Suspense 包裹
<Suspense fallback={<Loading />}>
  <SlowDataFetch />  {/* 这里面有 await */}
</Suspense>

// SlowDataFetch 组件内部
async function SlowDataFetch() {
  // ❌ 这行会阻止预渲染
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 返回的内容在请求时才渲染
  return <div>数据加载完成</div>
}

// 关键点：
// 1. Suspense 的 fallback 会进入静态 Shell
// 2. 多个 Suspense 边界可以并行加载
// 3. 动态组件外的内容不受影响，立即显示`}
        </pre>
      </section>
    </div>
  )
}
