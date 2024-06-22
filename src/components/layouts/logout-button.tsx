"use client"
import { useAuth } from "@/hooks/use-auth"
import React from "react"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const { signOut } = useAuth()

  return (
    <DropdownMenuItem className="hover:cursor-pointer" onClick={signOut}>
      <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
      Sign out
    </DropdownMenuItem>
  )
}
