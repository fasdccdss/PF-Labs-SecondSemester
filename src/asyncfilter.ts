/////////////
// Summary:
// checkMethod HAS to return a Promise;
// We write our own array.filter function that works in async 
// instead of trying to convert the original array.fiter function
/////////////
/* PROMISE */
async function asyncFilterPromise<T>( array: Array<T>, checkMethod: (item: T) => Promise<boolean> )
{
    const results = await Promise.all(array.map((item) => checkMethod(item)));

    return array.filter((_blank, index) => results[index]);
}

// Usage example:

/* CALLBACK */
function asyncFilterCallback<T> ( 
    array: Array<T>,
    checkMethod: (item: T) => Promise<boolean>,
    callback: (error: Error | null, result: Array<T> | null) => void
)
{

}

// Usage example: