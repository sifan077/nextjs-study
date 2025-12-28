import { cache } from 'react'

/**
 * Preload 预加载示例
 *
 * 演示：
 * 1. 条件渲染场景下的预加载优化
 * 2. 使用 void + cache 实现提前请求
 * 3. 对比串行和并行的时间差异
 */

// 用 cache 包装，确保 preload 和实际使用共享同一份数据
const getProduct = cache(async (id: string) => {
  console.log(`🔍 getProduct(${id}) 被调用`)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return {
    id,
    name: `商品 ${id}`,
    price: Math.floor(Math.random() * 1000) + 100,
    description: '这是一个很棒的商品',
    inStock: true,
  }
})

// 模拟检查库存（需要 1 秒）
async function checkAvailability(id: string) {
  console.log(`🔍 checkAvailability(${id}) 被调用`)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // 随机决定是否有库存（演示用，实际会查数据库）
  return id !== 'unavailable'
}

// preload 函数：启动请求但不等待
const preload = (id: string) => {
  void getProduct(id) // void = 执行但忽略返回值
}

// 商品详情组件
async function ProductDetail({ id }: { id: string }) {
  const product = await getProduct(id) // 这里会用到 preload 的缓存

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
      }}
    >
      <h3>{product.name}</h3>
      <p>价格：¥{product.price}</p>
      <p>{product.description}</p>
      <p>
        库存状态：<span style={{ color: 'green' }}>有货</span>
      </p>
    </div>
  )
}

// URL 参数类型
type PageProps = {
  searchParams: Promise<{ id?: string; mode?: string }>
}

export default async function PreloadPage({ searchParams }: PageProps) {
  const { id = '123', mode = 'preload' } = await searchParams

  const startTime = Date.now()

  let isAvailable: boolean
  let product: { id: string; name: string; price: number } | null = null

  if (mode === 'preload') {
    // ✅ 预加载模式：并行执行
    preload(id) // 1️⃣ 立即启动商品请求（不等待）
    isAvailable = await checkAvailability(id) // 2️⃣ 同时检查库存

    if (isAvailable) {
      product = await getProduct(id) // 3️⃣ 数据可能已经 ready 了
    }
  } else {
    // ❌ 串行模式：先检查，再获取
    isAvailable = await checkAvailability(id) // 等 1 秒
    if (isAvailable) {
      product = await getProduct(id) // 再等 1.5 秒
    }
  }

  const elapsedTime = Date.now() - startTime

  return (
    <div>
      <h1>Preload 预加载示例</h1>

      {/* 说明区域 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>场景说明</h2>
        <p>商品详情页需要：</p>
        <ol>
          <li>检查库存（1 秒）- 决定是否显示商品</li>
          <li>获取商品详情（1.5 秒）- 显示商品信息</li>
        </ol>
        <p>
          <strong>关键洞察：</strong>商品数据获取<strong>不依赖</strong>
          库存检查结果，可以并行！
        </p>
      </section>

      {/* 模式切换 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>模式对比</h2>
        <p>
          当前模式：<strong>{mode === 'preload' ? '预加载（并行）' : '串行'}</strong>
        </p>
        <p>
          耗时：<strong>{elapsedTime}ms</strong>（理论值：
          {mode === 'preload' ? '~1500ms' : '~2500ms'}）
        </p>
        <div style={{ marginTop: '10px' }}>
          <a
            href="/fetch/preload?id=123&mode=preload"
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: mode === 'preload' ? '#1976d2' : '#e0e0e0',
              color: mode === 'preload' ? 'white' : 'black',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            预加载模式
          </a>
          <a
            href="/fetch/preload?id=123&mode=serial"
            style={{
              padding: '8px 16px',
              backgroundColor: mode === 'serial' ? '#1976d2' : '#e0e0e0',
              color: mode === 'serial' ? 'white' : 'black',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            串行模式
          </a>
          <a
            href="/fetch/preload?id=unavailable&mode=preload"
            style={{
              marginLeft: '10px',
              padding: '8px 16px',
              backgroundColor: '#ff9800',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            测试无库存
          </a>
        </div>
      </section>

      {/* 结果展示 */}
      <section style={{ marginBottom: '20px' }}>
        <h2>结果</h2>
        {isAvailable && product ? (
          <div
            style={{
              padding: '15px',
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
            }}
          >
            <h3>{product.name}</h3>
            <p>价格：¥{product.price}</p>
            <p>库存状态：有货</p>
          </div>
        ) : (
          <div
            style={{
              padding: '15px',
              backgroundColor: '#ffebee',
              borderRadius: '8px',
            }}
          >
            <h3>商品不可用</h3>
            <p>该商品暂时无货或不存在</p>
          </div>
        )}
      </section>

      {/* 时间线对比 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>时间线对比</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`❌ 串行（2.5 秒）：
[checkAvailability 1秒] ──→ [getProduct 1.5秒] ──→ 完成
|___________________________|____________________|
0s                         1s                   2.5s

✅ 预加载（1.5 秒）：
[checkAvailability 1秒] ──→ 完成
[getProduct 1.5秒] ────────→ 完成（已在缓存中）
|___________________________|
0s                         1.5s

节省：1 秒（40% 性能提升）`}
        </pre>
      </section>

      {/* 代码说明 */}
      <section>
        <h2>代码实现</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`import { cache } from 'react'

// 1. 用 cache 包装数据获取函数
const getProduct = cache(async (id) => {
  return await db.query.products.findFirst({ where: eq(id) })
})

// 2. preload 函数：启动请求但不等待
const preload = (id) => {
  void getProduct(id)  // void = 执行但忽略返回值
}

// 3. 在页面中使用
export default async function Page({ params }) {
  const { id } = await params

  preload(id)  // 立即启动（不阻塞）
  const isAvailable = await checkAvailability(id)  // 同时检查条件

  if (!isAvailable) return <NotFound />

  const product = await getProduct(id)  // 数据可能已经 ready
  return <ProductDetail product={product} />
}`}
        </pre>
      </section>
    </div>
  )
}
