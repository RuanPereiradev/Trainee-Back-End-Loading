export function requireCoordenador(request: any, reply: any, done:any){
    if(!["COORDENADOR"].includes){
        return reply.status(403).send({error:"Access denied"})
    }
}