import { Elysia } from "elysia";
import { openapiService } from "./service.ts";

export const openapiController = new Elysia({ name: 'OpenAPI.Controller' })
    .use(openapiService)