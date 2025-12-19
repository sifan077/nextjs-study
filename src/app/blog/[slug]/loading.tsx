export default function Loading() {
  return (
    <div>
      <div
        style={{
          height: '32px',
          width: '200px',
          background: '#e0e0e0',
          borderRadius: '4px',
          marginBottom: '16px',
        }}
      />
      <div
        style={{
          height: '16px',
          width: '300px',
          background: '#e0e0e0',
          borderRadius: '4px',
          marginBottom: '8px',
        }}
      />
      <div
        style={{
          height: '16px',
          width: '250px',
          background: '#e0e0e0',
          borderRadius: '4px',
        }}
      />
      <p style={{ color: 'gray', marginTop: '16px' }}>加载中...</p>
    </div>
  )
}
