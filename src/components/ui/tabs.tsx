"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
} | null>(null)

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, value: valueProp, defaultValue, onValueChange, ...props }, ref) => {
        const [value, setValue] = React.useState(valueProp || defaultValue || "")
        const currentValue = valueProp !== undefined ? valueProp : value

        const handleValueChange = React.useCallback(
            (newValue: string) => {
                if (valueProp === undefined) {
                    setValue(newValue)
                }
                onValueChange?.(newValue)
            },
            [onValueChange, valueProp]
        )

        return (
            <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
                <div ref={ref} className={cn("w-full", className)} {...props} />
            </TabsContext.Provider>
        )
    }
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, onClick, ...props }, ref) => {
        const context = React.useContext(TabsContext)
        const isActive = context?.value === value

        return (
            <button
                ref={ref}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-state={isActive ? "active" : "inactive"}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
                    className
                )}
                onClick={(e) => {
                    context?.onValueChange(value)
                    onClick?.(e)
                }}
                {...props}
            />
        )
    }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, ...props }, ref) => {
        const context = React.useContext(TabsContext)
        const isSelected = context?.value === value

        if (!isSelected) return null

        return (
            <div
                ref={ref}
                role="tabpanel"
                data-state={isSelected ? "active" : "inactive"}
                className={cn(
                    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    className
                )}
                {...props}
            />
        )
    }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
