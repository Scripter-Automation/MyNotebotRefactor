
interface Notebook {
    object_type: ContentType.notebooks;
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
    object_type: ContentType.sections;
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
    children: Array<NoteInstance|SectionInstance>;
}

interface Note {
    object_type: ContentType.notes;
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
    memory: Memmory[];
}

// Serves to store summaries of a note that helps
// retreive information from the rag aplication
// their id is the same as the note id
interface Memmory {
    id: string;
    object_type: "memory";
    summary: string;
    saved:boolean;
}




interface NoteFile {
    LLM: LLMs;
    Summarizer: LLMs.gemini;
    [key:string]: any;
}

interface TextFile extends NoteFile {
    content: TextFileContent[];
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

interface TextFileContent {
    tag: HtmlTextTags;
    innerText: string;
    atributes: string[];
    contentEditable:boolean;
    style: string;
    editable: boolean;
    // Introduction of children is a good idea
    // But its out of the scope of the current
    // project's stage
    //children?: NoteFileContent[];
}




enum ContentType {
    notebooks = "notebooks",
    sections = "sections",
    notes = "notes",

}

interface SummaryContext {
    title: string;
    object_type: "summary";
    memory: Memmory[];
}


type Context =  {
    [key in ContentType]: NotebookInstance[] | SectionInstance[] | NoteInstance[];
};



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


type SummarySchema = {
    summary:string;
    new_memory:boolean;
}

enum ChatMode {
    Chat ="chat",
    Notebook = "notebook"
}

enum NotebookMode {
    Note = "note",
    Memory = "memory"
}


export {type BaseMessage, type MessageModel,  type RoleType, ChatGPTRoleType, OtherRoleType, LLMs, type Conversation, type Context, ContentType, type Notebook, type NotebookCreator, type NotebookBuilder, type NotebookInstance, type  Section, type SectionCreator, type SectionBuilder, type SectionInstance, type Note, type NoteCreator, type NoteInstance, type NoteBuilder, type Message, type SummarySchema, type SummaryContext, ChatMode, NotebookMode, type Memmory};