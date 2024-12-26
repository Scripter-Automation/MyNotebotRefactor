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
    [key: string]: unknown; // Index signature
}

interface Section {
    id: string;
    object_type: string;
    notebookId: string;
    title: string;
    topic: string;
    description?: string;
    [key: string]: unknown; // Index signature
}

interface Note {
    id: string;
    object_type: string;
    notebookId: string;
    sectionId?: string;
    title: string;
    tags?: string[];
    embeding?: number[];
    [key: string]: unknown; // Index signature
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
    Notebook = "notebook",
    Section = "section",
    Note = "note",
    Message = "message"
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



export {Notebook, Section, Note, MessageType, Message, MessageOption, NoteMessage, Notebook_Object_Type};
