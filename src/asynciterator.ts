

export namespace AsyncIterator
{

    // we will split the data into chunks of the N value, than
    // we would process each chunk consecutively
    export async function* Iterate(data: any[], chunkSize: number)
    {
        let currentChunk: number;

        for await (const chunk of data)
        {
            for ()
            {

            }
            chunk
            yield chunk;
        }
    }
}
