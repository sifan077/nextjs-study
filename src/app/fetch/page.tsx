/**
 * Fetching Data 首页
 *
 * 概念介绍和导航
 */
export default function FetchPage() {
  return (
    <div>
      <h1>Fetching Data 学习示例</h1>

      <section
        style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>核心概念</h2>
        <p>Next.js 中获取数据的方式取决于组件类型：</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                组件类型
              </th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>
                获取方式
              </th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ccc' }}>特点</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>Server Component</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>async/await + fetch/ORM</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                直接查数据库，代码不发到浏览器
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>Client Component</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>use hook / SWR</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                浏览器中执行，需要处理 loading 状态
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section
        style={{
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>示例页面</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>/fetch/server</strong> - Server Component 直接 async/await 获取数据
          </li>
          <li>
            <strong>/fetch/client</strong> - Client Component 用 use hook 流式获取
          </li>
          <li>
            <strong>/fetch/streaming</strong> - Streaming 流式传输 + Suspense
          </li>
          <li>
            <strong>/fetch/preload</strong> - Preload 预加载优化
          </li>
        </ul>
      </section>

      <section
        style={{
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
        }}
      >
        <h2>对比 Java</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`// Next.js Server Component
export default async function Page() {
  const posts = await db.select().from(posts)  // 直接查
  return <ul>...</ul>
}

// Java Spring MVC
@GetMapping("/posts")
public String posts(Model model) {
  List<Post> posts = postRepository.findAll();
  model.addAttribute("posts", posts);
  return "posts";
}`}
        </pre>
      </section>
    </div>
  )
}
