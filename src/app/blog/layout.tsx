export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ color: 'red' }}>
      {children}
    </div>
  )
}
