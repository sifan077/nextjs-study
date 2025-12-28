/**
 * 整页 Loading 骨架屏
 *
 * 这个文件会自动被 Next.js 包装在 Suspense 中
 * 当导航到 /fetch/streaming 时立即显示
 */
export default function Loading() {
  return (
    <div>
      <h1>Streaming 流式传输示例</h1>

      <div
        style={{
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <p style={{ fontSize: '18px' }}>页面加载中...</p>
        <p style={{ color: '#666' }}>这是 loading.tsx 显示的骨架屏</p>

        {/* 骨架屏动画 */}
        <div style={{ marginTop: '20px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '60px',
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                marginBottom: '10px',
                animation: 'pulse 1.5s infinite',
              }}
            />
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  )
}
