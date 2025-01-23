import { UserRole } from "~/enums/UserRoleEnum";

export type ReadUserDto = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};
