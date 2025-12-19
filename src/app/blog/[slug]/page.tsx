import Link from 'next/link'

// 告诉 Next.js 哪些页面可以预先生成
// 只有 hello 会在构建时生成，next 不在列表里，所以是动态渲染
export async function generateStaticParams() {
  return [{ slug: 'hello' }]
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // 只有非预生成的路由才模拟延迟
  // hello 是预生成的，访问时秒开
  // next 不在 generateStaticParams 里，会走这个延迟
  if (slug !== 'hello') {
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  // 模拟文章数据
  const posts: Record<string, { title: string; content: string }> = {
    hello: {
      title: 'Hello World',
      content: '这是我的第一篇博客文章。',
    },
    next: {
      title: 'Next.js 入门',
      content: '学习 Next.js 的基础知识。',
    },
  }

  const post = posts[slug]

  if (!post) {
    return <div>文章不存在: {slug}</div>
  }

  return (
    <div>
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <hr />
        <p>当前 slug: {slug}</p>
      </article>

      <nav>
        <h3>使用 Link 组件（客户端导航，不刷新）:</h3>
        <ul>
          {Object.entries(posts).map(([key, p]) => (
            <li key={key}>
              <Link href={`/blog/${key}`}>{p.title}</Link>
            </li>
          ))}
        </ul>

        <h3>使用 a 标签（传统导航，整页刷新）:</h3>
        <ul>
          {Object.entries(posts).map(([key, p]) => (
            <li key={key}>
              <a href={`/blog/${key}`}>{p.title}</a>
            </li>
          ))}
        </ul>

        <p style={{ marginTop: '20px', color: 'gray', fontSize: '14px' }}>
          提示：观察浏览器标签页，Link 不会出现加载图标，a 标签会整页刷新
        </p>
      </nav>
    </div>
  )
}
