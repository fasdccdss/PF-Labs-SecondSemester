export class Decorator
{
    Log(logLevel: LogLevel, event: (...args: any[]) => any[])
    {
        return(...args: any[]) =>
        {
            console.log(`Logging function ${event.name}`);
            console.log(`Entry date: ${new Date().toISOString()}`);

            let startDate = Date.now();
            let endDate;
            let executionTime;

            let result;

            switch(logLevel)
            {
                case LogLevel.INFO:
                {
                    result = event(...args);

                    for (let x = 0; x < args.length; x++)
                    {
                        console.info(`[INFO] arg[${x}]:`, args[x]);
                    }
                    
                    break;
                }

                case LogLevel.DEBUG:
                {
                    result = event(...args);

                    console.debug(`[DEBUG] ${event.name} called with`, args);

                    break;
                }

                case LogLevel.ERROR:
                {
                    try {
                        result = event(...args);
                    } 
                    catch (error) {
                        console.error(`[ERROR] cought with ${args.length} args`, error);
                    }

                    break;
                }
            }

            // execution time profiling
            endDate = Date.now();
            executionTime = endDate - startDate;
            console.log(`Execution time: ${executionTime}`);

            console.log(`returned:`, result);
            return result;
        }
    }
}

enum LogLevel
{
    INFO,
    DEBUG,
    ERROR
}