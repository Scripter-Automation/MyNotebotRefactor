<script lang="ts">
    import DotPattern from "./DotPattern.svelte";
    import {ContextMemory} from "../../../store";
    import { LuBrain, LuNotebookPen } from "svelte-icons-pack/lu";
    import { Icon } from "svelte-icons-pack";
    import { NotebookMode, type SummaryContext } from "../../../types";
    import type { Memory, MemorySchema, NoteInstance } from "../../../types";
    import { BiSave } from "svelte-icons-pack/bi";
    import { BsInfo } from "svelte-icons-pack/bs";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import SlashNote from "./SlashComands/SlashNote.svelte";


    let infoModule:boolean = false;


    let context: MemorySchema = {} as MemorySchema;
    ContextMemory.subscribe(value=>
     context = value
    );
    console.log("context", context)

    let memory_length = 0;
    let mode:NotebookMode;
    let memmories:Memory[];
    
    if(Object.keys(context).length == 0){
        mode = NotebookMode.Note;
        memmories = [];
    }else{
        memory_length = Object.keys(context).length;
        mode = NotebookMode.Note;
        memmories = Object.values(context);
    }

    function toggle_mode(){
        if(mode == NotebookMode.Note){
            mode = NotebookMode.Memory;
        }else{
            mode = NotebookMode.Note;
        }
    }

    

</script>
<div class="relative border m-2 rounded flex-col flex-grow">
    {#if mode == NotebookMode.Note}
        <div class="relative z-10 w-full bg-white flex justify-end p-2 items-center border-b">
            <button on:click={()=>toggle_mode()} class=" rounded p-2 hover:shadow-md active:bg-gray-200 relative">
                <div class="rounded-full w-4 h-4 bg-red-500 text-white absolute top-0 -left-2 z-50 justify-center flex items-center text-sm">{memory_length}</div>
                <Icon src={LuBrain} />
            </button>
        </div>
        <SlashNote/>
        {:else}
        <div class="relative z-10 w-full bg-white flex justify-end p-2 items-center border-b">
            <button on:click={()=>infoModule = !infoModule} class=" rounded p-1 hover:shadow-md active:bg-gray-200">
                <Icon src={BsInfo} size=25  />
            </button>
            <button on:click={()=>toggle_mode()} class=" rounded p-2 hover:shadow-md active:bg-gray-200">
                <Icon  src={LuNotebookPen} />
            </button>
        </div>
        <div class="flex flex-col items-center p-2 relative z-10">
            {#each memmories as memory}
                <div class="bg-white rounded p-4 shadow-lg w-10/12 my-2">
                    <div class="flex justify-between py-1 border-b my-1">
                        <div class="flex items-center space-x-2">
                            <input type="checkbox" class="">
                            <p>memoria: {memory.id.substring(0,5)}...</p>
                        </div>
                        <div class="flex items-center">
                            {#if memory.saved}
                                <p>Guardada</p>
                            {:else}
                                <p>Sin guardar</p>
                            {/if}
                            <button class=" rounded p-2 hover:shadow-md active:bg-gray-200 relative">
                                <Icon src={BiSave} />
                            </button>
                        </div>
                    </div>
                    <p>{memory.text}</p>
                </div>
            {/each}
        </div>
    {/if}
    <DotPattern class="opacity-50"></DotPattern>
</div>

<AlertDialog.Root bind:open={infoModule} >
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Modo Memorias</AlertDialog.Title>
        <AlertDialog.Description>
          Las memorias son fragmentos de información que se guardan, asociandose a una nota.
          Sirven para recordar información importante, y que sea perservada dentro de la memoria de la
          IA. Con el proposito de que pueda ser recordada en el futuro cuando se realicen preguntas ó conversaciónes
          similares. Las memorias pueden ser modificadas ó eliminadas a tu gusto.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cerrar</AlertDialog.Cancel>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>