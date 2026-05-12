import { authService } from "../auth/service.ts";
import openapi from "@elysia/openapi";

type OpenAPISchema = Awaited<ReturnType<typeof authService.api.generateOpenAPISchema>>
type OpenAPIPaths = OpenAPISchema['paths']
type OpenAPIOperation = { tags?: string[] }

let _schema: ReturnType<typeof authService.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= authService.api.generateOpenAPISchema())
const OpenAPI = {
    getPaths: (prefix = '/auth/api') =>
        getSchema().then(({ paths }) => {
            const reference: OpenAPIPaths = Object.create(null)
            for (const path of Object.keys(paths)) {
                const key = prefix + path
                reference[key] = paths[path]!
                const pathItem = reference[key] as Record<string, OpenAPIOperation>
                for (const method of Object.keys(paths[path]!)) {
                    const operation = pathItem[method]
                    if (operation) operation.tags = ['Authentication']
                }
            }
            return reference
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as Promise<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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