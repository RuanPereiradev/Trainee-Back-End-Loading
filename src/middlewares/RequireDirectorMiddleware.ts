export function requireDirector(request:any, reply:any, done:any){
    if(!["DIRETOR"].includes){
        return reply.status(403).send({error: "Access denied"})
    }
    done()
}