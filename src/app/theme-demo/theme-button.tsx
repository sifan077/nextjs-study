'use client'

import { useTheme } from './theme-provider'

export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: '1px solid',
        borderRadius: '4px',
        background: theme === 'light' ? '#333' : '#fff',
        color: theme === 'light' ? '#fff' : '#333',
      }}
    >
      当前: {theme === 'light' ? '☀️ 亮色' : '🌙 暗色'} - 点击切换
    </button>
  )
}
