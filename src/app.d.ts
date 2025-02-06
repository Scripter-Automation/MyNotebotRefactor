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
    object_type: string = "notebooks";
    title: string;
    topic: string;
    description?: string;
    tags?: string[];
    [key: string]: unknown; // Index signature
}

interface NotebookBuilder extends Notebook {
    id?:string;
}

interface NotebookCreator extends Notebook {
    id:string;
}


interface NotebookInstance extends Notebook {
    id: string;
    children: SectionInstance[];
}


interface Section {
    object_type: string = "sections";
    notebookId: string;
    title: string;
    topic: string;
    description?: string;
    tags?: string[];
    [key: string]: unknown; // Index signature
}

interface SectionBuilder extends Section {
    id?:string;

}

interface SectionCreator extends Section {
    id:string;
}

interface SectionInstance extends Section {
    id: string;
    children: NoteInstance[];
}

interface Note {
    object_type: string = "notes";
    notebookId: string;
    sectionId: string;
    title: string;
    topic: string;
    tags?: string[];
    [key: string]: unknown; // Index signature
}

interface NoteBuilder extends Note {
    id?:string;
}

interface NoteCreator extends Note {
    id:string;
}

interface NoteInstance extends Note {
    id: string;
    children: undefined;
    embeding?: number[];
}


enum ContentType {
    notebooks = "notebooks",
    sections = "sections",
    notes = "notes"
}

interface Context {
    notebooks: NotebookInstance[];
    sections: SectionInstance[];
    notes: NoteInstance[];
    [key: ContentType]: NotebookInstance[] | SectionInstance[] | NoteInstance[];
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



export {Context, ContentType, Notebook, NotebookCreator, NotebookBuilder, NotebookInstance, Section, SectionCreator, SectionBuilder, SectionInstance, Note, NoteCreator, NoteInstance, NoteBuilder, MessageType, Message, MessageOption, NoteMessage, Notebook_Object_Type};
