export class Decorator
{
    Log(logLevel: LogLevel, event: (...args: any[]) => any[])
    {
        return(...args: any[]) =>
        {
            switch(logLevel)
            {
                case LogLevel.INFO:
                {
                    for (let x = 0; x < args.length; x++)
                    {

                    }
                }

                case LogLevel.DEBUG:
                {

                }
                
                case LogLevel.ERROR:
                {

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