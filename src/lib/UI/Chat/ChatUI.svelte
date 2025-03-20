<script lang="ts">
    import  { LLMs, type BaseMessage, type Context, type SummarySchema } from "../../../types";
    import MessageComponent from "./MessageComponent.svelte";
    import ChatService from "$lib/Services/Client/ChatService";
    import SpeachService from "$lib/Services/Client/SpeachService";
    import { BsSendFill, BsMicFill } from "svelte-icons-pack/bs";
    import { Icon } from "svelte-icons-pack";
    import StorageService, { TimeFrame } from "$lib/Services/Client/StorageService";

    export let context:Context;
    export let update_summary: (new_summary:SummarySchema) => void;
    let speach_service = new SpeachService();
    
    let storage_service = new StorageService();
    const stored_messages = storage_service.get("messages")
    let messages:BaseMessage[] = [];
    if(stored_messages != null || stored_messages != undefined){
        messages = stored_messages.messages;
    }


    let chat_service:ChatService = new ChatService(LLMs.gpt4o);
    /**
     * This funcion is used as a callback to update the messages that are being sent or received
     * to the chat. It is called when the chat service has a new message that needs to be 
     * displayed in the UI.
     * @param funcmessages A message written by either the LLM or the user
     */
    function update_messages(funcmessages:BaseMessage[]){
        console.log(funcmessages)
        messages = [...messages,...funcmessages]
        if(!funcmessages[funcmessages.length-1].user_generated){
            speach_service.read_this(funcmessages[funcmessages.length-1].text)
        }
        storage_service.store("messages", {messages:messages, expiration:storage_service.createExpiration(TimeFrame.Day,1)});
    }



    chat_service.setSummaryUpdateFunction(update_summary);




    chat_service.setUpdateFunction(update_messages);
    let user_input:string = "";

    /**
     * Prompts the chat service to respond to the user's input
     */
    function ask(){
        const input = user_input;
        user_input = "";
        chat_service.respond(input, context);

    }

    /**
     * This funciton enables the user to pres enter to submit the message
     * @param event
    */    
     function handleKeyDown(event:KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) { 
            event.preventDefault(); // Prevent the default action (new line)
            ask(); 
        }
    }

    

    let chat_container:HTMLDivElement;

    /**
     * This function scrolls the chat to the bottom when a new
     * message is added to the chat.
     */
    function scroll_to_bottom() {
        if (chat_container) {
            setTimeout(() => {
                chat_container.scrollTop = chat_container.scrollHeight; 
            }, 0); 
        }
    }
    
</script>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>

<div id="chat_container" class="h-0 flex flex-col overflow-y-scroll no-scrollbar grow" bind:this={chat_container}>
    {#each messages as message}
        <MessageComponent {message}></MessageComponent>
    {/each}
</div>

<div class="w-full pb-5 flex justify-center">
    <div class="w-5/6 space-x-2 border bg-gray-200 rounded-3xl p-5 shadow-lg">
        <div class="w-full md:w-full relative">
            <textarea onkeydown={handleKeyDown} id="UserInput" class="focus:outline-none focus:ring-0 focus:border-transparent bg-gray-200 border rounded w-full h-full p-2" placeholder="¿De qué quieres hablar?" bind:value={user_input}></textarea>
        </div>
        <div class="w-full flex justify-end">
            <button onclick={user_input != "" ? ask : speach_service.listen} id="Enviar" class="flex items-center justify-center bg-black p-2 hover:opacity-70 text-white rounded-full"><Icon src={user_input != "" ? BsSendFill : BsMicFill}></Icon></button>
        </div>
    </div>
</div>