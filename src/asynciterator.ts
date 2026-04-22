

export namespace AsyncIterator
{
    export async function* Iterate(dataArray: any[], chunkSize: number)
    {
        for (let x = 0; x < dataArray.length; x += chunkSize)
        {
            const chunk = [];
            // prevent going over data length on the last chunk by using Math.min
            for (let y = x; y < Math.min(x + chunkSize, dataArray.length); y++)
            {
                chunk.push(dataArray[y]);
            }

            yield chunk;
        }
    }
}
