import { z } from "zod";
import { turn } from "./turn";

export const chat = z.object({
    id: z.string(),
    turns: turn.array(),
});

export type Chat = z.infer<typeof chat>;    