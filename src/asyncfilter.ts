/////////////
// Summary:
// checkMethod HAS to return a Promise;
// We write our own array.filter function that works in async 
// instead of trying to convert the original array.fiter function
/////////////
async function FFFF( array: Array<any>, checkMethod: (item: any) => Promise<boolean> )
{
    const results = await Promise.all(array.map((item) => checkMethod(item)));

    return array.filter((item, index) => results[index]);
}