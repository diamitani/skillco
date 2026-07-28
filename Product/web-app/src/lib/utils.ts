import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price to display
export function formatPrice(price: number, currency: string = 'usd'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  })
  return formatter.format(price / 100)
}

// Format date
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Get risk level color
export function getRiskColor(level: string): string {
  const colors: Record<string, string> = {
    safe: 'text-success bg-success/10',
    low: 'text-success bg-success/10',
    medium: 'text-warning bg-warning/10',
    high: 'text-error bg-error/10',
    critical: 'text-error bg-error/10',
  }
  return colors[level] || 'text-mist'
}
