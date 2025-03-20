import { readable, writable } from "svelte/store";
import FirebaseService from "$lib/Services/Client/FirebaseService";
import type { NoteInstance, SummaryContext } from "./types";

const firebaseService = new FirebaseService();
export const firebaseStore = readable(firebaseService);

export const NoteContext = writable<NoteInstance|SummaryContext>(
    {
        title: "Short term memory",
        memory: [],
        object_type: "summary"
    }
)