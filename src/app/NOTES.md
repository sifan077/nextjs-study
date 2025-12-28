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
```html
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

---

## Cache Components（缓存组件）

> 需要在 `next.config.js` 中设置 `cacheComponents: true` 启用

### 1. 核心概念

传统 SSR 的两难困境：

| 方案 | 优点 | 缺点 |
|-----|------|------|
| 静态页面 (SSG) | 超快，CDN 直接返回 | 数据可能过时 |
| 动态页面 (SSR) | 数据实时新鲜 | 每次请求都要计算，慢 |
| 客户端渲染 (CSR) | 服务器压力小 | JS bundle 大，首屏慢 |

**Cache Components 解决方案**：在同一个页面混合静态、缓存、动态内容

```
┌─────────────────────────────────────┐
│         静态 HTML Shell             │  ← 立即发送（极快）
│  ┌─────────────┬─────────────────┐  │
│  │   静态内容   │   缓存内容       │  │  ← 预渲染好的
│  ├─────────────┴─────────────────┤  │
│  │        动态内容                 │  │  ← 请求时流式填充
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 2. 内容分类

构建时自动判断组件的"性质"：

| 操作类型 | 示例 | 能否预渲染 |
|---------|------|-----------|
| 同步文件读取 | `fs.readFileSync()` | ✅ 自动 |
| 模块导入 | `import('./constants.json')` | ✅ 自动 |
| 纯计算 | `array.map()`, `JSON.parse()` | ✅ 自动 |
| 网络请求 | `fetch('https://api...')` | ❌ 需显式处理 |
| 读取 cookies/headers | `cookies()`, `headers()` | ❌ 需显式处理 |

### 3. 两种处理方式

无法预渲染的组件必须显式处理，否则报错：`Uncached data was accessed outside of <Suspense>`

| 方式 | 指令/组件 | 效果 | 适用场景 |
|-----|----------|------|---------|
| 延迟渲染 | `<Suspense>` | 先显示 fallback，数据 ready 后替换 | 需要实时数据（用户信息） |
| 缓存结果 | `use cache` | 缓存输出，加入静态 Shell | 不依赖请求数据（商品列表） |

### 4. Suspense 延迟渲染

```tsx
export default async function Page() {
  return (
    <>
      <h1>Part of the static shell</h1>     {/* ✅ 进入静态 Shell */}

      <Suspense fallback={<p>Loading..</p>}> {/* fallback 进入静态 Shell */}
        <DynamicContent />                   {/* ❌ 请求时才渲染 */}
      </Suspense>
    </>
  )
}
```

**关键原则**：Suspense 边界要尽量小，只包裹真正需要的部分

**并行优势**：多个 Suspense 边界之间互不阻塞，可以并行加载

### 5. 动态内容（需要 Suspense）

```tsx
async function DynamicContent() {
  // ❌ 这些都不会自动预渲染
  const data = await fetch('https://api.example.com/data')  // 网络请求
  const users = await db.query('SELECT * FROM users')       // 数据库查询
  const file = await fs.readFile('..', 'utf-8')            // 异步文件读取

  return <div>...</div>
}
```

**注意**：预渲染在遇到 `fetch` 时就停了，后面的代码构建时不执行

### 6. 运行时数据（只能用 Suspense）

这类数据必须等用户请求到来才能知道：

| API | 数据来源 | Java 类比 |
|-----|---------|----------|
| `cookies()` | 用户浏览器 Cookie | `request.getCookies()` |
| `headers()` | 请求头 | `request.getHeader()` |
| `searchParams` | URL 查询参数 | `request.getParameter()` |
| `params` | 动态路由参数 | `@PathVariable` |

**重要**：运行时数据不能用 `use cache`（每个用户数据不同，缓存会造成数据泄露）

### 7. 非确定性操作

`Math.random()`、`Date.now()`、`crypto.randomUUID()` 等每次执行结果都不同

| 方式 | 效果 | 适用场景 |
|-----|------|---------|
| `await connection()` + Suspense | 每个请求生成新值 | 订单号、验证码 |
| `use cache` | 缓存固定值，所有请求相同 | 每日随机推荐 |

