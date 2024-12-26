<script lang="ts">
    import { onMount } from "svelte";
    import type { Message } from "../../../app";
    import MessageComponent from "$lib/UI/MessageComponent.svelte";
    import { BsMicFill } from "svelte-icons-pack/bs";
    import Chat from "$lib/ChatService";
    import { Icon } from "svelte-icons-pack";

    let context= {
        notebook: "General",
        section: "General",
        note: "General"
    }

    function update_context (new_context:{notebook:string, section:string, note:string}){
        context = new_context
    }

    let messages:Message[] = [] 
    
    function update_messages(funcmessages:Message[]){
        messages = [...messages,...funcmessages]
    }
    let chat_service:Chat;



    onMount(()=>{
      chat_service  = new Chat(messages, update_messages, update_context)
      messages = chat_service.get_messages();
      context = chat_service.get_context();
    })

    let speach_service;
    let user_input = ""
    let listening = false
    let recognition:any;
    function listen(){
        if(!listening){
            listening = true;
            if ('webkitSpeechRecognition' in window) {
                console.log("here")
                recognition = new webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'es-ES'; // Set language to Spanish
                console.log(1)
                recognition.onresult = (event) => {
                    console.log(2)
                    user_input = Array.from(event.results)
                        .map(result => result[0].transcript)
                        .join('');
                    console.log(user_input)
                };
                recognition.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                };
            } else {
                console.warn('Speech recognition not supported in this browser.');
            }
            recognition.start();
        }else{
            recognition.stop();
        }
        
    }


    function ask(){
        chat_service.respond(user_input)
    }
        
    function handleKeyDown(event:KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) { 
            event.preventDefault(); // Prevent the default action (new line)
            ask(); 
        }
    }
    

</script>
<main>
    <div class="border-b shadow-lg p-4 flex justify-between">
        <div>
            <h1 class="text-2xl">Contexto Actual: {context.notebook}/{context.section}/{context.note}</h1>
        </div>
        <div>
            <button class="border-2 border-red-500 hover:bg-red-500 active:bg-red-700 p-2 rounded active:text-white hover:text-white">Cerrar Sesión</button>
        </div>
    </div>
    <div class="h-[80vh] flex flex-col overflow-y-scroll">
        {#each messages as message}
            <MessageComponent {message}></MessageComponent>
        {/each}
    </div>

    <div class="w-full flex justify-center">
        <div class="w-5/6 flex space-x-2 border  rounded p-5 shadow-lg">
            <div class="w-11/12 relative">
                <textarea on:keydown={handleKeyDown} id="UserInput" class="border rounded w-full h-full p-2" placeholder="¿De qué quieres hablar?" bind:value={user_input}></textarea>
                <button on:click={listen} id="Listen" class={`hover:border p-2 ${listening ? "text-red-500" : "text-gray-500"} rounded absolute right-3 top-3`}><Icon src={BsMicFill}></Icon></button>
            </div>
            <div class="w-1/12">
                <button on:click={ask} id="Enviar" class="bg-blue-500 p-2 w-full h-full text-white rounded">Enviar</button>
            </div>
        </div>
    </div>
</main>