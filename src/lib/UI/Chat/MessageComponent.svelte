<script lang="ts">
    import type { Message } from "../../app";

    export let message:Message
    
    
</script>


{#if message.user_generated}
    <div class="w-11/12 my-4 mr-4 p-4 self-end bg-gray-200 rounded shadow">
        {message.text}
    </div>
{:else if message.type == "menu"}
    <div class="w-11/12 space-y-4 my-4 ml-4 p-4 self-star rounded shadow">

        <p class="p-2 shadow-xl">
            {message.text}
        </p>

    </div>
    <div class="w-11/12 space-y-4 my-4 ml-4 p-4 self-start rounded shadow ">
        <div class="flex shadow-xl p-2 space-y-1 flex-col items-start w-full border rounded">

            {#if message.options}
                <div class="text-center w-full">Menu</div>
                {#each message.options as option}
                    <button on:click={option.func} class="w-full text-left pl-2 rounded text-white border-white  border-t hover:bg-blue-700 active:bg-blue-900">{option.text}</button>
                {/each}
            {/if}
        </div>
    </div>  
{:else if message.type == "normal"}
<div class="w-11/12 space-y-4 my-4 ml-4 p-4 self-start rounded border-b">

    <p class="p-2">
        {message.text}
    </p>

</div>
{/if}