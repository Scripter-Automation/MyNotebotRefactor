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
    sections?: Section[];
    [key: string]: unknown; // Index signature
}

interface Section {
    id: string;
    object_type: string;
    notebookId: string;
    title: string;
    topic: string;
    description?: string;
    notes?: Note[];
    [key: string]: unknown; // Index signature
}

interface Note {
    id: string;
    object_type: string;
    sectionId: string;
    text: string;
    tags?: string[];
    [key: string]: unknown; // Index signature
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

enum ChatState{
    Entire_context=0,
    Notebook_context=1,
    Section_context=2,
    Note_context=3,
    User_answer=4
}

export {Notebook, Section, Note, MessageType, Message, MessageOption, ChatState};
