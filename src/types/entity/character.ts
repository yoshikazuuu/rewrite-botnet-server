import { z } from "zod";

export const character = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    avatar: z.string().optional(),
});

export type Character = z.infer<typeof character>;
