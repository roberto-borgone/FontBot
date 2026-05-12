import { Elysia } from "elysia";
import { agent } from "./service.ts";
import { type UIMessage, convertToModelMessages } from "ai";
import { logger } from "../shared/logger/logger.ts";

export const chatController = new Elysia({ name: 'Chat.Controller', tags: ['Chat'] }).group("/chat", (app) => app
  .post("/", async ({ body }) => {
    const { messages } = body as { messages: UIMessage[] };

    const response = await agent.stream({ prompt: await convertToModelMessages(messages) });

    logger.debug({ response }, "Chat response");
    return response.toUIMessageStreamResponse();
  }));