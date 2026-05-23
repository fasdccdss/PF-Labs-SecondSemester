import { CalculateAverage } from "rngdebugger";
import { GenerateRandNumInf } from "./generator";
import { TimeoutIterator } from "./iterator";

import { EventBus } from './eventbus';
import { AsyncFilter } from './asyncfilter';

console.log("Average: " + CalculateAverage(TimeoutIterator(GenerateRandNumInf(), 5)));

// Task 7 usage example:

let testArray = [1, 2, 3, 4, 5];

// subscribe commands
EventBus.Subscribe('filter', () => AsyncFilter.asyncFilterCallback(
    testArray, AsyncFilter.randomElement, AsyncFilter.onFilterDone));
EventBus.Subscribe('filter', async () => {
    const result = await AsyncFilter.asyncFilterPromise(testArray, AsyncFilter.randomElement);
    console.log(result);
});

EventBus.PromptCommand();