<script lang="ts">
    import { onMount } from "svelte";
    import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
    import { ChatMode, type SummaryContext } from "../../../types";

    import { NoteContext } from "../../../store";
    
    export let summary:SummaryContext;
    export let deleteShortTermMemory: ()=>void;
    export let set_chat_mode: (mode:ChatMode)=>void;

    function handleRemove(){
        deleteShortTermMemory();
    }

    function setNoteMode(){
        set_chat_mode(ChatMode.Notebook);
        NoteContext.set({
            title: summary.title,
            memory: summary.memory,
            object_type: "summary"
        })
    }



</script>



<div class="border w-full p-2 rounded">
    <ContextMenu.Root>
        <ContextMenu.Trigger>
            <button class="m-1">
                <p class="text-md">{summary.title}</p>
            </button>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
            <ContextMenu.Item on:click={()=>{setNoteMode();}}>Editar</ContextMenu.Item>
            <ContextMenu.Item on:click={()=>handleRemove()}>Quitar del contexto</ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Root>

</div>
