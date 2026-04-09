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
            // EvictCache(cache, options?.evictionPolicy ?? EvictionPolicy.LRU, options, { key, accessCount: 0 });
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
    leastUsedEntry?: string;
    cache: Map<string, ReturnType<T>>();
}
type EntryInfo = {
    key: string;
    useCount: number;
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
function EvictCache(cache: Map<string, any>, policy: EvictionPolicy, options?: MemoizeOptions, info?: EntryInfo)
{
    switch (policy)
    {
        case EvictionPolicy.FIFO: {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
            break;
        }
        case EvictionPolicy.LRU: {
            const entry = cache.get(info.key)!;
            cache.delete(info.key);
            cache.set(info.key, entry);
            if (cache.size > options?.maxCache!)
            {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
            break;
        }
        case EvictionPolicy.LFU: {
            // here we would sort cache entries by amount of usage 
            // if usage count is the same the LRU policy would be applied
            // instead of the LRU type implementation we can just store the oldest entry with the least 
            // usage count and evict it
            let leastUsedEntry;
            // let secondLeastUsedEntry;
            const entry = cache.get(info.key)!;
            info.useCount += 1;
            if (!leastUsedEntry || entry.useCount < leastUsedEntry.useCount)
            {
                // secondLeastUsedEntry = leastUsedEntry;
                leastUsedEntry = entry;
            }
            if (cache.size > options?.maxCache!)
            {
                leastUsedEntry.useCount = 0;
                cache.delete(leastUsedEntry.key);
                // leastUsedEntry = secondLeastUsedEntry;
                // secondLeastUsedEntry = undefined;
            }
            break;
        }
        case EvictionPolicy.TimeBased: {

            if (options?.maxCache && cache.size > options.maxCache) {

            }
        }
    }
}