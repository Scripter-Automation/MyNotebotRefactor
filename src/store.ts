import { readable, writable } from "svelte/store";
import FirebaseService from "$lib/Services/Client/FirebaseService";
import type { MemorySchema, NoteInstance, SummaryContext } from "./types";
import type { NoteContext } from "./zodTypes";

const firebaseService = new FirebaseService();
export const firebaseStore = readable(firebaseService);

export const ContextSummary = writable<SummaryContext>(
    {
        title: "",
        memory: "",
        object_type: "summary"
    }
)

export const ContextMemory = writable<MemorySchema>({})

export const ContextNote = writable<NoteContext>({} as NoteContext)


/**
 * Clears the stores that are not escential to the app working, only should be run when logging out
 */
export function clearStores(){
    ContextSummary.set({
        title: "",
        memory: "",
        object_type: "summary"
    })
    ContextMemory.set({})
    ContextNote.set({} as NoteContext)

}   