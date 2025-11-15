// src/routes/membershipRoutes.ts
import { FastifyInstance } from "fastify";
import { MembershipController } from "../controllers/MembershipController";
// import { CreateMembershipRequest, CreateMembershipUseCase } from "../../useCases/membership/CreateMembershipUseCase";
// import { LeaveProjectRequest, LeaveProjectUseCase } from "../../useCases/membership/LeaveProjectUseCase";
// import { ListMembershipsByProjectRequest, ListMembershipsByProjectUseCase } from "../../useCases/membership/ListMembershipByProjectUseCase";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";

// instâncias
const membershipRepository = new MembershipRepository();
// const createMembershipUseCase = new CreateMembershipUseCase(membershipRepository);
// const leaveProjectUseCase = new LeaveProjectUseCase(membershipRepository);
// const listMembershipsUseCase = new ListMembershipsByProjectUseCase(membershipRepository);
const responseFilter = new ApiResponseValidationFilter();

const membershipController = new MembershipController(
    // createMembershipUseCase,
    // leaveProjectUseCase,
    // listMembershipsUseCase,
    // responseFilter
);

export async function membershipRoutes(app: FastifyInstance) {
    app.post("/memberships/join",async(request, reply) => {return membershipController.joinProject(request, reply);
    }
);

    // app.post<{ Params: LeaveProjectRequest }>(
    //     "/memberships/leave/:membershipId",
    //     (request, reply) => membershipController.leaveProject(request, reply)
    // );

    // app.get<{ Params: ListMembershipsByProjectRequest }>(
    //     "/memberships/project/:projectId",
    //     (request, reply) => membershipController.listProjectMembers(request, reply)
    // );
}