```tsx
async function UniqueContent() {
  await connection()  // ← 告诉 Next.js：等请求来了再执行
  const uuid = crypto.randomUUID()  // 每个请求不同
  return <div>{uuid}</div>
}
```

### 8. use cache 指令

缓存异步函数/组件的返回值：

```tsx
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'           // ← 启用缓存
  cacheLife('hours')    // ← 设置缓存时长

  const users = await db.query('SELECT * FROM users')
  return <ul>...</ul>
}
```

**应用级别**：函数级、组件级、文件级

**自动缓存键**：参数 + 闭包变量 = 缓存键（类似 Spring 的 `@Cacheable(key = "#category")`）

### 9. cacheLife 自定义配置

```tsx
cacheLife({
  stale: 3600,      // 1小时后标记为"陈旧"
  revalidate: 7200, // 2小时后重新验证
  expire: 86400,    // 1天后过期删除
})
```

时间线：

| 阶段 | 用户体验 | 后台行为 |
|-----|---------|---------|
| < stale | 秒返回 | 啥都不干 |
| stale ~ revalidate | 秒返回（旧数据） | 偷偷刷新 |
| revalidate ~ expire | 要等一下 | 刷新完才给你 |
| > expire | 要等一下 | 缓存没了，重新来 |

### 10. revalidateTag 手动刷新

```tsx
import { cacheTag, revalidateTag } from 'next/cache'

// 1. 给缓存打标签
export async function getPosts() {
  'use cache'
  cacheTag('posts')  // ← 打上 'posts' 标签
}

// 2. 需要时使标签失效
export async function createPost(post: FormData) {
  'use server'
  // 写入新数据
  revalidateTag('posts')  // ← 让所有 'posts' 标签的缓存失效
}
```

类似 Spring 的 `@CacheEvict(cacheNames = "posts")`

### 11. 如何决定缓存什么？

核心思路：从用户体验的 loading 状态反推

| 场景 | 选择 |
|-----|------|
| 数据不依赖用户，可多个请求共享 | `use cache` + `cacheLife` |
| CMS 内容，有更新机制 | 长缓存 + `revalidateTag` 手动刷新 |
| 必须实时、依赖用户 | `<Suspense>` |

### 12. 综合示例

```tsx
export default function BlogPage() {
  return (
    <>
      {/* 1️⃣ 静态内容 - 自动预渲染 */}
      <header>
        <h1>Our Blog</h1>
        <nav>...</nav>
      </header>

      {/* 2️⃣ 缓存动态内容 - 进入静态 Shell */}
      <BlogPosts />

      {/* 3️⃣ 运行时动态内容 - 请求时流式加载 */}
      <Suspense fallback={<p>Loading...</p>}>
        <UserPreferences />
      </Suspense>
    </>
  )
}

// 所有用户看到相同内容（每小时刷新）
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <ul>...</ul>
}

// 每个用户不同（读 cookies）
async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  return <aside>Your theme: {theme}</aside>
}
```

渲染时间线：

| 组件 | 类型 | 用户体验 |
|-----|------|---------|
| `<header>` | 静态 | 立即可见 |
| `<BlogPosts />` | 缓存动态 | 立即可见（缓存数据） |
| `<UserPreferences />` | 运行时动态 | 先 fallback，再替换 |

### 13. Activity 导航（状态保持）

启用 `cacheComponents` 后，导航时组件状态会保留：

| 行为 | 传统导航 | Activity 导航 |
|-----|---------|--------------|
| 离开页面时 | 组件卸载 | 组件隐藏 |
| 返回页面时 | 重新挂载（状态重置） | 重新显示（状态保留） |

保留的状态：
- 表单输入内容
- 展开/折叠状态
- 滚动位置
- useState 本地状态

类似 LRU 缓存：保留最近访问的几个路由，太旧的会从 DOM 移除

---

## 对比 Java 缓存

