/////////////
// Summary:
// checkMethod HAS to return a Promise;
// We write our own array.filter function that works in async 
// instead of trying to convert the original array.fiter function
/////////////

type AsyncPredicate<T> = (item: T) => Promise<boolean>;
type Callback<T> = (error: Error | null, result: Array<T> | null) => void

/* PROMISE */
async function asyncFilterPromise<T>(array: Array<T>, asyncPredicate: AsyncPredicate<T>)
{
    const results = await Promise.all(array.map((item) => asyncPredicate(item)));

    return array.filter((_blank, index) => results[index]);
}

// Usage example:

/* CALLBACK */
function asyncFilterCallback<T> ( 
    array: Array<T>,
    asyncPredicate: AsyncPredicate<T>,
    callback: Callback<T> 
) 
{
    Promise.all(array.map((item) => asyncPredicate(item)))
    .then(results => {
        const filtered = array.filter((_blank, index) => results[index]);
        callback(null, filtered);
    }).catch(err => callback(err, null))
}

// Usage example: