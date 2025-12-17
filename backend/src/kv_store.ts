/**
 * Simple Key-Value Store Implementation for Node.js
 * Uses file system for persistence (development only)
 * For production, consider using Redis, PostgreSQL, or Supabase Storage
 */

import * as fs from 'fs';
import * as path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'storage');
const STORAGE_FILE = path.join(STORAGE_DIR, 'kv_store.json');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// In-memory cache for better performance
const memoryCache = new Map<string, any>();

// Load existing data from file
function loadFromFile(): void {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      for (const [key, value] of Object.entries(parsed)) {
        memoryCache.set(key, value);
      }
    }
  } catch (error) {
    console.warn('Failed to load KV store from file:', error);
  }
}

// Save data to file
function saveToFile(): void {
  try {
    const data = Object.fromEntries(memoryCache);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save KV store to file:', error);
  }
}

// Load data on module initialization
loadFromFile();

/**
 * Set a value in the KV store
 */
export async function set(key: string, value: any): Promise<void> {
  memoryCache.set(key, value);
  saveToFile();
}

/**
 * Get a value from the KV store
 */
export async function get(key: string): Promise<any> {
  return memoryCache.get(key);
}

/**
 * Delete a value from the KV store
 */
export async function del(key: string): Promise<boolean> {
  const existed = memoryCache.delete(key);
  if (existed) {
    saveToFile();
  }
  return existed;
}

/**
 * Check if a key exists in the KV store
 */
export async function has(key: string): Promise<boolean> {
  return memoryCache.has(key);
}

/**
 * Get all keys in the KV store
 */
export async function keys(): Promise<string[]> {
  return Array.from(memoryCache.keys());
}

/**
 * Clear all data from the KV store
 */
export async function clear(): Promise<void> {
  memoryCache.clear();
  saveToFile();
}