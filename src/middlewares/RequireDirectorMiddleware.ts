export function requireDirector(request:any, reply:any, done:any){
    if(request.user.role !== "DIRETOR"){
        return reply.status(403).send({error: "Access denied"});
    }
    done()
}