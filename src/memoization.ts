export function memoize<T extends (...args: any[]) => any>(fn: T, options?: MemoizeOptions): T
{
    const maxCache = options?.maxCache ?? Infinity;
    const cache = new Map<string, ReturnType<T>>();

    return function(...args: Parameters<T>): ReturnType<T> 
    {
        const key = JSON.stringify(args);

        if (cache.has(key)) return cache.get(key);
        
        if (cache.size >= maxCache) 
        {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        const result = fn(...args);
        cache.set(key, result);
        return result;
    } as T;
}
type MemoizeOptions = {
    maxCache?: number;
    evictionPolicy?: EvictionPolicy;
};
enum EvictionPolicy 
{
    FIFO,
    LRU,
    LFU,
    TimeBased,
    Custom
}
function evictCache(cache: Map<string, any>, policy: EvictionPolicy)
{
    
}