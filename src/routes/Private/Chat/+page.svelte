<script lang="ts">
    import { onMount } from "svelte";
    import type { Message } from "../../../app";
    import MessageComponent from "$lib/UI/MessageComponent.svelte";
    import QdrantService from "$lib/qdrantService";
    import Chat from "$lib/ChatService";

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
        
    

</script>
<main>
    <div class="h-[89vh] flex flex-col overflow-y-scroll">
        <div class="bg-gray-300 p-2 ">
            <h1 class="text-2xl">Contexto Actual: {context.notebook}/{context.section}/{context.note}</h1>
        </div>
        {#each messages as message}
            <MessageComponent {message}></MessageComponent>
        {/each}
    </div>

    <div class="flex space-x-2 border  rounded p-7 shadow-inner">
        <div class="w-9/12">
            <input id="UserInput" class="border rounded w-full p-2" type="text" placeholder="¿De qué quieres hablar?" bind:value={user_input}>
        </div>
        <div class="w-3/12">
            <button on:click={listen} id="Listen" class="bg-blue-500 p-2 text-white rounded">Escuchar</button>
            <button on:click={ask} id="Enviar" class="bg-blue-500 p-2 text-white rounded">Enviar</button>
        </div>
    </div>
</main>