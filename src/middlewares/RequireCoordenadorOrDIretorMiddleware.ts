export function requireCoordenadorOrDirector(request:any, reply: any, done:any){
    if(!["DIRETOR", "COORDENADOR"].includes){
        return reply.status(403).send({error:"Access denied"})
    }
    done()
}