| 概念 | Next.js | Java/Spring |
|------|---------|-------------|
| 启用缓存 | `'use cache'` | `@Cacheable` |
| 缓存键 | 参数自动成为键 | `key = "#param"` |
| 缓存时长 | `cacheLife()` | `ttl` 配置 |
| 手动失效 | `revalidateTag()` | `@CacheEvict` |
| 缓存标签 | `cacheTag()` | `cacheNames` |

---

## 代码改动说明

### 5. Cache Components 示例
文件夹：`src/app/cache/`

```
src/app/cache/
├── layout.tsx        → 统一布局（导航栏）
├── page.tsx          → /cache 首页（概念介绍）
├── static/
│   └── page.tsx      → /cache/static 静态内容示例
├── dynamic/
│   └── page.tsx      → /cache/dynamic 动态内容示例
├── use-cache/
│   └── page.tsx      → /cache/use-cache 缓存示例
├── runtime/
│   └── page.tsx      → /cache/runtime 运行时数据示例
└── combined/
    └── page.tsx      → /cache/combined 综合示例
```

#### layout.tsx
- 为所有 `/cache/*` 页面提供统一导航
- 静态内容，自动预渲染

#### static/page.tsx
- 演示自动预渲染的内容：静态数据、纯计算、模块导入
- 构建时间戳展示（刷新不变）

#### dynamic/page.tsx
- 演示 Suspense 处理动态内容
- 两个慢速组件（2秒、3秒）并行加载
- Loading 骨架屏展示

#### use-cache/page.tsx
- `use cache` 指令用法说明
- `cacheLife` 配置详解（预设 + 自定义）
- `cacheTag` 和 `revalidateTag` 手动刷新

#### runtime/page.tsx
- `cookies()` 读取用户 Cookie
- `headers()` 读取请求头
- `searchParams` URL 查询参数
- 访问 `/cache/runtime?name=张三&age=25` 测试

#### combined/page.tsx
- 三种内容混合的完整示例
- StaticHeader（静态）- 立即显示
- CachedProductList（缓存）- 商品列表
- DynamicUserInfo（动态）- 用户信息，Suspense 包裹
- 可设置 Cookie 测试动态效果

---

## Fetching Data（数据获取）

### 1. Server Components 获取数据

三种方式：

| 方式 | 示例 | Java 类比 |
|-----|------|----------|
| `fetch` API | 调用外部 REST API | `RestTemplate` / `WebClient` |
| ORM/数据库 | Prisma、Drizzle 查询 | JPA / MyBatis |
| 文件系统 | `fs.readFile()` | `Files.readString()` |

```tsx
// Server Component（默认）- 直接 async/await
export default async function Page() {
  const data = await fetch('https://api.example.com/posts')
  const posts = await data.json()
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

// ORM 直接查询（代码不会发到浏览器，安全）
const allPosts = await db.select().from(posts)
```

### 2. Client Components 获取数据

两种方式：

| 方式 | 特点 | 适用场景 |
|-----|------|---------|
| `use` hook | React 19 原生，配合 Suspense | 数据从 Server 传下来 |
| SWR / React Query | 功能丰富（缓存、重试、轮询） | 生产环境推荐 |

**use hook 模式：**
```tsx
// Server Component - 不 await，传 Promise
export default function Page() {
  const posts = getPosts()  // 返回 Promise
  return (
    <Suspense fallback={<Loading />}>
      <Posts posts={posts} />
    </Suspense>
  )
}

// Client Component - 用 use 解包 Promise
'use client'
import { use } from 'react'
function Posts({ posts }) {
  const allPosts = use(posts)  // 解包 Promise
  return <ul>...</ul>
}
```

**SWR 模式：**
```tsx
'use client'
import useSWR from 'swr'

const { data, error, isLoading } = useSWR('/api/posts', fetcher)
```

### 3. 请求去重与缓存

三个层级：

| 层级 | 机制 | 范围 | 生效方式 |
|-----|------|------|---------|
| Request Memoization | 自动 | 单次渲染 | `fetch` 自动合并相同请求 |
| React `cache` | 手动 | 单次渲染 | 包装 ORM 函数 |
| Data Cache | 手动 | 跨请求 | `cache: 'force-cache'` |

