<script lang="ts">
    import LLMAPIService from "$lib/SDK/LLMAPIService";
import { ChatMode, ContentType, type Context, type MemorySchema, type Notebook, type Section, type SummaryContext as Summary } from "../../../types";
    import ContextContent from "./ContextContent.svelte";
    import SummaryContext from "./SummaryContext.svelte";


    export let open:boolean;
    export let context:Context;
    export let set_chat_mode: (mode:ChatMode) => void;



    let sidebarClass = "hidden flex items-center justify-center p-2 pr-4 pl-0";

    $: { if(open){
            sidebarClass= sidebarClass.replace("hidden", "w-1/4");
        }else{
            sidebarClass = sidebarClass.replace("w-1/4", "hidden");
        }
    }



    function removeChild(key:ContentType, index:number[],level:number){
        if(level == 0){
            context[key].splice(index[0],1);
            context = context;
        }else if(level==1){
            (context[key][index[0]].children as any[]).splice(index[1],1);
            context = context;
        }else if(level==2){
            
            (context[key][index[0]]!.children![index[1]].children as any[]).splice(index[2],1);
            
            context = context;
        }
    }

</script>
<div class={sidebarClass}>
    <section class="h-[80%] p-2 border w-full rounded overflow-hidden flex flex-col items-center justify-start">
        <h3 class="font-bold text-xl font-mono">Memoria</h3>
        {#each Object.keys(context) as key}
            {#if context[key as ContentType].length > 0}
                    <ContextContent removeChild={removeChild} key={key as ContentType} level={0} context={context[key as ContentType]} />
            {/if}
        {/each}
        
        <SummaryContext  {set_chat_mode}/>
        
    </section>
</div>