"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface LoginError {
  username?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<LoginError>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: LoginError = {}

    if (!username.trim()) {
      newErrors.username = "Email is required"
    } else if (!username.includes('@')) {
      newErrors.username = "Please enter a valid email address"
    }

    if (!password.trim()) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Convert data to URLSearchParams for OAuth2 form data
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Login failed")
      }

      // Store the token in both localStorage and cookie
      localStorage.setItem("token", data.access_token)
      document.cookie = `token=${data.access_token}; path=/; secure; samesite=strict`
      
      // Dispatch auth state change event
      window.dispatchEvent(new Event('auth-state-changed'))
      
      // Redirect to main page
      router.push("/teams")
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "An error occurred during login"
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
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="username"
                name="username"
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={cn("mt-1", errors.username && "border-destructive")}
                placeholder="Enter your username"
                aria-invalid={!!errors.username}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn("mt-1", errors.password && "border-destructive")}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          </div>

          {errors.general && (
            <div className="text-sm text-destructive mt-2">
              {errors.general}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button
              variant="link"
              className="p-0 font-semibold text-primary hover:text-primary/80"
              onClick={() => router.push('/auth/register')}
            >
              Register here
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
