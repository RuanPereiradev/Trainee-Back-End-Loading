export function requireCoordenador(request: any, reply: any, done:any){
    if(request.user.role !== "COORDENADOR"){
        return reply.status(403).send({error: "Access denied "})
    }
}