```tsx
// fetch 自动去重（同一渲染中）
// 组件 A 和 B 都调用，只发 1 次请求
await fetch('/api/user')

// ORM 用 cache 包装实现去重
import { cache } from 'react'
export const getPost = cache(async (id) => {
  return await db.query.posts.findFirst({ where: eq(posts.id, id) })
})
```

### 4. Streaming 流式传输

**整页 Loading：** `loading.js`
```
app/blog/
├── page.tsx      → 页面
└── loading.tsx   → 加载状态（自动被 Suspense 包装）
```

**细粒度 Loading：** `<Suspense>`
```tsx
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
```

### 5. 串行 vs 并行获取

**串行（有依赖）：**
```tsx
const artist = await getArtist(username)  // 先等这个
return (
  <>
    <h1>{artist.name}</h1>
    <Suspense fallback={<Loading />}>
      <Playlists artistID={artist.id} />  {/* 再获取这个 */}
    </Suspense>
  </>
)
```

**并行（无依赖）：**
```tsx
// 同时发起两个请求
const [posts, users] = await Promise.all([
  getPosts(),
  getUsers()
])
```

### 6. Preload 预加载

场景：条件渲染，但数据获取不依赖条件

```tsx
export default async function Page({ params }) {
  const { id } = await params

  preload(id)  // 1️⃣ 立即启动（不等待）
  const isAvailable = await checkIsAvailable()  // 2️⃣ 同时检查条件

  return isAvailable ? <Item id={id} /> : null  // 3️⃣ 数据可能已 ready
}

const preload = (id) => {
  void getItem(id)  // void = 执行但不等待
}
```

### 7. 对比 Java

| 概念 | Next.js | Java/Spring |
|------|---------|-------------|
| Server 获取数据 | async/await 直接用 | Controller + Service |
| 请求去重 | 自动 / React cache | 一级缓存 / Redis |
| 流式传输 | Suspense + Streaming | WebFlux / SSE |
| 预加载 | void + cache | CompletableFuture |
| 客户端获取 | SWR / React Query | 前端 axios |

---

## 代码改动说明

### 6. Fetching Data 示例
文件夹：`src/app/fetch/`

```
src/app/fetch/
├── layout.tsx        → 统一布局（导航栏）
├── page.tsx          → /fetch 首页（概念介绍）
├── server/
│   └── page.tsx      → Server Component 获取数据
├── client/
│   ├── page.tsx      → Server Component（传 Promise）
│   └── posts-list.tsx→ Client Component（use hook 解包）
├── streaming/
│   ├── page.tsx      → Streaming 流式传输示例
│   └── loading.tsx   → 整页 loading 骨架屏
└── preload/
    ├── page.tsx      → Preload 预加载示例
    └── loading.tsx   → 骨架屏（searchParams 需要）
```

#### layout.tsx
- 为所有 `/fetch/*` 页面提供统一导航
- 静态内容，自动预渲染

#### page.tsx（首页）
- 概念介绍：Server vs Client 获取数据
- 对比表格
- Java 代码对比

#### server/page.tsx
- **React cache 去重**：`getUsers` 被多个组件调用，只执行一次
- **缓存对比**：`force-cache` vs `no-store`
- **connection()**：标记动态边界，允许使用 `new Date()`
- **Suspense 包裹**：每个异步组件独立 loading

```tsx
// 关键代码
import { connection } from 'next/server'

async function CachedApiDemo() {
  await connection()  // 标记动态边界
  const res = await fetch(url, { cache: 'force-cache' })
  const fetchTime = new Date().toISOString()  // 现在可以用了
}
```

#### client/page.tsx + posts-list.tsx
- **use hook 模式**：Server 传 Promise，Client 用 `use()` 解包
- 演示数据流：`getPosts()` 不 await → Promise 作为 props → `use(posts)` 解包

