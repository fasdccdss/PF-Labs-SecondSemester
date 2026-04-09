export function memoize<T extends (...args: any[]) => any>(fn: T, options?: MemoizeOptions): T
{
    const maxCache = options?.maxCache ?? Infinity;
    const cache = new Map<string, ReturnType<T>>();

    return function(...args: Parameters<T>): ReturnType<T> 
    {
        const key = JSON.stringify(args);

        if (cache.has(key)) 
        {
            // todo: need to check if an eviction policy is size based
            // options?.maxCache && options.evictionPolicy != EvictionPolicy.TimeBased; 
            if (cache.size >= maxCache)
            {
                EvictCache(cache, options?.evictionPolicy ?? EvictionPolicy.FIFO, options, { key, accessCount: 0 });
            }
            return cache.get(key);
        }
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
    lifetimeLimit?: number; // for TimeBased eviction case

};
type CacheInfo = {
    key: string;
    accessCount: number;
    lifetime?: number;
}
enum EvictionPolicy 
{
    FIFO, // First In First Out
    LRU, // Least Recently Used
    LFU, // Least Frequently Used
    TimeBased,
    Custom
}
function EvictCache(cache: Map<string, any>, policy: EvictionPolicy, options?: MemoizeOptions, info?: CacheInfo)
{
    switch (policy)
    {
        case EvictionPolicy.FIFO:
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
            break;
        case EvictionPolicy.LRU:
            const entry = cache.get(info.key)!;
    }
}