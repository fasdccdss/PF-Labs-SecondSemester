export function memoize<T extends (...args: any[]) => any>(fn: T, options: MemoizeOptions): T
{
    const maxCache = options.maxCache ?? Infinity;
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
    useCount?: number; // for LFU eviction case
    birthtime?: number; // for TimeBased eviction case
    endtime?: number; // for TimeBased eviction case
}
enum EvictionPolicy 
{
    FIFO, // First In First Out
    LRU, // Least Recently Used
    LFU, // Least Frequently Used
    TimeBased,
    Custom
}
function EvictCache<R>(cache: Cache<R>, entry: EntryInfo<R>, options: MemoizeOptions)
{
    const policy = options?.evictionPolicy ?? EvictionPolicy.LRU;
    const entries = cache.entries;
    const key = entry.key!;
    // const entry = entries.get(key)!;
    switch (policy)
    {
        case EvictionPolicy.FIFO: {
            return EvictFIFO(cache, entry, options);
        }
        case EvictionPolicy.LRU: {
            return EvictLRU(cache, entry, options);
        }
        // track smallest bucket key, than evict from it(bucket) using LRU
        case EvictionPolicy.LFU: {
            return EvictLFU(cache, entry, options);
        }
        case EvictionPolicy.TimeBased: {
            EvictLRU(cache, entry, options); // time based eviction still has to respect the cache size
            
        }
        case EvictionPolicy.Custom: {

        }
    }
}
//////////////////////////
/// Eviction functions ///
//////////////////////////
function EvictFIFO<R>(cache: Cache<R>, entry: EntryInfo<R>, options: MemoizeOptions) 
{
    if (cache.entries.size > options?.maxCache!)
    {
        const firstKey = cache.entries.keys().next().value;
        cache.entries.delete(firstKey);
    }
}
function EvictLRU<R>(cache: Cache<R>, entry: EntryInfo<R>, options: MemoizeOptions)
{
    cache.entries.delete(entry.key);
    cache.entries.set(entry.key, entry);
    if (cache.entries.size > options?.maxCache!)
    {
        const firstKey = cache.entries.keys().next().value;
        cache.entries.delete(firstKey);
    }
}
function EvictLFU<R>(cache: Cache<R>, entry: EntryInfo<R>, options: MemoizeOptions)
{
    const entries = cache.entries;
    const key = entry.key!;

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
        if (cache.smallestUseCount == prevUseCount) {
            cache.smallestUseCount++;
        }
    }

    if (entries.size > options?.maxCache!) {
        const firstBin = cache.smallestUseCount!;
        const firstBinKey = cache.frequencyBin.get(firstBin).keys().next().value;

        cache.entries.delete(firstBinKey);
        // delete empty buckets... 
        if (cache.frequencyBin.get(firstBin).size <= 0) {
            cache.frequencyBin.delete(firstBin);
            // update smallest bucket key...
            cache.smallestUseCount++;
        }
        cache.frequencyBin.get(firstBin).delete(firstBinKey);
    }
}
function EvictTimeBased<R>(cache: Cache<R>, entry: EntryInfo<R>, options: MemoizeOptions)
{
    // for best optimization, 
    // we can just log the deletion time for each entry, caching only one value per entry and avoiding constant 
    // calculations of the entries "lifetime" running per each entry
    // and instead having a single timer that would delete all expired entries



    const currentTime = Date.now();
    entry.birthtime = currentTime;
    entry.endtime = entry.birthtime + options?.lifetimeLimit!; // :::::::::
    if (currentTime >= entry.endtime!) {
        for (const [key, entry] of cache.entries) 
        {
            if (Date.now() >= entry.endtime!) {
                cache.entries.delete(key);
            }
        }
    }
}