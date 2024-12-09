<script lang="ts">
    import { onMount } from "svelte";
    import type { MessageType, Message } from "../../../app";
    import MessageComponent from "$lib/UI/MessageComponent.svelte";




    let messages:Message[] = [] 
    onMount(()=>{
        if(messages.length == 0){
            messages = [...messages,
            {
                type:"menu",
                text:`
                    Bienvenido a tu chatbot personal, funciono en base a el contexto que tu me hayas hablado en el pasado. 
                    Usare el contexto de todo lo que hemos hablado para personalizar tus conversaciónes. De esta manera sera posible
                    que pueda conocerte mejor y podria incluso responder preguntas de ti o de las cosas que me hayas contado.
                    Puedo incluso hablar especificamente de un cuaderno, seccion o nota. En el siguiente menu veras las opciones de 
                    crear un nuevo cuaderno donde se empezara una conversacion en blanco e iremos agregando esta informacion a un cuaderno que despues
                    podras consultar. Al seleccionar un cuaderno este se pondra en contexto y se le agregara informacion a este cuaderno, al igual que se te dara la opción de seleccionar una seccion del cuaderno.
                    Finalmente si solo deseas conversar el chat puedes ir creando notas en general que no seran agregadas a ningun cuaderno en especifico.
                `,
                user_generated:false,
                options:[{text:"Nuevo cuaderno", func:()=>{

                    messages=[...messages,{
                        type:"normal",
                        user_generated:false,
                        text:"¿Cual es el nombre de tu cuaderno?, ¿Cual es el tema?, ¿Cual es la descripcion?"
                    } as Message];

                    document.getElementById("Enviar")?.addEventListener("click",()=>{
                        const response = document.getElementById("UserInput")?.nodeValue;
                        const values = response!.split(",")
                        messages=[...messages,{
                            type:"normal",
                            text:`Creando cuaderno con nombre ${values[0]}, para el tema ${values[1]} empecare a escribir toda nuestra conversacion es ese cuaderno`
                        } as Message]

                    },{once:true});

                }}, {text:"Seleccionar cuaderno", func:()=>{

                }}, {text:"Nueva nota", func:()=>{
                    messages = [...messages, {
                        type:"normal",
                        text:'Excelente, empiece a hablar y yo comenzare a almacenar esta conversación en una area de notas generales, sin usar cuaderno'
                    } as Message]
                }}]
            } as Message
            ]
        }
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
        //const rag = new RagService("123456789");
        //rag.ask(user_input);
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