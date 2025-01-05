<script lang="ts">
    import { onMount } from "svelte";
    import type { Message } from "../../../app";
    import MessageComponent from "$lib/UI/MessageComponent.svelte";
    import { BsMicFill } from "svelte-icons-pack/bs";
    import Chat from "$lib/ChatService";
    import { Icon } from "svelte-icons-pack";
    import { firebaseStore } from "../../../store";
    import type FirebaseService from "$lib/firebaseService";
    

    let firebaseService:FirebaseService;

    firebaseStore.subscribe((value)=>{
        firebaseService = value;
    })

    async function logout(){
        console.log("logging out")
        await firebaseService.logout();
    }

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
        console.log(funcmessages)
        if(!funcmessages[funcmessages.length-1].user_generated){
            read_this(funcmessages[funcmessages.length-1].text)
        }
    }
    let chat_service:Chat;

    function read_this(message:string){
        // Verifica si el navegador soporta la API de SpeechSynthesis
        if ('speechSynthesis' in window) {
            // Función para convertir texto a voz
            function textToSpeech(text:string) {
                // Crea una instancia de SpeechSynthesisUtterance
                const utterance = new SpeechSynthesisUtterance(text);
                
                // Opcional: Configura las propiedades de la voz
                utterance.lang = 'es-ES'; // Idioma (español de España)
                utterance.pitch = 2; // Tono
                utterance.rate = 1; // Velocidad
                utterance.volume = 1; // Volumen
                
                // Usa el SpeechSynthesis para hablar el texto
                window.speechSynthesis.speak(utterance);
            }

            // Ejemplo de uso
            textToSpeech(message);
        } else {
            console.log('La API de SpeechSynthesis no es soportada en este navegador.');
        }

        
    }



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
            listening = false;
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

    let chat_container:HTMLDivElement;
    
    function scroll_to_bottom() {
        if (chat_container) {
            setTimeout(() => {
                chat_container.scrollTop = chat_container.scrollHeight; 
            }, 0); 
        }
    }
    $: messages, scroll_to_bottom();

</script>
<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>
<main>
    <div class="border-b shadow-lg p-4 flex justify-between">
        <div>
            <h1 class="text-2xl">Contexto Actual: {context.notebook}/{context.section}/{context.note}</h1>
        </div>
        <div>
            <button on:click={logout} class="hidden md:block border-2 border-red-500 hover:bg-red-500 active:bg-red-700 p-2 rounded active:text-white hover:text-white">Cerrar Sesión</button>
        </div>
    </div>
    <div id="chat_container" class="h-[75vh] flex flex-col overflow-y-scroll no-scrollbar" bind:this={chat_container}>
        {#each messages as message}
            <MessageComponent {message}></MessageComponent>
        {/each}
    </div>

    <div class="w-full flex justify-center p-5 border-t">
        <div class="w-5/6 flex space-x-2 border  rounded p-5 shadow-lg">
            <div class="w-9/12 md:w-11/12 relative">
                <textarea on:keydown={handleKeyDown} id="UserInput" class="border rounded w-full h-full p-2" placeholder="¿De qué quieres hablar?" bind:value={user_input}></textarea>
                <button on:click={listen} id="Listen" class={`hover:border p-2 ${listening ? "text-red-500" : "text-gray-500"} rounded absolute right-3 top-3`}><Icon src={BsMicFill}></Icon></button>
            </div>
            <div class="w-3/12 md:w-1/12">
                <button on:click={ask} id="Enviar" class="bg-blue-500 p-2 w-full h-full text-white rounded">Enviar</button>
            </div>
        </div>
    </div>
</main>