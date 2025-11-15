// // src/userCases/membership/LeaveProjectUseCase.ts
// import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
// import { Result } from "../../env/Result";

//  interface LeaveProjectRequest {
//     membershipId: string;
// }

// export class LeaveProjectUseCase {
//     constructor(private membershipRepository: IMembershipRepository) {}

//     async execute(request: LeaveProjectRequest): Promise<Result<void>> {
//         const { membershipId } = request;
//         const membership = await this.membershipRepository.findById(membershipId);
//         if(!membership) return Result.fail("Vínculo não encontrado");

//         const  member = membership.getValue();
//         await this.membershipRepository.create();
//         return Result.ok();
//     }
// }