```tsx
// page.tsx (Server)
const posts = getPosts()  // 不 await
return (
  <Suspense fallback={<Skeleton />}>
    <PostsList posts={posts} />
  </Suspense>
)

// posts-list.tsx (Client)
'use client'
const allPosts = use(posts)  // 解包 Promise
```

#### streaming/page.tsx + loading.tsx
- **loading.tsx**：导航时立即显示整页骨架屏
- **串行获取**：`getArtist()` 必须先等，因为后续依赖 `artistID`
- **并行 Suspense**：`Playlists` 和 `Recommendations` 用独立 Suspense，并行加载

```tsx
const artist = await getArtist(username)  // 阻塞
return (
  <>
    <h1>{artist.name}</h1>  {/* 立即显示 */}
    <Suspense><Playlists artistID={artist.id} /></Suspense>  {/* 并行 */}
    <Suspense><Recommendations /></Suspense>  {/* 并行 */}
  </>
)
```

#### preload/page.tsx + loading.tsx
- **Preload 优化**：条件渲染场景，数据获取与条件检查并行
- **模式切换**：URL 参数 `?mode=preload` vs `?mode=serial` 对比耗时
- **loading.tsx**：因为用了 `searchParams`（运行时数据），需要 Suspense 边界

```tsx
preload(id)  // 立即启动（不等待）
const isAvailable = await checkAvailability(id)  // 同时检查
if (isAvailable) {
  const product = await getProduct(id)  // 数据可能已 ready
}

// preload 函数
const preload = (id) => {
  void getProduct(id)  // void = 执行但不等待
}
```

---

## 踩坑记录

### 1. `new Date()` 必须在动态数据源之后

```tsx
// ❌ 错误：new Date() 在 fetch 之前
const time = new Date()
await fetch(url)

// ✅ 正确：先 connection() 或 fetch(no-store)，再 new Date()
await connection()
const time = new Date()
```

**原因**：Next.js 预渲染需要知道"动态边界"，`new Date()` 是非确定性操作

### 2. 运行时数据必须在 Suspense 内

`searchParams`、`cookies()`、`headers()` 等运行时数据，必须：
- 用 `<Suspense>` 包裹，或
- 放在有 `loading.tsx` 的路由段内

```
Error: Uncached data was accessed outside of <Suspense>
```

### 3. `force-cache` 不算动态边界

```tsx
// force-cache 的 fetch 是缓存的，不触发动态边界
await fetch(url, { cache: 'force-cache' })
const time = new Date()  // ❌ 仍然会报错

// 需要显式标记
await connection()  // ✅ 告诉 Next.js 这是动态内容
const time = new Date()
```

---

## Updating Data（数据更新）

### 1. 核心概念

| 概念 | 说明 |
|------|------|
| **Server Function** | 在服务器上执行的异步函数，客户端通过网络请求调用 |
| **Server Action** | 用于数据变更场景的 Server Function（本质相同，叫法不同） |

```
传统方式：前端 → fetch('/api/xxx') → API Route → 数据库
Server Action：前端 → serverAction() → 数据库（省去 API 层）
```

### 2. 创建 Server Function

两种方式使用 `'use server'` 指令：

```ts
// 方式1：文件顶部声明（推荐）
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // 写入数据库...
}

export async function deletePost(formData: FormData) {
  // ...
}

// 方式2：函数内部声明
export async function createPost(formData: FormData) {
  'use server'
  // ...
}
```

**注意**：必须是 `async` 函数

### 3. 在不同组件中使用

| 组件类型 | 能否定义 | 能否使用 | 说明 |
|----------|----------|----------|------|
| Server Component | ✅ 可内联定义 | ✅ | 支持渐进增强（无 JS 也能提交） |
| Client Component | ❌ 不能定义 | ✅ 导入/props | 需要 JS 加载后才能提交 |

**Server Component 内联定义：**
```tsx
export default function Page() {
  async function createPost(formData: FormData) {
    'use server'
    // ...
  }
  return <form action={createPost}>...</form>
}
```

