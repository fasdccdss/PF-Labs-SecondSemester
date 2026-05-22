export class Decorator
{
    Log(logLevel: LogLevel, event: (...args: any[]) => any[])
    {
        return async (...args: any[]) =>
        {
            let startDate = Date.now();
            let endDate;
            let executionTime;

            let result;

            switch(logLevel)
            {
                case LogLevel.INFO:
                {
                    console.info(`Logging function ${event.name}`);
                    console.info(`Entry date: ${new Date().toISOString()}`);
                    console.info(`Log level: [INFO]`);
                    console.info(`Called with:`, args);
                    
                    result = await event(...args);

                    endDate = Date.now();
                    executionTime = endDate - startDate;
                    console.info(`Execution time: ${executionTime}ms`);

                    console.info(`returned:`, result);
                    return result;
                }

                case LogLevel.DEBUG:
                {
                    console.debug(`Logging function ${event.name}`);
                    console.debug(`Entry date: ${new Date().toISOString()}`);
                    console.debug(`Log level: [DEBUG]`);
                    console.debug(`Called with:`, args);

                    result = await event(...args);

                    // execution time profiling
                    endDate = Date.now();
                    executionTime = endDate - startDate;
                    console.debug(`Execution time: ${executionTime}ms`);

                    console.debug(`returned:`, result);

                    return result;
                }

                case LogLevel.ERROR:
                {
                    try 
                    {
                        result = await event(...args);
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

                    console.log(`returned:`, result);
                    return result;
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
    level: LogLevel;

}