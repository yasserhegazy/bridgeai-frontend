"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/shared/SearchBar"
import { CardGrid } from "@/components/shared/CardGrid"

export default function TeamsList() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // ✅ Check token from cookie
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) {
      router.replace("/auth/login")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return <p>Loading...</p>

  // ✅ Sample team data (replace with real backend data later)
  const teams = [
    { id: 1, name: "Team Alpha", lastUpdate: "Sep 10, 2025", members: ["Sarah", "Omar", "Lina", "Ali"], status: "Active" },
    { id: 2, name: "Team Beta", lastUpdate: "Sep 5, 2025", members: ["Omar", "Hana"], status: "Completed" },
    { id: 3, name: "Team Gamma", lastUpdate: "Sep 7, 2025", members: ["Ali", "Sara", "Lina"], status: "Pending" },
  ]

  return (
    <div className="max-w-6xl mx-auto mt-14 px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-semibold tracking-tight">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all teams for your organization in one place.
          </p>
        </div>
      </div>

      <div className="flex items-center bg-[#fafafb] p-4 justify-between mb-7 w-full max-w-7xl mx-auto gap-3 rounded">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <SearchBar placeholder="Search teams by name" />
          <Button variant="primary" size="sm">Filters</Button>
        </div>
        <Button variant="primary">Add Team</Button>
      </div>

      <CardGrid items={teams} />
    </div>
  )
}
