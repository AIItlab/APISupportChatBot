/**
 * Utility module providing helper functions for class name management.
 *
 * This module combines clsx and tailwind-merge for efficient Tailwind CSS class handling.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values and merges Tailwind classes efficiently.
 *
 * @param inputs - Array of class values (strings, objects, or arrays)
 * @returns Merged and optimized class string
 *
 * Usage:
 * ```ts
 * cn('px-2 py-1', { 'bg-blue-500': isActive }, 'text-white')
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
