import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function authMiddleware(request: FastifyRequest, reply:FastifyReply){
    const authHeader = request.headers.authorization;

    if(!authHeader){
        return reply.status(401).send({error: "Token not provided"})
    }


    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
        return reply.status(401).send({ error: "Token mal formatted" });
    }

    const [, token] = parts;


    if (!token) {
        return reply.status(401).send({ error: "Token not provided" });
    }


    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        (request as any).user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        return;
    } catch (error) {
        return reply.status(401).send({ error: "Invalid token" });
    }
}