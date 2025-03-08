<script lang="ts">
    import type { ContentType, Context, Notebook, Section } from "../../../types";
    import ContextContent from "./ContextContent.svelte";


    export let open:boolean;
    export let context:Context;


    let sidebarClass = "hidden flex items-center justify-center p-2 pr-4 pl-0";

    $: { if(open){
            sidebarClass= sidebarClass.replace("hidden", "w-1/3");
        }else{
            sidebarClass = sidebarClass.replace("w-1/3", "hidden");
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
            console.log("remove note");
            
            (context[key][index[0]]!.children![index[1]].children as any[]).splice(index[2],1);
            
            context = context;
        }
    }

</script>
<div class={sidebarClass}>
    <section class="h-[80%] p-2 border w-full rounded overflow-hidden flex flex-col items-center justify-start">
        <h3 class="font-bold text-xl font-mono">Context Memory</h3>
        {#each Object.keys(context) as key}
            {#if context[key as ContentType].length > 0}
                    <ContextContent removeChild={removeChild} key={key as ContentType} level={0} context={context[key as ContentType]} />
            {/if}
        {/each}
    </section>
</div>