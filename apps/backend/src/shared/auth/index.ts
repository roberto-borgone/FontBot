import { Elysia } from "elysia";
import { authService } from "./service.ts";

export const authController = new Elysia({ name: 'Auth.Controller' })
    .mount("/auth", authService.handler)
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
                const session = await authService.api.getSession({
                    headers
                })
                if (!session) return status(401)
                return {
                    user: session.user,
                    session: session.session
                }
            }
        }
    })