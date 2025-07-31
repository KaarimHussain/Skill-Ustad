import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
  className?: string
  trackClassName?: string
  rangeClassName?: string
  thumbClassName?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({
    value: propValue,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
    disabled = false,
    className,
    trackClassName,
    rangeClassName,
    thumbClassName,
    ...props
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(propValue ?? defaultValue)
    const trackRef = React.useRef<HTMLDivElement>(null)

    // Update internal value when prop changes
    React.useEffect(() => {
      if (typeof propValue === 'number') {
        setInternalValue(propValue)
      }
    }, [propValue])

    const value = propValue ?? internalValue
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return
      setIsDragging(true)
      updateValueFromMouseEvent(e)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      updateValueFromMouseEvent(e as unknown as React.MouseEvent)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    const updateValueFromMouseEvent = (e: React.MouseEvent) => {
      if (!trackRef.current) return

      const trackRect = trackRef.current.getBoundingClientRect()
      let newValue = ((e.clientX - trackRect.left) / trackRect.width) * (max - min) + min

      // Apply step
      newValue = Math.round(newValue / step) * step

      // Clamp the value between min and max
      newValue = Math.max(min, Math.min(max, newValue))

      if (propValue === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return

      let newValue = value

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault()
          newValue = Math.min(max, value + step)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault()
          newValue = Math.max(min, value - step)
          break
        case 'Home':
          e.preventDefault()
          newValue = min
          break
        case 'End':
          e.preventDefault()
          newValue = max
          break
        default:
          return
      }

      if (propValue === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <div
          ref={trackRef}
          className={cn(
            "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary",
            trackClassName
          )}
        >
          <div
            className={cn(
              "absolute h-full bg-primary",
              rangeClassName
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className={cn(
            "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !disabled && "cursor-pointer",
            disabled && "pointer-events-none",
            thumbClassName
          )}
          style={{ left: `calc(${percentage}% - 10px)` }}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
        />
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }