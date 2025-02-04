<script lang="ts">
    import { onMount } from "svelte";
    import type { Notebook, Section, Note } from "../../../app";
    import NotebookContent from "./NootbookContent.svelte";
    import { Notebook as NoteIcon,  Bookmark, StickyNote  }  from 'lucide-svelte';

    export let content:Notebook[]|Section[]|Note[];
    export let level;

    let open:boolean[] = [];
    onMount(()=>{
        content.forEach((item)=>{
            open = [...open,false];
        })
    })

    function handleDrag(e:any, item:Notebook|Section|Note){
        e.dataTransfer.setData("item",JSON.stringify(item));
    }

</script>

{#each content as item, i }
  
        <div draggable="true" on:dragstart={(e)=>handleDrag(e,item)} role="definition">
    
            <button on:click={()=>open[i] = !open[i]} class="p-2 w-full hover:bg-gray-200 flex items-center" style="margin-left: {level * 15}px; border-left: {level > 0 ? "1px solid gray": "0px"};">
                {#if level == 0}
                <NoteIcon></NoteIcon>
                {:else if level == 1}
                <Bookmark></Bookmark>
                {:else}
                <StickyNote></StickyNote>
                {/if}
                <p class="text-md">{item.title}</p>
            </button>
        </div>

    
    {#if open[i]}
        {#if item.children}
                <NotebookContent level={level+1} content={item.children}></NotebookContent>
        {/if}
    {/if}
{/each}