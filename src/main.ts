import { CalculateAverage } from "rngdebugger";
import { GenerateRandNumInf } from "./generator";
import { TimeoutIterator } from "./iterator";

console.log("Average: " + CalculateAverage(TimeoutIterator(GenerateRandNumInf(), 5)));
// console.log(TimeoutIterator(GenerateRandNumInf(), 5));