**Client Component 导入使用：**
```tsx
'use client'
import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

**通过 props 传递：**
```tsx
// Server Component
<ClientForm action={createPost} />

// Client Component
function ClientForm({ action }: { action: (formData: FormData) => void }) {
  return <form action={action}>...</form>
}
```

### 4. 调用方式

| 方式 | 组件类型 | 特点 |
|------|----------|------|
| Form action | Server & Client | 自动获取 FormData，支持渐进增强 |
| Event Handler | Client only | 可获取返回值，需要 JS |

**Form 方式：**
```tsx
<form action={createPost}>
  <input name="title" />
  <button type="submit">Submit</button>
</form>

// Server Action 自动接收 FormData
async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
}
```

**Event Handler 方式：**
```tsx
'use client'

export function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <button onClick={async () => {
      const updatedLikes = await incrementLike()  // 获取返回值
      setLikes(updatedLikes)
    }}>
      Like ({likes})
    </button>
  )
}
```

### 5. useActionState（显示加载状态）

React 19 新增的 Hook，专门处理 Server Action 状态：

```tsx
'use client'
import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'

export function Button() {
  const [state, action, pending] = useActionState(createPost, null)
  //     ↑       ↑        ↑
  //   返回值  包装后的   是否执行中
  //          action

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? 'Loading...' : 'Create Post'}
    </button>
  )
}
```

| 返回值 | 类型 | 说明 |
|--------|------|------|
| `state` | any | Server Action 的返回值 |
| `action` | function | 包装后的 action（带状态追踪） |
| `pending` | boolean | 是否正在执行 |

**对比 useSWR：**

| 特性 | useActionState | useSWR |
|------|----------------|--------|
| 用途 | 数据变更（增删改） | 数据获取（查询） |
| 触发 | 手动调用 | 自动 + 可手动 |
| 缓存 | ❌ | ✅ 自动缓存 |

### 6. 缓存重验证

更新数据后需要清除缓存，让页面显示最新数据：

```ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  'use server'
  // 1. 写入数据库
  await db.post.create({ data: {...} })

  // 2. 清除缓存（二选一）
  revalidatePath('/posts')       // 按路径
  revalidateTag('posts')         // 按标签
}
```

| 方法 | 用途 | 示例 |
|------|------|------|
| `revalidatePath(path)` | 按路径清除 | `revalidatePath('/posts')` |
| `revalidateTag(tag)` | 按标签清除 | `revalidateTag('posts')` |

**revalidateTag 需要先打标签：**
```ts
// 获取数据时打标签
fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
})

// 更新后按标签清除
revalidateTag('posts')
```

### 7. 重定向

```ts
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  'use server'
  await db.post.create({ data: {...} })

  revalidatePath('/posts')  // ⚠️ 必须在 redirect 之前！
  redirect('/posts')        // 抛异常实现跳转，后面代码不执行
}
```

**重要**：`redirect` 内部通过抛异常实现，后面的代码不会执行

### 8. Cookies 操作

```ts
import { cookies } from 'next/headers'

