import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'link'
}

function Button({ children, onClick, className = '', variant = 'primary', ...props }: ButtonProps) {
  const baseClasses = 'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'

  const variantClasses = {
    primary: 'py-2 px-4 bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-lg',
    secondary: 'py-2 px-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-lg',
    link: 'text-primary underline-offset-4 hover:underline'
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