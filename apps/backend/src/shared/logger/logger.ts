import logixlysia from 'logixlysia'

export const logixlysiaIns = logixlysia({
    config: {
        pino: {
            level: process.env.LOG_LEVEL || 'info',
            messageKey: 'msg',
            transport: {
                target: 'pino-pretty'
            },
            base: {
                service: 'fontbot-backend'
            }
        }
    }
})
export const logger = logixlysiaIns.store.pino