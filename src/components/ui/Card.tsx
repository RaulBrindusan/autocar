import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx(
      'rounded-lg border shadow-sm',
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('p-6 pb-0', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={clsx('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={clsx('font-semibold leading-none tracking-tight text-black', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={clsx('text-sm text-gray-600 mt-1', className)}>
      {children}
    </p>
  )
}