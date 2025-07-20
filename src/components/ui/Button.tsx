import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef, ReactElement, cloneElement } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  asChild?: boolean
  children?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const buttonClasses = cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-blue-700 text-white hover:bg-blue-800": variant === "primary",
        "bg-white text-black border border-gray-200 hover:bg-gray-50": variant === "secondary",
        "border border-blue-700 text-black hover:bg-blue-700 hover:text-white": variant === "outline",
        "text-blue-700 hover:bg-blue-700/10": variant === "ghost",
      },
      {
        "h-8 px-3 text-sm": size === "sm",
        "h-10 px-4 py-2": size === "md",
        "h-12 px-6 py-3 text-lg": size === "lg",
      },
      className
    )

    if (asChild && children) {
      const childElement = children as ReactElement<any>
      return cloneElement(childElement, {
        className: cn(buttonClasses, childElement.props?.className),
        ...props,
      } as any)
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }