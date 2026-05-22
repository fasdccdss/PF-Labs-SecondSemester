// logging to external services is done if structuredLogging is enabled AND
// if there is a destinationWriter provided to the Log() function

export class Decorator
{
    static Log(logLevel: LogLevel, event: (...args: any[]) => any[], structuredLogging: boolean,
        formatter?: (info: LogInfo) => LogMessage, destinationWriter?: (output: string) => void)
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
                    let logMessage: LogMessage;
                    
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

                    // Log message construction
                    if (structuredLogging)
                    {
                        let writer = destinationWriter ?? console.debug;
                        writer(JSON.stringify(logInfo, null, 2));
                    }
                    else
                    {
                        logMessage = this.ConstructLogMessage(logInfo, formatter)

                        console.info(logMessage.functionNameMsg);
                        console.info(logMessage.entryTimeMsg);
                        console.info(logMessage.logLevelMsg);
                        console.info(logMessage.argumentsMsg);

                        console.info(logMessage.executionTimeMsg);
                        console.info(logMessage.outputMsg);

                        if (logMessage.errorMsg)
                            console.info(logMessage.errorMsg);
                    }

                    return output;
                }

                case LogLevel.DEBUG:
                {
                    let logInfo: LogInfo;
                    let logMessage: LogMessage;
                    
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

                    // Log message construction
                    if (structuredLogging)
                    {
                        let writer = destinationWriter ?? console.debug;
                        writer(JSON.stringify(logInfo, null, 2));
                    }
                    else
                    {
                        logMessage = this.ConstructLogMessage(logInfo, formatter);

                        console.debug(logMessage.functionNameMsg);
                        console.debug(logMessage.entryTimeMsg);
                        console.debug(logMessage.logLevelMsg);
                        console.debug(logMessage.argumentsMsg);
                        console.debug(logMessage.executionTimeMsg);
                        console.debug(logMessage.outputMsg);

                        if (logMessage.errorMsg)
                            console.debug(logMessage.errorMsg);
                    }

                    return output;
                }

                case LogLevel.ERROR:
                {
                    let logInfo: LogInfo;
                    let logMessage: LogMessage;

                    let caughtError: any = undefined;

                    try {
                        output = await event(...args);
                    }
                    catch (error) {
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

                    // Log message construction
                    if (structuredLogging)
                    {
                        if (caughtError)
                        {
                            let writer = destinationWriter ?? console.error;
                            writer(JSON.stringify(logInfo, null, 2));
                        }
                    }
                    else
                    {
                        logMessage = this.ConstructLogMessage(logInfo, formatter);

                        if (logMessage.errorMsg) 
                        {
                            console.error(logMessage.functionNameMsg);
                            console.error(logMessage.entryTimeMsg);
                            console.error(logMessage.logLevelMsg);
                            console.error(logMessage.argumentsMsg);
                            console.error(logMessage.executionTimeMsg);
                            console.error(logMessage.outputMsg);
                            console.error(logMessage.errorMsg);
                        }
                    }

                    return output;
                }
            }
        }
    }

    static ConstructLogMessage(logInfo: LogInfo, formatter?: (info: LogInfo) => LogMessage): LogMessage
    {
        let logMessage: LogMessage;

        if (!formatter)
            logMessage =
            {
                functionNameMsg: (`Logging function: ${logInfo.functionName}`),
                entryTimeMsg: (`Entry date: ${logInfo.entryTime}`),
                logLevelMsg: (`Log level: ${logInfo.logLevel}`),
                argumentsMsg: (`Called with: ${logInfo.arguments}`),
                outputMsg: (`Output: ${logInfo.output}`),
                executionTimeMsg: (`Execution time: ${logInfo.executionTime}ms`),
                errorMsg: logInfo.error ? (`Error caught: ${logInfo.error}`) : undefined
            }
        else
            logMessage = formatter(logInfo);

        return logMessage;
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
    executionTime: any,
    error?: any;
}

type LogMessage = 
{
    entryTimeMsg: string,
    logLevelMsg: string,
    functionNameMsg: string,
    argumentsMsg: string,
    outputMsg: string,
    executionTimeMsg: string,
    errorMsg?: string
}