"use client"

import * as React from "react"
import { cn } from "cn"
import { Check, ChevronRight } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"

// Simplified Dropdown Menu component for DarkBay
interface DropdownMenuProps {
  children: React.ReactNode
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  return <div className="relative">{children}</div>
}

DropdownMenu.displayName = "DropdownMenu"

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const DropdownMenuTrigger = ({ children, asChild }: DropdownMenuTriggerProps) => {
  if (asChild) {
    return <>{children}</>
  }
  return <div>{children}</div>
}

DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  className?: string
}

const DropdownMenuContent = ({ children, align = 'end', className }: DropdownMenuContentProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleToggle = () => setIsOpen(!isOpen)
  const handleClose = () => setIsOpen(false)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="relative">
      <div onClick={handleToggle}>
        {children}
      </div>
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 min-w-[8rem] bg-popover text-popover-foreground rounded-lg border border-border shadow-md p-1",
            align === 'end' && "right-0",
            align === 'start' && "left-0",
            align === 'center' && "left-1/2 -translate-x-1/2",
            className
          )}
          onClick={handleClose}
        >
          <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement<DropdownMenuItemProps>(child)) {
                return React.cloneElement(child, { onClose: handleClose })
              }
              return child
            })}
          </div>
        </div>
      )}
    </div>
  )
}

DropdownMenuContent.displayName = "DropdownMenuContent"

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  onClose?: () => void
  asChild?: boolean
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ children, onClick, disabled, className, onClose, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const handleClick = () => {
      onClick?.()
      onClose?.()
    }

    return (
      <Comp
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
