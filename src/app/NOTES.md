# Next.js App Router 学习笔记

## 项目修改记录

### 1. 目录结构调整
- 将 `app/` 移动到 `src/app/`，更清晰的项目结构

### 2. 当前路由结构
```
src/app/
├── page.tsx              → /
├── layout.tsx            → 根布局
├── home/
│   └── page.tsx          → /home
└── blog/
    ├── layout.tsx        → /blog 布局（红色字体）
    ├── page.tsx          → /blog
    ├── best/
    │   └── page.tsx      → /blog/best
    ├── search/
    │   └── page.tsx      → /blog/search?q=xxx
    └── [slug]/
        └── page.tsx      → /blog/:slug（动态路由）
```

---

## 核心概念

### 1. 文件系统路由
文件夹名 = URL 路径，`page.tsx` = 可访问页面

| 文件名 | 作用 |
|--------|------|
| `page.tsx` | 页面内容 |
| `layout.tsx` | 布局（嵌套共享） |
| `loading.tsx` | 加载状态 |
| `error.tsx` | 错误边界 |
| `not-found.tsx` | 404 页面 |

### 2. 动态路由（Dynamic Segment）
用 `[参数名]` 文件夹：

```tsx
// src/app/blog/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>{slug}</h1>
}
```

对比 Spring MVC：
- Next.js: `[slug]` → Spring: `{slug}`
- Next.js: `params.slug` → Spring: `@PathVariable`

### 3. 查询参数（Search Params）
```tsx
// /blog/search?q=nextjs&page=1
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  return <p>搜索: {q}, 页码: {page}</p>
}
```

对比 Spring MVC：`@RequestParam`

### 4. Server Component vs Client Component

| | Server Component | Client Component |
|--|------------------|------------------|
| 标识 | 默认 | `'use client'` |
| 执行位置 | 服务器 | 浏览器 |
| 可以用 | async/await, 数据库, 文件系统 | useState, useEffect, 事件 |
| 代码暴露 | 不会发到浏览器 | 会打包到客户端 |

```tsx
// Server Component（默认）
export default async function Page() {
  const data = await db.query('...')  // 直接访问数据库
  return <div>{data}</div>
}

// Client Component
'use client'
export default function Button() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### 5. Link 组件
客户端导航，不刷新页面：

```tsx
import Link from 'next/link'

<Link href="/blog/hello">Hello 文章</Link>
<Link href={`/blog/${slug}`}>动态链接</Link>
```

### 6. Layout 嵌套
子路由自动继承父级 layout：

```tsx
// src/app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ color: 'red' }}>{children}</div>
}
// /blog 下所有页面都是红色字体
```

### 7. 类型辅助（PageProps / LayoutProps）
Next.js 15 自动生成类型，无需手写：

```tsx
// 之前：手动定义
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {}

// 现在：使用 PageProps（全局可用，无需 import）
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
}
```

---

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run lint     # ESLint 检查
npm run lint -- --fix  # ESLint 自动修复
```

---

## 对比 Spring MVC

| 概念 | Next.js | Spring MVC |
|------|---------|------------|
| 路由定义 | 文件夹结构 | @GetMapping |
| 路径参数 | `[slug]` | `{slug}` |
| 获取路径参数 | `params.slug` | `@PathVariable` |
| 查询参数 | `searchParams` | `@RequestParam` |
| 布局/模板 | `layout.tsx` | Thymeleaf layout |
| 数据获取 | async/await | Service 层 |
