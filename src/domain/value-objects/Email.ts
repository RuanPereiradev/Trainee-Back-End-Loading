export class Email{
    private _email: string;

    constructor(email: string){
        if(!this.validateEmail(email)){
            throw new Error("Email inválido")
        }
        this._email = email;
    }
    private validateEmail(email: string): boolean{
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    get value(): string {
        return this._email;}
}