"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/Button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium hidden",
                caption_dropdowns: "flex justify-center gap-4 w-full",
                nav: "hidden",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "hidden",
                nav_button_next: "hidden",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary-600 text-white hover:bg-primary-600 hover:text-white focus:bg-primary-600 focus:text-white",
                day_today: "bg-accent text-accent-foreground",
                day_outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                Dropdown: ({ value, onChange, children, ...props }: React.ComponentProps<"select">) => {
                    const options = React.Children.toArray(children) as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>[]
                    const selected = options.find((child) => String(child.props.value) === String(value))
                    const handleChange = (value: string) => {
                        const changeEvent = {
                            target: { value },
                        } as React.ChangeEvent<HTMLSelectElement>
                        onChange?.(changeEvent)
                    }
                    return (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-auto gap-1 text-sm font-medium p-2 hover:bg-accent hover:text-accent-foreground">
                                    {selected?.props?.children}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 max-h-[300px] overflow-y-auto bg-white">
                                <div className="flex flex-col p-1">
                                    {(props.name === "years" ? [...options].reverse() : options).map((option) => (
                                        <div
                                            key={option.props.value as string}
                                            className={cn(
                                                "cursor-pointer px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                                                String(option.props.value) === String(value) && "bg-accent text-accent-foreground font-medium"
                                            )}
                                            onClick={() => handleChange(option.props.value as string)}
                                        >
                                            {option.props.children}
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )
                },
            }}
            captionLayout="dropdown"
            fromYear={1900}
            toYear={new Date().getFullYear()}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
