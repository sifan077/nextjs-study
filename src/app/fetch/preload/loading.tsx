/**
 * Preload 页面的 Loading 骨架屏
 *
 * 因为页面使用了 searchParams（运行时数据），
 * 需要 Suspense 边界，loading.tsx 会自动提供
 */
export default function Loading() {
  return (
    <div>
      <h1>Preload 预加载示例</h1>

      <div
        style={{
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
        }}
      >
        <p>加载中...</p>
        <div
          style={{
            height: '200px',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
            animation: 'pulse 1.5s infinite',
          }}
        />
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
