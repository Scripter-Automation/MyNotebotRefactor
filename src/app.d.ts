// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Content } from "$lib/components/ui/context-menu";

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
    object_type: ContentType = "notebooks";
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
    object_type: ContentType = "sections";
    notebookId: string;
    parentId?: string;
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
    children: NoteInstance[]|SectionInstance[];
}

interface Note {
    object_type: ContentType = "notes";
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
    content: NoteFile;
}

interface NoteInstance extends Note {
    id: string;
    children: undefined;
    embeding: string[];
    content: NoteFile;
}

enum HtmlTextTags {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6",
    p = "p",
    li = "li",
    ul = "ul",
    ol = "ol",

}


interface NoteFile {
    LLM: LLMs;
    Summarizer: LLMs = "gemini";
    [key:string]: any;
}

interface TextFile extends NoteFile {
    content: TextFileContent[];
}

interface TextFileContent {
    tag: HtmlTextTags;
    innerText: string;
    atributes: string[];
    contentEditable:boolean = true;
    style: string;
    editable: boolean = true;
    // Introduction of children is a good idea
    // But its out of the scope of the current
    // project's stage
    //children?: NoteFileContent[];
}




enum ContentType {
    notebooks = "notebooks",
    sections = "sections",
    notes = "notes"
}

type Context = {
    notebooks: NotebookInstance[];
    sections: SectionInstance[];
    notes: NoteInstance[];
    [key: ContentType]: NotebookInstance[] | SectionInstance[] | NoteInstance[];
}



/**
 * RoleType is used to determine the role of the user
 * but this is for the chatgpt model, and may not be suitable for 
 * every model. Renameing may be required in the future when introducing
 * new models into the aplication
 */

type RoleType<T extends LLMs> = 
    T extends LLMs.gpt4o | LLMs.gpt3turbo ? ChatGPTRoleType :
    T extends LLMs.gemini | LLMs.deepseek ? OtherRoleType : never;

enum ChatGPTRoleType {
    platform = "platform",
    developer = "developer",
    user =    "user",
    assistant = "assistant",
    tool = "tool"
}

/**
 * OtherRoleType is just a placeholder example
 * for other models that may be introduced in the future
 */
enum OtherRoleType {
    admin = "admin",
    manager = "manager",
    reviewer = "reviewer"
}

interface Conversation {
    messages: BaseMessage[];
    [key:string]: any;
}

enum LLMs {
    gpt4o = "gpt-4o",
    gpt3turbo = "gpt-3.5-turbo",
    gemini = "gemini",
    deepseek = "deepseek",
}

interface BaseMessage{
    content:string;
    user_generated:boolean;
    [key:string]: any;
}

interface Message<T extends LLMs> extends BaseMessage {
    LLM: T;
    role: RoleType<T>, // role type should be conditioned to the model
}

interface ChatGPTMessage extends Message<LLMs.gpt4o | LLMs.gpt3turbo> {
    recipient?: any,
    settings?: {
        // true introduces chaty behavior and markdown formating (default)
        // false introduces plain text behavior and no markdown formating (good for fact extraction)
        interactive: boolean,
        max_tokens: number,
    },
    end_turn?: boolean,
}

type MessageModel<T extends LLMs> = T extends LLMs.gpt4o | LLMs.gpt3turbo ?
    ChatGPTMessage : never;




export {BaseMessage, MessageModel, RoleType, ChatGPTRoleType, OtherRoleType, LLMs, Conversation, Context, ContentType, Notebook, NotebookCreator, NotebookBuilder, NotebookInstance, Section, SectionCreator, SectionBuilder, SectionInstance, Note, NoteCreator, NoteInstance, NoteBuilder, Message};
