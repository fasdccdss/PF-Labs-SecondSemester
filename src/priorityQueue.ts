let keyCounter = 0;

const priorityBins = new Map<Priority, PriorityMap>();
const allEntries = new Map<number, Entry<any>>();

/* FUNCTIONS */
function generateKey(): number 
{
    return ++keyCounter;
}

function Enqueue<T>(value: T, priority: Priority) 
{
    const key = generateKey();
    const entry = { key, value, priority };

    if (!priorityBins.has(priority)) priorityBins.set(priority, {newestKey: key, map: new Map() });
    
    const bin = priorityBins.get(priority)!;
    bin.newestKey = key;
    bin.map.set(key, entry);
}
function Peek(retrieveHighestPriority: boolean, retrieveOldestEntry: boolean): Entry<any>
{
    if (allEntries.size == 0) return null;

    const priorityKey = RetrievePriorityMap(retrieveHighestPriority);
    const entryKey = RetrieveMapEntry(priorityKey, retrieveOldestEntry);
    return allEntries.get(entryKey)!;
}
function Dequeue(retrieveHighestPriority: boolean, retrieveOldestEntry: boolean): Entry<any>
{
    const entry = Peek(retrieveHighestPriority, retrieveOldestEntry);
    if (entry == null) return null;

    // remove from priority bin
    const bin = priorityBins.get(entry.priority)!;
    bin.map.delete(entry.key);
    if (bin.map.size == 0) priorityBins.delete(entry.priority);
    // AND from all entries map
    allEntries.delete(entry.key);

    return entry;
}

function RetrievePriorityMap(retrieveHighest: boolean): number 
{
    let priorityKey: Priority | undefined;

    for (const priority of priorityBins.keys())
    {
        if (priorityKey === undefined) priorityKey = priority;
        else if (retrieveHighest && priority < priorityKey) priorityKey = priority;
        else if (!retrieveHighest && priority > priorityKey) priorityKey = priority;
    }
    return priorityKey!;
}
function RetrieveMapEntry(priorityKey: number, retrieveOldest: boolean): number
{
    const bin = priorityBins.get(priorityKey)!;

    if (retrieveOldest)
    {
        return bin.map.keys().next().value;
    }
    else 
    {
        return bin.newestKey;
    }
}

/* TYPES */
type PriorityMap =
{
    newestKey: number;
    map: Map<number, Entry<any>>;
}
type Entry<T = any> = {
    key: number;
    value: T;
    priority: Priority;
};

/* ENUMS */
enum Priority 
{
    S, A, B, C, D, E, F
}