export async function exampleAction() {
  'use server'
  const cookieStore = await cookies()

  // 读取
  const value = cookieStore.get('name')?.value

  // 设置
  cookieStore.set('name', 'value', {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24  // 24小时
  })

  // 删除
  cookieStore.delete('name')
}
```

设置/删除 cookie 后页面会**自动重新渲染**

### 9. 渐进增强（Progressive Enhancement）

| 场景 | Server Component | Client Component |
|------|------------------|------------------|
| JS 未加载 | 传统表单提交（页面刷新） | 排队等待，JS 加载后再提交 |
| JS 已加载 | AJAX 无刷新 | AJAX 无刷新 |

**优点**：网络慢/JS 禁用时也能用，对 SEO 友好

### 10. 对比 Java

| Next.js | Java Spring |
|---------|-------------|
| `'use server'` | `@PostMapping` |
| `formData.get('title')` | `@RequestParam` / `request.getParameter()` |
| `revalidatePath()` | 手动清除 Redis 缓存 |
| `redirect('/path')` | `return "redirect:/path"` |
| `cookies()` | `HttpServletRequest/Response` |

### 11. 关键点总结

1. Server Action **只能用 POST 方法**调用
2. **必须是 async 函数**
3. Client Component **不能定义**，只能导入使用
4. 多个 Server Action 在客户端是**串行执行**的
5. `redirect` 会抛异常，`revalidatePath` **必须在它之前**调用
6. Server Component 中的表单支持**渐进增强**（无 JS 也能用）

---

## 代码改动说明

### 7. Updating Data 示例
文件夹：`src/app/update/`

```
src/app/update/
├── layout.tsx        → 统一布局（导航栏）
├── actions.ts        → 所有 Server Actions 定义
├── page.tsx          → /update 首页（概念介绍）
├── form/
│   └── page.tsx      → Form 表单提交示例
├── event/
│   └── page.tsx      → Event Handler 示例
├── pending/
│   └── page.tsx      → useActionState 示例
└── revalidate/
    └── page.tsx      → revalidate/redirect/cookies 示例
```

#### actions.ts
- **文件顶部 `'use server'`**：所有导出函数都是 Server Action
- **模拟内存数据库**：posts 数组、likes 计数
- **createPost / deletePost**：Form action 示例
- **incrementLike / decrementLike**：Event Handler 示例，有返回值
- **slowSubmit**：慢速提交，演示 pending 状态
- **updateDataWithRevalidatePath**：revalidatePath 示例
- **updateAndRedirect**：redirect 示例（注意顺序）
- **setThemeCookie / getThemeCookie / deleteThemeCookie**：Cookies 操作

#### form/page.tsx
- **Server Component**：直接 await getPosts() 获取数据
- **form action**：绑定 createPost，自动获取 FormData
- **隐藏字段**：删除按钮用 `<input type="hidden" name="id">` 传 ID
- **revalidatePath**：提交后自动刷新列表

#### event/page.tsx
- **Client Component**：使用 useState 管理状态
- **onClick 调用**：`await incrementLike()` 获取返回值
- **手动 loading**：useState 管理 pending 状态
- **对比表格**：Form action vs Event Handler

#### pending/page.tsx
- **useActionState**：React 19 新 Hook
- **三个返回值**：`[state, formAction, pending]`
- **自动 pending**：无需手动 setState
- **对比代码**：手动方式 vs useActionState

#### revalidate/page.tsx
- **Suspense 包裹**：cookies() 是运行时数据，必须用 Suspense
- **DataDisplay / ThemeDisplay**：拆分成独立异步组件
- **revalidatePath**：点击按钮更新数据并刷新页面
- **redirect**：演示正确顺序（revalidate 在前）
- **Cookies 操作**：设置 Light/Dark 主题

---

## 踩坑记录

### 4. cookies() 必须在 Suspense 内

```tsx
// ❌ 错误：直接在页面组件读取 cookies
export default async function Page() {
  const theme = await getThemeCookie()  // 会报错
}

// ✅ 正确：拆分成独立组件，用 Suspense 包裹
async function ThemeDisplay() {
  const theme = await getThemeCookie()
  return <span>{theme}</span>
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ThemeDisplay />
    </Suspense>
  )
}
```

**原因**：cookies() 是运行时数据，每个请求不同，无法预渲染

### 5. Form action 返回值类型必须是 void

```tsx
// ❌ 错误：返回对象会导致类型错误
export async function createPost(formData: FormData) {
  'use server'
  return { success: true }  // Type error!
}

