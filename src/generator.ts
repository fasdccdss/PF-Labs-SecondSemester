// "ACORN" random number generator
// https://grokipedia.com/page/acorn_random_number_generator
const M = 2 ** 30; // modulus; increase the degree for more precision
const maxOrder = 10; // increase for more precision
// const maxOP1 = maxOrder + 1;
const baseSeed = 1234567; // only odd numbers > 100k should be used, small first elements otherwise

const seedsOne: number[] = [];
for (let x = 0; x <= maxOrder; x++) {
    seedsOne.push(baseSeed + x * 2); // multiply by 2 to ensure odd numbers
}
const seedsTwo: number[] = [];
for (let x = 0; x <= maxOrder; x++) {
    seedsTwo.push(baseSeed + x * 4); // 4 for different values
}
export function* GenerateRandNum()
{
    for (let x = 1; x <= maxOrder; x++) 
    {
        seedsOne[x] = (seedsOne[x] + seedsOne[x - 1]);
        seedsTwo[x] = (seedsTwo[x] + seedsTwo[x - 1]);
        if (seedsTwo[x] >= M) 
        {
            seedsTwo[x] -= M;
            seedsOne[x] += 1;
        }
        if (seedsOne[x] >= M) 
        {
            seedsOne[x] -= M;
        }
    }

    let randomNumber = (seedsOne[maxOrder] + seedsTwo[maxOrder] / M) / M;
    yield randomNumber;
}
export function* GenerateRandNumInf()
{
    while (true) {
        yield* GenerateRandNum();
    } 
}