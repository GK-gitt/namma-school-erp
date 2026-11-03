// This wires up Auth.js to Next.js — handles /api/auth/* requests
// (login, logout, session). We just re-export the handlers.
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
