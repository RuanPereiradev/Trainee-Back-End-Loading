import { Membership } from "../../domain/entities/Membership";
import { Project } from "../../domain/entities/Projects";
import { User } from "../../domain/entities/User";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";

interface CreateMembershipRequest{
    user: User,
    project: Project
}

export class CreateMembershipUseCase{
    constructor(private membershipRepo : IMembershipRepository){}
    
    async execute(request: CreateMembershipRequest): Promise<Result<Membership>>{
        try{
            const {user, project} = request;

            if(!user){
                return Result.fail<Membership>("Usuário é obrigatorio pra criação");
            }

            if(!project){
                return Result.fail<Membership>("Projeto é obrigatorio pra criação");
            }

            const membership = new Membership(user, project);

            const saveResult = await this.membershipRepo.save(membership);

            if(saveResult.isFailure){
                return Result.fail<Membership>(saveResult.getError());
            }
            
            return Result.ok<Membership>(saveResult.getValue());

        }catch(error){
            if(error instanceof Error){
                return Result.fail<Membership>(error.message);
            }
            return Result.fail<Membership>("Erro desconhecido")
        }
    }
}