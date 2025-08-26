interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiresIn: number;
}

class CacheManager {
    private cache = new Map<string, CacheItem<any>>();
    
    // Default cache duration: 5 minutes
    private readonly DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

    set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_CACHE_DURATION): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiresIn
        });
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }

        const now = Date.now();
        const isExpired = (now - item.timestamp) > item.expiresIn;

        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return item.data as T;
    }

    invalidate(key: string): void {
        this.cache.delete(key);
    }

    invalidatePattern(pattern: string): void {
        const regex = new RegExp(pattern);
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
    }

    clear(): void {
        this.cache.clear();
    }

    has(key: string): boolean {
        const item = this.cache.get(key);
        if (!item) return false;
        
        const now = Date.now();
        const isExpired = (now - item.timestamp) > item.expiresIn;
        
        if (isExpired) {
            this.cache.delete(key);
            return false;
        }
        
        return true;
    }
}

export const cacheManager = new CacheManager();

// Cache keys for dashboard data
export const CACHE_KEYS = {
    USER_ROADMAPS: (userId: string) => `user_roadmaps_${userId}`,
    USER_PROGRESS: (userId: string) => `user_progress_${userId}`,
    USER_BASIC_DATA: (userId: string) => `user_basic_data_${userId}`,
    PUBLIC_ROADMAPS: "public_roadmaps",
    CACHED_QUESTIONS: "cached_questions",
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
    ROADMAPS: 5 * 60 * 1000, // 5 minutes
    PROGRESS: 2 * 60 * 1000, // 2 minutes (more frequent updates)
    USER_DATA: 10 * 60 * 1000, // 10 minutes
} as const;