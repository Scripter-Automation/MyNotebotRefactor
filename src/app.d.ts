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
	id:string,
	title:string,
	topic:string="Default",
	description?:string = undefined,
	sections?:Section[]
}

interface Section {
	id:string,
	notebookId:string,
	title:string,
	topic:string="Default",
	description?:string=undefined,
	notes?:Note[]
}

interface Note {
	id:string,
	sectionId:string,
	text:string,
	tags?:string[],
	
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
	optionFuncs?:MessageOptionFuncs
}

export {Notebook, Section, Note, MessageType, Message, MessageOption, MessageOptionFuncs};
