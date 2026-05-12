import { authService } from "../auth/service.ts";
import openapi from "@elysia/openapi";

let _schema: ReturnType<typeof authService.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= authService.api.generateOpenAPISchema())
const OpenAPI = {
    getPaths: (prefix = '/auth/api') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)
            for (const path of Object.keys(paths)) {
                const key = prefix + path
                reference[key] = paths[path]!
                for (const method of Object.keys(paths[path]!)) {
                    const operation = (reference[key] as any)[method]
                    operation.tags = ['Authentication']
                }
            }
            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const

export const openapiService = openapi({
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
})