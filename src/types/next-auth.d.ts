// Tell TypeScript that our session/user objects carry role, id, and schoolId.
import type { Role } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      schoolId: string | null;
      name?: string | null;
      email?: string | null;
    };
  }
  interface User {
    role: Role;
    schoolId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    schoolId: string | null;
  }
}
