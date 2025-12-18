import Link from "next/link";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // 模拟文章数据
  const posts: Record<string, { title: string; content: string }> = {
    'hello': {
      title: 'Hello World',
      content: '这是我的第一篇博客文章。',
    },
    'next': {
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
        <h3>其他文章:</h3>
        <ul>
          {Object.entries(posts).map(([key, p]) => (
            <li key={key}>
              <Link href={`/blog/${key}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
