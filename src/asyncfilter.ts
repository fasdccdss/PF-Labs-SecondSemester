/////////////
// Summary:
// asyncPredicate HAS to return a Promise;
// We write our own array.filter function that works in async
// instead of trying to convert the original array.fiter function
/////////////

import { RandIntInRange } from "./generator";

type AsyncPredicate<T> = (item: T, index: number, array: Array<T>) => Promise<boolean>;
type Callback<T> = (error: Error | null, result: Array<T> | null) => void

/* PREDICATE*/
const randomElement: AsyncPredicate<number> = async (item) => {
    await new Promise(resolve => setTimeout(resolve, 100)); // wait time, useless, here only for example
    return RandIntInRange(0, 1) == 1;
}

/* PROMISE */
async function asyncFilterPromise<T>(
    array: Array<T>, 
    asyncPredicate: AsyncPredicate<T>,
    abortSignal?: AbortSignal
)
{

    const results = await Promise.all(array.map((item, index) => 
    { 
        if (abortSignal?.aborted) throw new Error("Filter operation aborted");
        return asyncPredicate(item, index, array);
    }));

    return array.filter((_blank, index) => results[index]);
}

/* CALLBACK */
function asyncFilterCallback<T> ( 
    array: Array<T>,
    asyncPredicate: AsyncPredicate<T>,
    callback: Callback<T>,
    abortSignal?: AbortSignal
) 
{
    Promise.all(array.map((item, index) => 
    {
        if (abortSignal?.aborted) throw new Error("Filter operation aborted");
        return asyncPredicate(item, index, array)
    }))
    .then(results => {
        const filtered = array.filter((_blank, index) => results[index]);
        callback(null, filtered);
    }).catch(err => callback(err, null))
}

// Usage examples:
const nums = [1, 2, 3, 4, 5];

// Promise
asyncFilterPromise(nums, randomElement).then(result => console.log(result));

// Callback
function onFilterDone(error: Error | null, result: Array<number> | null) {
    if (error) {
        console.error("Error:", error);
        return;
    }
    console.log(result);
}
asyncFilterCallback(nums, randomElement, onFilterDone);
