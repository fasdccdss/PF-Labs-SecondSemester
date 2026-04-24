export class AuthProxy {
    authMethod: AuthMethod;

    constructor(authMethod: AuthMethod) {
        this.authMethod = authMethod;
    }

    AuthSwitch(authMethod: AuthMethod) {
        this.authMethod = authMethod;
    }

    Get(url: string) {
        return fetch(url, { headers: this.authMethod.GetHeaders() });
    }

    Post(url: string, body: any)
    {
        return fetch(url, {
            method: "POST",
            headers: {...this.authMethod.GetHeaders(), "Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
    }
}

export interface AuthMethod {
    GetHeaders(): Record<string, string>;
}

export class ApiKey implements AuthMethod {
    key: string;
    headerName: string = "X-API-Key";
    // headerName is configurable because different APIs use different key header names (e.g. "X-Auth-Token")
    constructor(userKey: string, headerName: string) {
        this.key = userKey;
        if (headerName) this.headerName = headerName;
    }

    GetHeaders(): Record<string, string> {
        return { [this.headerName]: this.key };
    }
}
export class OAuth implements AuthMethod {
    token: string;

    constructor(userToken: string) {
        this.token = userToken;
    }

    GetHeaders(): Record<string, string> {
        return { "Authorization": `Bearer ${this.token}` };
    }
}
export class JWT implements AuthMethod {
    token: string;
    expireDate: number;
    // tokenLifeTime should be typed in minutes
    constructor(userToken: string, tokenLifeTime: number) {
        this.token = userToken;
        tokenLifeTime *= 60 * 1000; // convert to minutes
        this.expireDate = Date.now() + tokenLifeTime;
    }

    GetHeaders(): Record<string, string> {
        if (Date.now() > this.expireDate)
            throw new Error("JWT token has expired");

        return { "Authorization": `Bearer ${this.token}` };
    }
}