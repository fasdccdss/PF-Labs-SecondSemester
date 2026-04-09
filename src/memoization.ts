export function memoize<T extends (...args: any[]) => any>(fn: T, options?: MemoizeOptions): T
{
    const maxCache = options?.maxCache ?? Infinity;
    const cache: Cache<ReturnType<T>> = {
        frequencyBin: new Map<number, Map<string, EntryInfo<ReturnType<T>>>>(),
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
            // entry.key = key;
            // EvictCache(cache, options?.evictionPolicy ?? EvictionPolicy.LRU, options, { key, accessCount: 0 });
            return entry;
        }
        if (entries.size >= maxCache) 
        {
            const firstKey = entries.keys().next().value;
            entries.delete(firstKey);
        }
        
        const result = fn(...args);
        entries.set(key, { value: result, key });
        return result;
    } as T;
}
type MemoizeOptions = {
    maxCache?: number;

    evictionPolicy?: EvictionPolicy;
    lifetimeLimit?: number; // for TimeBased eviction case
};
type Cache<T> = {
    smallestUseCount?: number; // for LFU eviction case
    frequencyBin: Map<number, Map<string, EntryInfo<T>>>; // for LFU eviction case 
    entries: Map<string, EntryInfo<T>>;
}
type EntryInfo<T> = {
    value: T;
    key: string;
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
function EvictCache<R>(cache: Cache<R>, entry: EntryInfo<R>, options?: MemoizeOptions)
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
            let prevUseCount = entry.useCount ?? 0;
            entry.useCount = prevUseCount + 1;
            if (cache.smallestUseCount === undefined) cache.smallestUseCount = entry.useCount;

            // add to new bucket
            if (!cache.frequencyBin.has(entry.useCount)) {
                cache.frequencyBin.set(entry.useCount, new Map<string, EntryInfo<R>>());
            }
            cache.frequencyBin.get(entry.useCount)?.set(key, entry); 

            // remove from old bucket
            cache.frequencyBin.get(prevUseCount)?.delete(key); 

            // delete empty buckets... 
            if (cache.frequencyBin.get(prevUseCount)?.size <= 0) {
                cache.frequencyBin.delete(prevUseCount);

                // store smallest bucket key...
                if (cache.smallestUseCount === prevUseCount) {
                    cache.smallestUseCount = entry.useCount;
                }
            }

            if (entries.size > options?.maxCache!) {
                const firstBin = cache.frequencyBin.keys().next().value;
                const firstBinKey = cache.frequencyBin.get(firstBin).keys().next().value;
                
                cache.entries.delete(firstBinKey);
                cache.frequencyBin.get(firstBin).delete(firstBinKey);
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