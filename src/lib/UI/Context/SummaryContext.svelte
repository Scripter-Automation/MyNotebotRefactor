<script lang="ts">
    import { onMount } from "svelte";
    import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
    import { ChatMode, type MemorySchema, type SummaryContext } from "../../../types";

    import { ContextMemory, ContextSummary } from "../../../store";
    import LLMAPIService from "$lib/SDK/LLMAPIService";
    
    export let set_chat_mode: (mode:ChatMode)=>void;
    let summary:SummaryContext
    ContextSummary.subscribe((value)=>{summary=value});
    let memory:MemorySchema;
    ContextMemory.subscribe((value)=>{memory = value});
    function handleRemoveSummary(){
        LLMAPIService.deleteChatSummary();
    }
    function handleRemovesMemory(){

    }

    function setSummaryMode(){
        set_chat_mode(ChatMode.Summary);
    }

    function setMemoryMode(){
        set_chat_mode(ChatMode.Notebook);
    }

    let isOpen = false;

    function open(){
        isOpen = !isOpen;
    }



</script>


{#if summary.title != "" || Object.keys(memory).length != 0}
<div class="border w-full p-2 rounded">
    <button class="m-1" onclick={open}>
        <p class="text-md">{summary.title}</p>
    </button>
    {#if isOpen}
        {#if summary.title != ""}
            <ContextMenu.Root>
                <ContextMenu.Trigger>
                    <button class="border w-full p-2 rounded mb-2">
                        Comprensión
                    </button>
                </ContextMenu.Trigger>
                <ContextMenu.Content>
                    <ContextMenu.Item on:click={()=>{setSummaryMode();}}>Editar</ContextMenu.Item>
                    <ContextMenu.Item on:click={()=>handleRemoveSummary()}>Quitar del contexto</ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Root>
        {/if}
        {#if Object.keys(memory).length != 0}
            <ContextMenu.Root>
                <ContextMenu.Trigger>
                    <button class="border w-full p-2 rounded">
                        Memoria
                    </button>
                </ContextMenu.Trigger>
                <ContextMenu.Content>
                    <ContextMenu.Item on:click={()=>{setMemoryMode();}}>Editar</ContextMenu.Item>
                    <ContextMenu.Item on:click={()=>handleRemovesMemory()}>Quitar del contexto</ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Root>
        {/if}
    {/if}

</div>
{/if}