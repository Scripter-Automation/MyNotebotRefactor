import {z} from "zod"

export const listItem = z.lazy(()=>{
    return z.array(z.object({
            content:z.string(),
            meta:z.object({
                checked:z.boolean().optional()
            }),
            items: z.array(listItem)
        })
    )
})

export const notestructure = z.object({
    blocks: z.array(
        z.discriminatedUnion("type", [
            z.object({
                type: z.literal("header"),
                data: z.object({
                    text: z.string(), // Example: Text for the header
                    level: z.number(), // Example: Header level (e.g., H1, H2)
                }),
            }),
            z.object({
                type: z.literal("paragraph"),
                data: z.object({
                    text: z.string(), // Example: Paragraph text
                }),
            }),
            z.object({
                type: z.literal("list"),
                data: z.object({
                    style: z.enum(["unordered", "ordered","checklist"]),
                    items: listItem
                }),
            }),
        ])
    ),
});

export type NoteContext = z.infer<typeof notestructure>