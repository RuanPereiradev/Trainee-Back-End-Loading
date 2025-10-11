export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    private _value?: T| undefined;
    private _error?: string| undefined;

    private constructor(isSuccess: boolean, value?: T, error?: string) {
        if (isSuccess && error) {
            throw new Error("Não pode ser sucesso com erro.");
        }
        if (!isSuccess && !error) {
            throw new Error("Falha precisa ter uma mensagem de erro.");
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this._value = value;
        this._error = error;
    }

    public getValue(): T {
        if (!this.isSuccess) {
            throw new Error("Não se pode obter o valor de um resultado falho.");
        }
        return this._value as T;
    }

    public getError(): string {
        if (this.isSuccess) {
            throw new Error("Não se pode obter o erro de um resultado de sucesso.");
        }
        return this._error as string;
    }

    public static ok<U>(value?: U): Result<U> {
        return new Result<U>(true, value);
    }

    public static fail<U>(error: string): Result<U> {
        return new Result<U>(false, undefined, error);
    }
}
