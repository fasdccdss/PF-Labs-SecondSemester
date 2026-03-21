export function CalculateAverage(numbers: number[]): number
{
    let sum = 0; 
    for (let x = 0; x < numbers.length; x++)
    { 
        sum += numbers[x];
    }
    let average = sum / numbers.length;
    return average;
}