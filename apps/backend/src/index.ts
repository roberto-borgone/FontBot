import { Elysia } from "elysia";
import openapi from "@elysia/openapi";
import { staticPlugin } from '@elysia/static'
import logixlysia from "logixlysia";
import { auth, OpenAPI } from "./shared/infrastructure/auth.ts";

const app = new Elysia()
  .use(logixlysia())
  .use(staticPlugin())
  .mount("/auth", auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
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
  .use(
    openapi({
      exclude: { paths: ["/swagger", "/public/*"] },
      documentation: {
        info: {
          title: "FontBot API",
          description: "API specification for FontBot",
          version: "1.0.0",
          license: {
            name: "MIT",
            url: "https://opensource.org/license/mit/",
          },
          contact: {
            name: "Roberto Borgone",
            url: "https://www.linkedin.com/in/roberto-borgone-0b0b90149/",
          },
        },
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths()
      },
      swagger: {
        autoDarkMode: true,
      },
    }),
  )
  .get("/favicon.ico", ({ redirect }) => redirect('/public/favicon.ico'))
  .get("/", () => "Hello Elysia")
  .listen(3000);
