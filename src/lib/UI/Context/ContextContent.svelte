<script lang="ts">
    import { onMount } from "svelte";
    import type { NotebookInstance, ContentType, SectionInstance, NoteInstance } from "../../../types";
    import ContextContent from "./ContextContent.svelte";
    import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
    export let context:NotebookInstance[]|SectionInstance[]|NoteInstance[];
    export let level:number;
    export let key:ContentType|undefined;
    
    export let removeChild: (key:ContentType, index: number[], level:number) => void;
    export let index:number[] = [];

    function handleRemove(i:number[]){

 
        removeChild(key as ContentType,i, level);
            

    }

    let open:boolean[] = [];
    onMount(()=>{
        context.forEach((context)=>{
            open = [...open,false];
        })
    })



</script>

{#each context as item, i }

    <div class="border w-full p-2 rounded">
        <ContextMenu.Root>
            <ContextMenu.Trigger>
                <button on:click={()=>open[i] = !open[i]} class="m-1">
                    <p class="text-md">{item.title}</p>
                </button>
            </ContextMenu.Trigger>
            <ContextMenu.Content>
                <ContextMenu.Item>Editar</ContextMenu.Item>
                <ContextMenu.Item on:click={()=>handleRemove([...index,i])}>Quitar del contexto</ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Root>
        {#if open[i]}
            {#if item.children}
                    <ContextContent index={[...index,i]} removeChild={removeChild} key={key} level={level+1} context={item.children}></ContextContent>
            {/if}
        {/if}
    </div>
    
{/each}