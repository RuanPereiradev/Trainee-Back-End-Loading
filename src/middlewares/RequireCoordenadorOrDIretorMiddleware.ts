export function requireCoordenadorOrDirector(request:any, reply: any, done:any){
    if((request.user.role !== "DIRETOR") || (request.user.role !== "COORDENADOR")){
        return reply.status(403).send({error: "Access denied"})
    }
    done()
}