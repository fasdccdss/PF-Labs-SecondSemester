

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

async function UsageExample() 
{
    const dataset = Array.from({ length: 1_000_000 }, (_, i) => i + 1);
    let total = 0;

    for await (const chunk of AsyncIterator.Iterate(dataset, 1000))
    {
        const sum = chunk.reduce((acc, val) => acc + val, 0);
        total += chunk.length;
        console.log(`Processed ${total} items, chunk sum: ${sum}`);
    }
}