import { betterAuth } from "better-auth"
import { openAPI } from "better-auth/plugins"

export const authService = betterAuth({
    baseURL: "http://localhost:3000",
    basePath: '/api',
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    plugins: [
        openAPI(),
    ],
})