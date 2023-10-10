"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

export function BaseToggle() {
  const { setTheme } = useTheme()
  const pathname = usePathname()
  console.log(pathname)
  const isGuide = pathname.startsWith("/guides/")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 px-0 ${isGuide ? "-pr-5 mt-10 md:-mr-60" : "mt-10"}`}
        >
          <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="left"
        className="mt-8 flex-col rounded-md"
        sideOffset={10}
      >
        <div className="flex">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Icons.sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Icons.moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Icons.laptop className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
