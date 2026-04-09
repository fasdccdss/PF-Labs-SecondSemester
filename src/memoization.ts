export function memoize<T extends (...args: any[]) => any>(fn: T, options?: MemoizeOptions): T
{
    const maxCache = options?.maxCache ?? Infinity;
    const cache: Cache<ReturnType<T>> = {
        entries: new Map<string, EntryInfo<ReturnType<T>>>()
    };
    const entries = cache.entries;
    // const cache = new Map<string, ReturnType<T>>();

    return function(...args: Parameters<T>): ReturnType<T> 
    {
        const key = JSON.stringify(args);
        let entry;

        if (entry = entries.get(key)) 
        {
            // todo: need to check if an eviction policy is size based
            // options?.maxCache && options.evictionPolicy != EvictionPolicy.TimeBased; 
            entry.key = key;
            // EvictCache(cache, options?.evictionPolicy ?? EvictionPolicy.LRU, options, { key, accessCount: 0 });
            return entry;
        }
        if (entries.size >= maxCache) 
        {
            const firstKey = entries.keys().next().value;
            entries.delete(firstKey);
        }
        
        const result = fn(...args);
        entries.set(key, { value: result });
        return result;
    } as T;
}
type MemoizeOptions = {
    maxCache?: number;

    evictionPolicy?: EvictionPolicy;
    lifetimeLimit?: number; // for TimeBased eviction case
};
type Cache<T> = {
    leastUsedEntry?: EntryInfo<T>;
    leastUsageCount?: number;
    entries: Map<string, EntryInfo<T>>;
}
type EntryInfo<T> = {
    value: T;
    key?: string;
    useCount?: number;
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
function EvictCache(cache: Cache<ReturnType<any>>, entry: EntryInfo<ReturnType<any>>, options?: MemoizeOptions)
{
    const policy = options?.evictionPolicy ?? EvictionPolicy.LRU;
    const entries = cache.entries;
    const key = entry.key!;
    // const entry = entries.get(key)!;
    switch (policy)
    {
        case EvictionPolicy.FIFO: {
            const firstKey = entries.keys().next().value;
            entries.delete(firstKey);
            break;
        }
        case EvictionPolicy.LRU: {
            // const entry = entries.get(key)!;
            entries.delete(key);
            entries.set(key, entry);
            if (entries.size > options?.maxCache!)
            {
                const firstKey = entries.keys().next().value;
                entries.delete(firstKey);
            }
            break;
        }
        case EvictionPolicy.LFU: {
            // here we would sort cache entries by amount of usage 
            // if usage count is the same the LRU policy would be applied
            // instead of the LRU type implementation we can just store the oldest entry with the least 
            // usage count and evict it

            // fuck maps, was right from the start

            // let secondLeastUsedEntry;
            entries.delete(key);
            entries.set(key, entry);
            entry.useCount += 1;
            if (!cache.leastUsedEntry || entry.useCount < cache.leastUsedEntry.useCount)
            {
                // secondLeastUsedEntry = leastUsedEntry;
                cache.leastUsageCount = entry.useCount;
                cache.leastUsedEntry = entry;
            }
            else
            {
                cache.leastUsedEntry = entries.keys().next().value; 
            }
            if (entries.size > options?.maxCache!)
            {
                entries.delete(cache.leastUsedEntry.key);
                // leastUsedEntry = secondLeastUsedEntry;
                // secondLeastUsedEntry = undefined;
            }
            break;
        }
        case EvictionPolicy.TimeBased: {

            if (options?.maxCache && entries.size > options.maxCache) {
                const firstKey = entries.keys().next().value;
                entries.delete(firstKey);
            }
        }
    }
}