export class AuthProxy 
{
    authMethod: AuthMethod;

    constructor(authMethod: AuthMethod) {
        this.authMethod = authMethod;
    }
}

export interface AuthMethod
{
    GetHeaders(): Record<string, string>;
}

export class ApiKey implements AuthMethod 
{
    userKey: string;

    constructor(userKey: string) {
        this.userKey = userKey;
    }

    GetHeaders(): Record<string, string>
    {
        return;
    }
}
export class OAuth implements AuthMethod 
{
    GetHeaders(): Record<string, string> {
        return;
    }
}