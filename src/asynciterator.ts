

export namespace AsyncIterator
{

    // we will split the data into chunks of the N value, than
    // we would process each chunk consecutively
    export async function* Iterate(data: any[], chunkSize: number)
    {
        let currentChunk: number;
        currentChunk = 0;
        let chunk: any[];

        for await (chunk of data)
        {
            let x = currentChunk * chunkSize + 1;
            let y = currentChunk * chunkSize + 1 + chunkSize;
            for (x; x < y; x++)
            {
                chunk[x - 1] = data[x - 1];
            }
            
            currentChunk += 1;
            yield chunk;
        }
    }
}
