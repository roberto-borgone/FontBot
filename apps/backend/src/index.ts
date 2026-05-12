import { Elysia } from "elysia";
import { staticPlugin } from '@elysia/static'
import { cors } from '@elysia/cors'
import { logixlysiaIns } from "./shared/logger/logger.ts";
import { chatController } from "./chat/index.ts";
import { authController } from "./shared/auth/index.ts";
import { openapiController } from "./shared/openapi/index.ts";

new Elysia()
  .use(logixlysiaIns)
  .use(
    cors({
      origin: "http://localhost:3001",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  )
  .use(staticPlugin())
  .use(authController)
  .use(openapiController)
  .get("/favicon.ico", ({ redirect }) => redirect('/public/favicon.ico'))
  .use(chatController)
  .listen(3000);
