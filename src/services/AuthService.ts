import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = "1h";

export class AuthService{

    













    // static async hashPassword(password: string): Promise<string>{
    //     const saltRounds = 10;
    //     return await bcrypt.hash(password, saltRounds);
    // }
    // static async comparePassword(password: string, hash: string): Promise<Boolean>{
    //     return await bcrypt.compare(password, hash);
    // }
    // static generateToken(payload: object): string{
    //     return jwt.sign(payload, JWT_SECRET,{expiresIn: JWT_EXPIRES_IN});
    // }
    // static verifyToken(token: string): any{
    //     try{
    //         return jwt.verify(token, JWT_SECRET);
    //     }catch{
    //         return null;
    //     }
    // }
}