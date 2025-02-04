// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}	
}

interface Notebook {
    id: string;
    object_type: string;
    title: string;
    topic: string;
    description?: string;
    children?: Section[];
    tags?: string[];
    [key: string]: unknown; // Index signature
}

interface Section {
    id: string;
    object_type: string;
    notebookId: string;
    title: string;
    topic: string;
    description?: string;
    children?: Note[];
    tags: string[];
    [key: string]: unknown; // Index signature
}

interface Note {
    id: string;
    object_type: string;
    notebookId: string;
    sectionId?: string;
    title: string;
    topic: string;
    tags?: string[];
    children: undefined;
    embeding?: number[];
    [key: string]: unknown; // Index signature
}

enum ContentType {
    notebooks = "notebooks",
    sections = "sections",
    notes = "notes"
}

interface Context {
    notebooks: Notebook[];
    sections: Section[];
    notes: Note[];
    [key: ContentType]: Notebook[] | Section[] | Note[];
}


interface NoteMessage {
    id: string;
    object_type: Notebook_Object_Type.Message;
    note_id: string;
    notebookId: string;
    sectionId?: string;
    prompt: string;
    response: string;
    [key: string]: unknown; // Index signature
}

enum Notebook_Object_Type {
    Notebook = "notebooks",
    Section = "sections",
    Note = "notes",
    Message = "messages"
}

enum MessageType {
	Menu = "menu",
	Normal = "normal",
	
}
type MessageOption = {text:string, func:()=>void}[]


interface Message {
	type:MessageType,
	text:string,
	user_generated:boolean,
	options?:MessageOption
}



export {Context, ContentType, Notebook, Section, Note, MessageType, Message, MessageOption, NoteMessage, Notebook_Object_Type};
