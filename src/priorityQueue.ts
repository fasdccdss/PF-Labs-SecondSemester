let keyCounter = 0;

const priorityBins = new Map<Priority, Map<number, Entry<any>>>();
const allEntries = new Map<number, Entry<any>>();

/* FUNCTIONS */
function generateKey(): number {
    return ++keyCounter;
}
function Enqueue<T>(value: T, priority: Priority) 
{
    const key = generateKey();
    const entry = { key, value, priority };

    if (!priorityBins.has(priority)) priorityBins.set(priority, new Map());
    
    priorityBins.get(priority)!.set(key, entry);
    allEntries.set(key, entry);
}
function Dequeue(retrieveHighestPriority: boolean, retrieveOldestEntry: boolean) 
{

}
function Peek(retrieveHighestPriority: boolean, retrieveOldestEntry: boolean)
{
    // retrieveHighestPriority?
    // retrieveOldest?

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
        return bin.keys().next().value;
    }
    else 
    {
        let lastKey!: number;
        for (const key of bin.keys()) lastKey = key;
        return lastKey;
    }
}

/* TYPES */
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
/*
enum RetrievePriority
{
    highest,
    lowest
}
enum RetrieveMode {
    oldest,
    newest
}
*/