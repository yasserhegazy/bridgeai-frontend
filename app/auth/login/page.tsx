"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn, getRoleBasedRedirectPath } from "@/lib/utils"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{username?: string; password?: string; general?: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setErrors({})

    try {
      const formData = new URLSearchParams()
      formData.append("username", username)
      formData.append("password", password)

      const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Login failed")
      }

      // ✅ Validate response has required fields
      if (!data.access_token) {
        throw new Error("Invalid response: missing access token")
      }
      
      if (!data.role) {
        throw new Error("Invalid response: missing user role")
      }

      // ✅ Save token and role in cookies (without secure flag for localhost)
      document.cookie = `token=${data.access_token}; path=/; max-age=86400`
      document.cookie = `role=${data.role}; path=/; max-age=86400`

      console.log("✅ Token stored in cookie, role:", data.role)
      
      // ✅ Dispatch auth state change event
      window.dispatchEvent(new Event('auth-state-changed'));
      
      // ✅ Redirect based on role
      router.push(getRoleBasedRedirectPath(data.role))

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "An error occurred during login",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground">Email</label>
              <Input
                id="username"
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {errors.general && (
            <div className="text-sm text-destructive">{errors.general}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button
              variant="link"
              className="p-0 font-semibold text-primary hover:text-primary/80"
              onClick={() => router.push('/register')}
            >
              Register here
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}