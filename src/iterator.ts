export function TimeoutIterator(iterator: Iterator<number>, timeoutSeconds: number)
{
    let start = Date.now();
    let timeout = timeoutSeconds * 1000; // convert to milliseconds
    let values: number[] = [];

    while (Date.now() - start < timeout)
    {
        const result = iterator.next();
        if (result.done) break;

        values.push(result.value);
        console.log(result.value);
    }

    return values;
}