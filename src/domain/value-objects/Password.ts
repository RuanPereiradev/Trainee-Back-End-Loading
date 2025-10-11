export class Password{
    private _password: string;

    constructor (password: string){
        if(password.length < 8){
            throw new Error("A senha deve ter no mínimo 8 caracteres")
        }
        this._password = password;
    }

    get value(): string{
        return this._password;
    }
}