// ✅ 正确：返回 void 或 Promise<void>
export async function createPost(formData: FormData): Promise<void> {
  'use server'
  // 处理逻辑...
  revalidatePath('/posts')
}
```

**原因**：form action 的类型签名是 `(formData: FormData) => void | Promise<void>`

---

## Caching and Revalidating（缓存与重验证）

### 1. 核心概念

| 概念 | 说明 |
|------|------|
| **Caching** | 存储数据获取结果，后续请求直接返回缓存 |
| **Revalidating** | 更新缓存条目，无需重建整个应用 |

### 2. Next.js 16 缓存 API

| API | 用途 |
|-----|------|
| `fetch + cache/revalidate` | 缓存 HTTP 请求 |
| `'use cache'` | 缓存任意函数/组件（数据库、计算等） |
| `cacheTag()` | 为缓存打标签 |
| `revalidateTag()` | 按标签清除缓存 |
| `revalidatePath()` | 按路径清除缓存 |

### 3. fetch 缓存控制

```tsx
// 默认：不缓存（但可能预渲染 HTML）
const data = await fetch('https://...')

// 强制缓存
const data = await fetch('https://...', { cache: 'force-cache' })

// 不缓存
const data = await fetch('https://...', { cache: 'no-store' })

// 定时重验证（60秒后）
const data = await fetch('https://...', { next: { revalidate: 60 } })

// 打标签（支持按需刷新）
const data = await fetch('https://...', {
  cache: 'force-cache',
  next: { tags: ['posts'] }
})
```

### 4. use cache + cacheTag

适用于**任意服务端操作**（数据库、文件、计算），不仅限于 fetch：

```tsx
import { cacheTag } from 'next/cache'

async function getProducts() {
  'use cache'              // 启用缓存
  cacheTag('products')     // 打标签

  const products = await db.query('SELECT * FROM products')
  return products
}
```

**自动缓存键**：函数参数自动成为缓存键

```tsx
async function getProductById(id: string) {
  'use cache'
  cacheTag(`product-${id}`)
  return db.query('SELECT * FROM products WHERE id = ?', [id])
}

// getProductById('1') 和 getProductById('2') 分别缓存
```

### 5. revalidateTag vs revalidatePath

| 方法 | 粒度 | 适用场景 |
|------|------|----------|
| `revalidateTag('posts')` | 按标签 | 清除所有相关数据（跨多个页面） |
| `revalidatePath('/posts')` | 按路径 | 清除特定页面 |

```tsx
// 场景：更新商品信息，商品可能在多个页面显示

// 方式1：按路径（需要知道所有页面）
revalidatePath('/products')
revalidatePath('/products/123')
revalidatePath('/')

// 方式2：按标签（更简洁）
revalidateTag('products')  // 一次清除所有
```

### 6. fetch vs use cache 对比

| 特性 | fetch 缓存 | use cache |
|------|-----------|-----------|
| 适用范围 | HTTP 请求 | 任意操作（数据库、计算、文件） |
| 打标签 | `next: { tags: [] }` | `cacheTag()` |
| 缓存键 | URL | 函数参数自动成为键 |
| 定时重验证 | `next: { revalidate: N }` | `cacheLife()` |

### 7. 对比 Java Spring

| Next.js | Java Spring |
|---------|-------------|
| `'use cache'` | `@Cacheable` |
| `cacheTag('name')` | `@Cacheable(cacheNames = "name")` |
| `revalidateTag('name')` | `@CacheEvict(cacheNames = "name")` |
| `revalidatePath('/path')` | 手动清除特定缓存键 |

---

## 代码改动说明

### 8. Caching and Revalidating 示例
文件夹：`src/app/caching/`

```
src/app/caching/
├── layout.tsx        → 统一布局（导航栏）
├── actions.ts        → revalidateTag/revalidatePath 操作
├── page.tsx          → /caching 首页（概念介绍）
├── fetch/
│   └── page.tsx      → fetch 缓存控制示例
└── use-cache/
    └── page.tsx      → use cache + cacheTag 示例
```

#### fetch/page.tsx
- **force-cache**：强制缓存，刷新时间戳不变
- **no-store**：不缓存，每次时间戳都变
- **revalidate: 60**：60秒后重验证
- **tags: ['posts']**：打标签，支持 revalidateTag 清除

#### use-cache/page.tsx
- **getProducts()**：`'use cache'` + `cacheTag('products')`
- **getStats()**：同一个 tag，revalidateTag 会一起清除
- **按钮操作**：revalidateTag / revalidatePath 对比
