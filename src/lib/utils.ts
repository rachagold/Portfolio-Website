import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateDescription(text: string | undefined, maxLength: number = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, text.lastIndexOf(' ', maxLength)) + ' . . .';
}
