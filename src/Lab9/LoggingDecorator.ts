export class Decorator
{
    Log(logLevel: LogLevel, event: (...args: any[]) => any[], formatter)
    {
        return async (...args: any[]) =>
        {
            let startDate = Date.now();
            let endDate;
            let executionTime;

            let output;

            switch(logLevel)
            {
                case LogLevel.INFO:
                {
                    let logInfo: LogInfo;
                    
                    let caughtError: any = undefined;

                    try {
                        output = await event(...args);
                    } catch (error) {
                        caughtError = error;
                    }

                    // execution time profiling
                    endDate = Date.now();
                    executionTime = endDate - startDate;

                    logInfo = 
                    {
                        functionName: event.name,
                        entryTime: new Date().toISOString(),
                        logLevel: logLevel,
                        arguments: args,
                        output: output,
                        executionTime: executionTime,
                        error: caughtError
                    }

                    if (!formatter)
                    {
                        console.info(`Logging function`, logInfo.functionName);
                        console.info(`Entry date:`, logInfo.entryTime);
                        console.info(`Log level:`, logInfo.logLevel);
                        console.info(`Called with:`, logInfo.arguments);

                        if (logInfo.error)
                            console.info(`Error caught: ${logInfo.error}`);

                        console.info(`Execution time: ${logInfo.executionTime}ms`);
                        console.info(`output:`, logInfo.output);
                    }
                    else 
                    {
                        formatter(logInfo);
                    }

                    return output;
                }

                case LogLevel.DEBUG:
                {
                    console.debug(`Logging function ${event.name}`);
                    console.debug(`Entry date: ${new Date().toISOString()}`);
                    console.debug(`Log level: [DEBUG]`);
                    console.debug(`Called with:`, args);

                    try {
                        output = await event(...args);
                    } catch (error) {
                        console.debug(`Error caught: ${error}`);
                    }

                    // execution time profiling
                    endDate = Date.now();
                    executionTime = endDate - startDate;
                    console.debug(`Execution time: ${executionTime}ms`);

                    console.debug(`returned:`, output);

                    return output;
                }

                case LogLevel.ERROR:
                {
                    try 
                    {
                        output = await event(...args);
                    } 
                    catch (error) 
                    {
                        console.error(`Logging function ${event.name}`);
                        console.error(`Entry date: ${new Date().toISOString()}`);
                        console.error(`Log level: [ERROR]`);

                        console.error(`[ERROR] cought with ${args.length} args`, error); // the only useful thing we log basically

                        // execution time profiling
                        endDate = Date.now();
                        executionTime = endDate - startDate;
                        console.error(`Execution time: ${executionTime}ms`);

                        return;
                    }

                    console.log(`returned:`, output);
                    return output;
                }
            }
        }
    }
}

enum LogLevel
{
    INFO,
    DEBUG,
    ERROR
}

type LogInfo = 
{
    entryTime: string,
    logLevel: LogLevel;
    functionName: string,
    arguments: any[],
    output: any,
    executionTime:any,
    error?: any;
}