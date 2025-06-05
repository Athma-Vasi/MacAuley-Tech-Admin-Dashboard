import { None, Option, Some } from "ts-results";

abstract class AppErrorBase<Data = unknown> {
    abstract readonly _tag: string;
    public readonly name: string;
    public readonly message: string;
    public readonly data: Option<Data>;
    public readonly stack: Option<string>;
    public readonly timestamp: number;

    constructor(name: string, message: string, data?: Data) {
        this.name = name;
        this.message = message;
        this.data = data == null ? None : Some(data);
        this.stack = typeof new Error().stack === "string"
            ? Some(new Error().stack ?? "")
            : None;
        this.timestamp = Date.now();
    }
}

class JSONError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "JSONError";

    constructor(data?: Data) {
        super("JSONError", "An error occurred while parsing JSON data.", data);
    }
}

class ParseError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "ParseError";

    constructor(data?: Data) {
        super("ParseError", "An error occurred while parsing data.", data);
    }
}

class NetworkError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "NetworkError";

    constructor(data?: Data) {
        super(
            "NetworkError",
            "An error occurred while making a network request.",
            data,
        );
    }
}

class TokenDecodeError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "TokenDecodeError";

    constructor(data?: Data) {
        super(
            "TokenDecodeError",
            "An error occurred while decoding a token.",
            data,
        );
    }
}

class TimeoutError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "TimeoutError";

    constructor(data?: Data) {
        super(
            "TimeoutError",
            "An error occurred while waiting for a response.",
            data,
        );
    }
}

class AbortError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "AbortError";

    constructor(data?: Data) {
        super(
            "AbortError",
            "An error occurred while aborting a request.",
            data,
        );
    }
}

class PromiseRejectedError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "PromiseRejectedError";
    public readonly reason: unknown;

    constructor(reason: unknown, data?: Data) {
        super(
            "PromiseRejectedError",
            "A promise was rejected.",
            data,
        );
        this.reason = reason;
    }
}

class InvariantError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "InvariantError";

    constructor(data: string = "Invariant condition violated") {
        super(
            "InvariantError",
            data,
        );
    }
}

class CacheError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "CacheError";

    constructor(data?: Data) {
        super(
            "CacheError",
            "An error occurred while accessing the cache.",
            data,
        );
    }
}

class HTTPError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "HTTPError";
    public readonly status: number;

    constructor(status: number, data?: Data) {
        super(
            "HTTPError",
            "An error occurred while making an HTTP request.",
            data,
        );
        this.status = status;
    }
}

class UnknownError<Data = unknown> extends AppErrorBase<Data> {
    readonly _tag = "UnknownError";

    constructor(data?: Data) {
        super(
            "UnknownError",
            "An unknown error occurred.",
            data,
        );
    }
}

export type AppError<Data = unknown> =
    | AbortError<Data>
    | CacheError<Data>
    | HTTPError<Data>
    | InvariantError<Data>
    | JSONError<Data>
    | NetworkError<Data>
    | ParseError<Data>
    | PromiseRejectedError<Data>
    | TimeoutError<Data>
    | TokenDecodeError<Data>
    | UnknownError<Data>;

export {
    AbortError,
    AppErrorBase,
    CacheError,
    HTTPError,
    InvariantError,
    JSONError,
    NetworkError,
    ParseError,
    PromiseRejectedError,
    TimeoutError,
    TokenDecodeError,
    UnknownError,
};
