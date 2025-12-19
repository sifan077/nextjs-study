'use client'

import { createContext, useContext, useState } from 'react'

// 创建 Context
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

// Provider 组件
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        style={{
          background: theme === 'light' ? '#fff' : '#333',
          color: theme === 'light' ? '#333' : '#fff',
          minHeight: '200px',
          padding: '20px',
          transition: 'all 0.3s',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// 自定义 Hook，方便使用
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
