// import { Result } from "../../env/Result";
// import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";

// export class DeleteMembershipUseCase {
//   constructor(private membershipRepo: IMembershipRepository) {}

//   async execute(id: string): Promise<Result<void>> {
//     try {
//       const deleteResult = await this.membershipRepo.delete(id);

//       if (deleteResult.isFailure) {
//         return Result.fail<void>(deleteResult.getError());
//       }

//       return Result.ok<void>();
//     } catch (error) {
//       if (error instanceof Error) {
//         return Result.fail<void>(error.message);
//       }
//       return Result.fail<void>("Erro desconhecido ao deletar membership");
//     }
//   }
// }
