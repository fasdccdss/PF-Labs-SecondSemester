const globalMap = Map<string, Map<Priority, any>>;

function Enqueue() 
{

}
function Dequeue() 
{

}
function Peek(retrieve: RetrieveOptions)
{
    
}

// type GlobalMap
// PriorityMap: new Map<Priority, any>;

enum Priority 
{
    S, A, B, C, D, E, F
}
enum RetrieveOptions
{
    highest,
    lowest,
    oldest,
    newest
}