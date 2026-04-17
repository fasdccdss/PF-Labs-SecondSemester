let keyCounter = 0;

const priorityBins = new Map<Priority, Map<number, Entry<any>>>();
const allEntries = new Map<number, Entry<any>>();

/* FUNCTIONS */
function Enqueue<T>(value: T, priority: Priority) 
{
    const key = generateKey();
    const entry = { key, value, priority };

    if (!priorityBins.has(priority)) priorityBins.set(priority, new Map());
    
    priorityBins.get(priority)!.set(key, entry);
    allEntries.set(key, entry);
}
function Dequeue(retrieveMode: RetrieveMode) 
{
    switch (retrieveMode) 
    {

    }
}
function Peek(retrieveMode: RetrieveMode)
{
    switch (retrieveMode) 
    {

    }
}

function generateKey(): number {
    return ++keyCounter;
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
enum RetrieveMode
{
    highest,
    lowest,
    oldest,
    newest
}