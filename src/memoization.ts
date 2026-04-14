export function memoize<T extends (...args: any[]) => any>(fn: T, options: MemoizeOptions<ReturnType<T>> = {}): T
{
    const cache: Cache<ReturnType<T>> = {
        frequencyBin: new Map<number, Map<string, EntryInfo<ReturnType<T>>>>(),
        entries: new Map<string, EntryInfo<ReturnType<T>>>()
    };
    const entries = cache.entries;
    // const cache = new Map<string, ReturnType<T>>();

    return function (...args: Parameters<T>): ReturnType<T> {
        const key = JSON.stringify(args);
        let entry;

        if (entry = entries.get(key)) {
            EvictCache(cache, entry, options); // update access
            return entry.value;
        }

        const result = fn(...args);
        const newEntry: EntryInfo<ReturnType<T>> = { value: result, key };

        entries.set(key, newEntry);
        EvictCache(cache, newEntry, options); // handle eviction after adding
        return result;
    } as T;
}
type MemoizeOptions<T = any> = {
    maxCache?: number;

    evictionPolicy?: EvictionPolicy;
    lifetimeLimit?: number; // for TimeBased eviction case
    customEviction?: CustomEviction<T>;
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

    if (options.customEviction) {
        return options.customEviction(cache, entry, options);
    }
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
            return EvictTimeBased(cache, entry, options);
        }
    }
}
//////////////////////////
/// Eviction functions ///
//////////////////////////

type CustomEviction<R> = (cache: Cache<R>, entry: EntryInfo<R>, options: MemoizeOptions) => void

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
    const currentTime = Date.now();

    if (!entry.endtime) {
        entry.endtime = currentTime + (options?.lifetimeLimit ?? 0);
    }

    // Remove all expired front entries (FIFO order)
    let iterator = cache.entries.entries();
    let next = iterator.next();
    while (!next.done) {
        const [key, ent] = next.value;
        if (ent.endtime && ent.endtime <= currentTime) {
            cache.entries.delete(key);
            next = iterator.next();
        } 
        else break;
    }
}