<script lang="ts">
    import { onMount } from "svelte";
    import type { Message } from "../../../app";
    import MessageComponent from "$lib/UI/MessageComponent.svelte";
    import QdrantService from "$lib/qdrantService";
    import Chat from "$lib/ChatService";


    let messages:Message[] = [] 
    let chat_service = new Chat(messages)

    onMount(()=>{
        messages = chat_service.get_messages()
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
    const rag = new QdrantService();

    function ask(){
    }
        
    

</script>
<main>
    <div class="h-[90vh] flex flex-col">
        {#each messages as message}
            <MessageComponent {message}></MessageComponent>
        {/each}
    </div>

    <div class="flex justify-evenly border  rounded p-7 shadow-inner">
        <div class="w-10/12">
            <input id="UserInput" class="border rounded w-full p-2" type="text" placeholder="¿De qué quieres hablar?" bind:value={user_input}>
        </div>
        <div>
            <button on:click={listen} id="Listen" class="bg-blue-500 p-2 text-white rounded">Escuchar</button>
            <button on:click={ask} id="Enviar" class="bg-blue-500 p-2 text-white rounded">Enviar</button>
        </div>
    </div>
</main>