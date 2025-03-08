<script lang="ts">
    import type { NotebookInstance } from "../../../types";
    import NootbookContent from "./NootbookContent.svelte";
    import * as DropDownMenu from "$lib/components/ui/dropdown-menu"; 
    import { Ellipsis } from 'lucide-svelte';

    export let open:boolean;
    let sidebarClass = "hidden border-r bg-gray-100 overflow-hidden"

    export let toggle_drawer:()=>void;
    export let set_drawer_context:(context:string)=>void;
    export let content: NotebookInstance[]



    $: { if(open){
            sidebarClass= sidebarClass.replace("hidden", "w-1/4");
        }else{
            sidebarClass = sidebarClass.replace("w-1/4", "hidden");
        }
    }
</script>
<section class={sidebarClass}>
    <div>
    <DropDownMenu.Root>
        <DropDownMenu.Trigger>
            <div class="bg-black rounded-full m-2 p-1 hover:opacity-70">
                <Ellipsis class=" text-white text-2xl"/>
            </div>
        </DropDownMenu.Trigger>
        <DropDownMenu.Content>
            <DropDownMenu.Label>Acciones</DropDownMenu.Label>
            <DropDownMenu.Separator />

            <DropDownMenu.Item on:click={()=>{
                toggle_drawer();
                set_drawer_context("notebooks");
            }}>Crear Cuaderno</DropDownMenu.Item>            
            
            <DropDownMenu.Item on:click={()=>{
                toggle_drawer();
                set_drawer_context("sections")
            }}>Crear Seccion</DropDownMenu.Item>
            <DropDownMenu.Item on:click={()=>{
                toggle_drawer();
                set_drawer_context("notes");
            }}
            >Crear Nota</DropDownMenu.Item>


        </DropDownMenu.Content>
    </DropDownMenu.Root>
    </div>

    <NootbookContent level={0} content={content} />

</section>