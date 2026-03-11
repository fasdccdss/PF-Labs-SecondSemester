function TimeoutIterator(iterator: Iterator<number>, timeoutSeconds: number)
{
    let start = Date.now();
    let timeout = timeoutSeconds * 1000; // convert to milliseconds

    while (Date.now() - start < timeout) {
        
    }
}