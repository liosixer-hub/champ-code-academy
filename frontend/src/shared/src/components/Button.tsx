import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'link'
}

function Button({ children, onClick, className = '', variant = 'primary', ...props }: ButtonProps) {
  const baseClasses = 'transition-colors'

  const variantClasses = {
    primary: 'py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
    secondary: 'py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50',
    link: 'text-blue-600 hover:underline'
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button