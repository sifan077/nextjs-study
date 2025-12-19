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
├── blog/
│   ├── layout.tsx        → /blog 布局（红色字体）
│   ├── page.tsx          → /blog
│   ├── best/
│   │   └── page.tsx      → /blog/best
│   ├── search/
│   │   └── page.tsx      → /blog/search?q=xxx
│   └── [slug]/
│       ├── page.tsx      → /blog/:slug（动态路由）
│       └── loading.tsx   → 骨架屏（Streaming）
└── theme-demo/
    ├── page.tsx          → /theme-demo（Context 演示）
    ├── theme-provider.tsx→ ThemeProvider（Client）
    └── theme-button.tsx  → ThemeButton（Client）
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

---

## Linking and Navigating

### 1. 导航工作原理
Next.js 默认服务端渲染，通过以下技术实现流畅导航：

| 技术 | 作用 |
|------|------|
| Prefetching | 提前加载用户可能访问的页面 |
| Streaming | 分块传输，先显示骨架屏再显示内容 |
| Client-side transitions | 局部更新，不整页刷新 |

### 2. Link vs a 标签
```tsx
<Link href="/blog">博客</Link>   // 客户端导航，不刷新，自动预取
<a href="/blog">博客</a>         // 整页刷新，无预取
```

观察方法：Link 点击浏览器标签页不转圈，a 标签会转圈

### 3. 两种渲染模式

| 类型 | 时机 | 预取策略 |
|------|------|---------|
| Static Rendering | 构建时 | 预取完整页面 |
| Dynamic Rendering | 请求时 | 只预取 loading.tsx |

### 4. Streaming 流式传输
用 `loading.tsx` 实现骨架屏，用户不用傻等：

```tsx
// src/app/blog/[slug]/loading.tsx
export default function Loading() {
  return <div>加载中...</div>
}
```

Next.js 自动包装 `<Suspense>`，点击立刻显示骨架屏

### 5. generateStaticParams 静态生成
类似 Redis 缓存热门数据，构建时预生成页面：

```tsx
// hello 预生成秒开，其他动态渲染要等
export async function generateStaticParams() {
  return [{ slug: 'hello' }]
}
```

配合 `revalidate` 实现定时更新（类似缓存过期）：
```tsx
export const revalidate = 60  // 60秒后重新生成
```

### 6. 慢网络处理
三层保障：
1. **Prefetch** - 提前加载（网速快时生效）
2. **loading.tsx** - 骨架屏（网速中等）
3. **useLinkStatus** - 链接转圈（网速慢，骨架屏都没加载出来）

### 7. Hydration 优化
服务端先给界面，客户端 JS 接管交互：
- Server Component：纯展示，不占 JS 体积
- Client Component：需要交互的最小部分，越小 Hydration 越快

---

## 代码改动说明

### 1. Link vs a 标签对比
文件：`src/app/blog/[slug]/page.tsx`

演示两种导航方式的区别，Link 不刷新页面，a 标签整页刷新

### 2. loading.tsx 骨架屏
文件：`src/app/blog/[slug]/loading.tsx`

动态路由加载时显示骨架屏，立刻响应用户

### 3. generateStaticParams 对比
文件：`src/app/blog/[slug]/page.tsx`

- `/blog/hello` → 预生成，秒开
- `/blog/next` → 动态渲染，等 2 秒 + 显示骨架屏

---

## Server and Client Components

### 1. 使用场景

| Client Component | Server Component |
|------------------|------------------|
| `useState`、`useEffect` | 数据库/API 查询 |
| `onClick`、`onChange` 事件 | 使用密钥、Token（不暴露给前端） |
| `localStorage`、`window` | 减少 JS 体积 |
| 自定义 hooks | 提升首屏速度 |

### 2. 工作原理

**首次加载：**
```
HTML（秒看）→ RSC Payload → JS + Hydration → 可交互
```

**后续导航：**
```
RSC Payload（预取/缓存）→ 客户端局部更新 → 可交互
```

### 3. 减少 JS 体积
只给需要交互的最小部分加 `'use client'`：

```tsx
// Layout 是 Server（默认）
export default function Layout() {
  return (
    <nav>
      <Logo />     {/* Server - 纯展示，不打包 JS */}
      <Search />   {/* Client - 有交互，打包 JS */}
    </nav>
  )
}
```

### 4. 数据传递
Server Component 通过 props 传数据给 Client Component：

```tsx
// Server Component
const post = await getPost(id)
return <LikeButton likes={post.likes} />

// Client Component - 直接用，不需要 fetch
function LikeButton({ likes }) { ... }
```

注意：props 必须可序列化（基本类型、数组、对象），不能传函数

### 5. 交错使用（Interleaving）
用 `children` 模式在 Client 中嵌套 Server：

```tsx
<Modal>        {/* Client */}
  <Cart />     {/* Server，作为 children 传入，仍是服务端渲染 */}
</Modal>
```

Server Component 的渲染永远在服务端，不管放在哪里

### 6. Context Provider
Context 需要客户端状态，Provider 必须是 Client Component：

```tsx
// theme-provider.tsx
'use client'
export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}  {/* children 可以是 Server Component */}
    </ThemeContext.Provider>
  )
}
```

### 7. 第三方组件
第三方库没有 `'use client'` 时，包一层：

```tsx
// carousel.tsx
'use client'
import { Carousel } from 'acme-carousel'
export default Carousel
```

### 8. 环境隔离

| 标记 | 作用 |
|------|------|
| `import 'server-only'` | 防止服务端代码被客户端导入 |
| `import 'client-only'` | 防止客户端代码被服务端导入 |
| 非 `NEXT_PUBLIC_` 环境变量 | 自动只在服务端可用 |

---

## 代码改动说明

### 4. Context Provider 演示
文件：`src/app/theme-demo/`

演示如何在 Next.js 中使用 React Context：
- `theme-provider.tsx` - Client Component，提供 ThemeContext
- `theme-button.tsx` - Client Component，使用 useContext 切换主题
- `page.tsx` - Server Component，组合 Provider 和 children
