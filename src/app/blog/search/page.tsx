export default async function Page({searchParams}: {searchParams: Record<string, string | string[]>}) {
    // 从 searchParams 中获取 query 参数
    const query = (await searchParams)?.q || "请输入搜索查询"
    return (
      <div>
        <h1 className="font-bold">My Search Page</h1>
        <p>搜索查询: {query}</p>
      </div>
    )
  }
