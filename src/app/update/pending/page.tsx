'use client'

import { useActionState } from 'react'
import { slowSubmit } from '../actions'

/**
 * useActionState 示例
 *
 * 演示：
 * 1. 使用 useActionState 管理 pending 状态
 * 2. 获取 Server Action 的返回值
 * 3. 自动处理 loading 状态，无需手动 setState
 */

// 包装 action 以符合 useActionState 的签名
async function submitAction(
  _prevState: { success?: boolean; message?: string; timestamp?: string } | null,
  formData: FormData
) {
  return await slowSubmit(formData)
}

export default function PendingPage() {
  // useActionState 返回 [state, formAction, pending]
  const [state, formAction, pending] = useActionState(submitAction, null)

  return (
    <div>
      <h1>useActionState 加载状态</h1>

      {/* 说明 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>特点</h2>
        <ul>
          <li>React 19 新增的 Hook，专门处理 Server Action 状态</li>
          <li>
            自动管理 <code>pending</code> 状态，无需手动 setState
          </li>
          <li>
            <code>state</code> 保存 action 的返回值
          </li>
          <li>比手动管理 loading 更简洁</li>
        </ul>
      </section>

      {/* API 说明 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>useActionState API</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`const [state, formAction, pending] = useActionState(action, initialState)

// state    - action 的返回值
// formAction - 包装后的 action（用于 form action 或 onClick）
// pending  - 是否正在执行`}
        </pre>
      </section>

      {/* 表单演示 */}
      <section
        style={{
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>演示：慢速提交</h2>
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="message">消息：</label>
            <input
              type="text"
              id="message"
              name="message"
              required
              placeholder="输入任意消息"
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label htmlFor="delay">延迟时间（毫秒）：</label>
            <select
              id="delay"
              name="delay"
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
            >
              <option value="1000">1 秒</option>
              <option value="2000">2 秒</option>
              <option value="3000">3 秒</option>
              <option value="5000">5 秒</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={pending}
            style={{
              padding: '15px',
              backgroundColor: pending ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: pending ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            {pending ? '处理中...' : '提交'}
          </button>
        </form>

        {/* 显示结果 */}
        {state && (
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: state.success ? '#c8e6c9' : '#ffcdd2',
              borderRadius: '8px',
            }}
          >
            <h3>返回结果（state）</h3>
            <pre style={{ margin: 0 }}>{JSON.stringify(state, null, 2)}</pre>
          </div>
        )}
      </section>

      {/* 与手动方式对比 */}
      <section
        style={{
          padding: '15px',
          backgroundColor: '#fce4ec',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>对比：手动 vs useActionState</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <h3>手动管理（繁琐）</h3>
            <pre
              style={{
                backgroundColor: '#263238',
                color: '#ffcdd2',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {`const [pending, setPending] = useState(false)
const [result, setResult] = useState(null)

const handleSubmit = async () => {
  setPending(true)
  try {
    const res = await action()
    setResult(res)
  } finally {
    setPending(false)
  }
}`}
            </pre>
          </div>
          <div>
            <h3>useActionState（简洁）</h3>
            <pre
              style={{
                backgroundColor: '#263238',
                color: '#c8e6c9',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {`const [state, action, pending] =
  useActionState(serverAction, null)

// 直接用！
// state = 返回值
// pending = loading 状态`}
            </pre>
          </div>
        </div>
      </section>

      {/* 代码说明 */}
      <section>
        <h2>完整代码</h2>
        <pre
          style={{
            backgroundColor: '#263238',
            color: '#aed581',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px',
          }}
        >
          {`// actions.ts
'use server'

export async function slowSubmit(formData: FormData) {
  await new Promise(r => setTimeout(r, 2000))
  return {
    success: true,
    message: formData.get('message'),
    timestamp: new Date().toISOString()
  }
}

// page.tsx
'use client'
import { useActionState } from 'react'

// 包装 action（useActionState 需要 prevState 参数）
async function submitAction(prevState, formData) {
  return await slowSubmit(formData)
}

export default function Page() {
  const [state, formAction, pending] = useActionState(submitAction, null)

  return (
    <form action={formAction}>
      <input name="message" />
      <button disabled={pending}>
        {pending ? '处理中...' : '提交'}
      </button>
      {state && <p>结果：{state.message}</p>}
    </form>
  )
}`}
        </pre>
      </section>
    </div>
  )
}
