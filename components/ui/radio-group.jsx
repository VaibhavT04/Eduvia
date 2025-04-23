"use client"

import React, { createContext, useContext, useState } from 'react'
import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

const RadioGroupContext = createContext(null)

const RadioGroup = ({ 
  defaultValue, 
  value: controlledValue, 
  onChange, 
  className, 
  children, 
  ...props 
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue
  
  const handleValueChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }
  
  return (
    <RadioGroupContext.Provider value={{ value: currentValue, onChange: handleValueChange }}>
      <div className={cn("grid gap-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

const RadioGroupItem = ({ 
  value, 
  id, 
  className, 
  children, 
  ...props 
}) => {
  const group = useContext(RadioGroupContext)
  if (!group) {
    throw new Error('RadioGroupItem must be used within a RadioGroup')
  }
  
  const checked = group.value === value
  
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="radio"
        id={id}
        aria-checked={checked}
        onClick={() => group.onChange(value)}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border flex items-center justify-center",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input bg-background",
          className
        )}
        {...props}
      >
        {checked && <Circle className="h-2.5 w-2.5 fill-current text-white" />}
      </button>
      {children}
    </div>
  )
}

export { RadioGroup, RadioGroupItem } 