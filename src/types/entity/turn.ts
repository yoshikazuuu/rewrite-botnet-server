import { z } from "zod";

export const turn = z.object({
    turn_key: z.object({
        turn_id: z.string(),
        chat_id: z.string(),
    }),
    author: z.object({
        username: z.string(),
        user_id: z.string(),
        is_bot: z.boolean(),
    }),
    raw_text: z.string(),
});

export const create_turn = z.object({
    command: z.enum(['create_turn']),
    origin: z.string(),
    username: z.string(),
    payload: z.object({
        selected_language: z.string(),
        selected_voice: z.string(),
        tts_enabled: z.boolean(),
        turn: turn,
    }),
    request_turn_id: z.string(),
});

export const return_turn = z.object({
    command: z.enum(['return_turn']),
    origin: z.string(),
    username: z.string(),
    payload: z.object({
        turn: turn,
    }),
    request_turn_id: z.string(),
});

export type Turn = z.infer<typeof turn>;
export type CreateTurn = z.infer<typeof create_turn>;
export type ReturnTurn = z.infer<typeof return_turn>;