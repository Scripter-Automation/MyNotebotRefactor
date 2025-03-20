import FirebaseAdminService from "$lib/Services/Server/FirebaseAdminService";
import QdrantService from "$lib/Services/Server/QdrantService";
import type { RequestHandler } from "@sveltejs/kit";
import type { NoteInstance, Section, SectionInstance, SectionBuilder } from "../../../../types";

export const GET : RequestHandler = async ({ request, cookies }) => {
    const firebase = await FirebaseAdminService.getInstance();
    const rag = new QdrantService(firebase.get_uid(await firebase.getUser(cookies.get("email"))));
    try{
        // Get all notebooks, sections, and notes
        const notebooks = await rag.get_all_notebooks();
        const sections = await rag.get_all_sections();
        const notes = await rag.get_all_notes();

 
        // Build the hierarchy
        let sectionMap:{[key:string]:SectionInstance} = {};
        const noteMap: { [key: string]: NoteInstance[] } = {};

        // Initialize sectionMap
        sections.map((item)=>{
            item.children = [];
            sectionMap[item.id as string] = item as SectionInstance;
            return item;
        })
        // Initialize noteMap
        notes.forEach((item)=>{
            if(!noteMap[item.sectionId]){
                noteMap[item.sectionId] = [];
            }
            noteMap[item.sectionId].push(item as NoteInstance);
        }) 

        // Initialize root sections
        const rootSections: {[key:string]:SectionInstance[]} = {};
        sections.forEach(section => {
            // Add children notes to the section

            (sectionMap[section.id as string].children as (NoteInstance | SectionInstance)[]).push(...(noteMap[section.id as string] || []));

            if (section.parentId != undefined) {

                // Add to parent section's children if current section has a parent
                (sectionMap[section.parentId]?.children as (NoteInstance | SectionInstance)[]).push(sectionMap[section.id as string]);
            } else {
                // Add to the root level
                if (!rootSections[section.notebookId]) {
                    rootSections[section.notebookId] = [];
                }
                rootSections[section.notebookId].push(sectionMap[section.id as string]);
            }

        });

        // Add root sections to the notebook
        notebooks.forEach(notebook => {
            notebook.children = rootSections[notebook.id as string] || [];
        });


        return new Response(JSON.stringify(notebooks), {
            status: 200,
            headers: {
                "content-type": "application/json",
            },
        });

    }catch(error){
        console.error("Error building hierarchy:", error);
        return new Response("Failed to build hierarchy", { status: 500 });
    }


}