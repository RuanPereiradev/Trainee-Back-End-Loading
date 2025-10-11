import { User } from "./User";
import { Project } from "./Projects";
export declare class Membership {
    private readonly _id;
    private _user;
    private _project;
    private _joinedAt;
    private _leftAt;
    constructor(user: User, project: Project, id?: string, joinedAt?: Date);
    get id(): string;
    get project(): Project;
    get joinedAt(): Date;
    get leftAt(): Date | null;
    leaveProject(): void;
}
//# sourceMappingURL=Membership.d.ts.map