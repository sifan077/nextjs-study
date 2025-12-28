import { Suspense } from 'react'

/**
 * Streaming 流式传输示例
 *
 * 演示：
 * 1. loading.tsx 整页骨架屏
 * 2. Suspense 细粒度 loading
 * 3. 串行获取数据（有依赖关系）
 */

// 模拟获取艺术家信息（1 秒）
async function getArtist(username: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    id: '1',
    name: username === 'test' ? '周杰伦' : '未知艺术家',
    bio: '华语流行音乐天王',
    followers: 10000000,
  }
}

// 模拟获取歌单（2 秒，依赖 artistID）
async function getPlaylists(artistID: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return [
    { id: 1, name: '最伟大的作品', songs: 12 },
    { id: 2, name: '范特西', songs: 10 },
    { id: 3, name: '七里香', songs: 11 },
  ]
}

// 模拟获取推荐（1.5 秒，独立请求）
async function getRecommendations() {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return [
    { id: 1, name: '林俊杰', genre: '流行' },
    { id: 2, name: '陈奕迅', genre: '粤语' },
    { id: 3, name: '五月天', genre: '摇滚' },
  ]
}

// 歌单组件（依赖 artistID）
async function Playlists({ artistID }: { artistID: string }) {
  const playlists = await getPlaylists(artistID)

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
      }}
    >
      <h3>歌单列表（延迟 2 秒，依赖艺术家 ID）</h3>
      <ul>
        {playlists.map((p) => (
          <li key={p.id}>
            {p.name} - {p.songs} 首歌
          </li>
        ))}
      </ul>
    </div>
  )
}

// 推荐组件（独立请求）
async function Recommendations() {
  const recommendations = await getRecommendations()

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#f3e5f5',
        borderRadius: '8px',
      }}
    >
      <h3>相关推荐（延迟 1.5 秒，独立请求）</h3>
      <ul>
        {recommendations.map((r) => (
          <li key={r.id}>
            {r.name} - {r.genre}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Loading 骨架
function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
      }}
    >
      <p>⏳ {text}</p>
      <div
        style={{
          height: '60px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          animation: 'pulse 1.5s infinite',
        }}
      />
    </div>
  )
}

export default async function StreamingPage() {
  // 1️⃣ 第一个请求：必须等待，后续依赖它
  const artist = await getArtist('test')

  return (
    <div>
      <h1>Streaming 流式传输示例</h1>

      {/* 说明区域 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>流程说明</h2>
        <ol>
          <li>
            <strong>loading.tsx</strong> - 导航时立即显示整页骨架屏
          </li>
          <li>
            <strong>getArtist()</strong> - 等待 1 秒，拿到艺术家信息
          </li>
          <li>
            <strong>显示艺术家 + Suspense fallback</strong> - 歌单和推荐开始加载
          </li>
          <li>
            <strong>流式替换</strong> - 数据 ready 后逐个替换 fallback
          </li>
        </ol>
      </section>

      {/* 2️⃣ 艺术家信息（已 await，立即显示） */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>{artist.name}</h2>
        <p>{artist.bio}</p>
        <p>粉丝数：{artist.followers.toLocaleString()}</p>
        <p style={{ color: '#666', fontSize: '14px' }}>（这部分等了 1 秒后显示）</p>
      </section>

      {/* 3️⃣ 两个独立的 Suspense 边界，并行加载 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Suspense fallback={<LoadingSkeleton text="加载歌单中...（2秒）" />}>
          <Playlists artistID={artist.id} />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton text="加载推荐中...（1.5秒）" />}>
          <Recommendations />
        </Suspense>
      </div>

      {/* 代码说明 */}
      <section style={{ marginTop: '20px' }}>
        <h2>代码结构</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`// 串行获取（有依赖）
const artist = await getArtist(username)  // 必须先等这个

return (
  <>
    <h1>{artist.name}</h1>  {/* 立即显示 */}

    {/* 后续请求用 Suspense 包裹，流式加载 */}
    <Suspense fallback={<Loading />}>
      <Playlists artistID={artist.id} />
    </Suspense>

    {/* 独立请求，并行加载 */}
    <Suspense fallback={<Loading />}>
      <Recommendations />
    </Suspense>
  </>
)

// 关键点：
// 1. 第一个请求是阻塞的（后续依赖它）
// 2. 多个 Suspense 边界可以并行加载
// 3. loading.tsx 让整个页面立即响应`}
        </pre>
      </section>
    </div>
  )
}
