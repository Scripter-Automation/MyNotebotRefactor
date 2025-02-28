import type { PageLoad } from "./$types";
import Chat from "$lib/Services/Client/ChatService";
import type { BaseMessage } from "../../../app";

export const load: PageLoad = async ({ fetch }) => {
    
    
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
            console.log('La API de SpeechSynthesis no es soportada en este navegador. Favor de notificar a soporte.');
        }

        
    }
    

    function update_context (new_context:{notebook:string, section:string, note:string}){
        context = new_context
    }

    let messages:BaseMessage[] = [] 
    
    function update_messages(funcmessages:BaseMessage[]){
        messages = [...messages,...funcmessages]
        if(!funcmessages[funcmessages.length-1].user_generated){
            read_this(funcmessages[funcmessages.length-1].text)
        }
    }

    
    //Posiblemente este context quede remplazado y no se ocupe
    let context= {
        notebook: "General",
        section: "General",
        note: "General"
    }


    /**
     * Este apartado de aqui ocasiona que se ejecuten 3 veces el webhook que verifica al usuario. Esto podria ser reducido a uno y 
     * probablemente ocasionaria que la pagina cargara mas rapido
     */
    const chat_service = new Chat(messages, update_messages, update_context, fetch);  
    await chat_service.initialize_notebooks();
    await chat_service.initialize_sections();
    await chat_service.initialize_notes();

    messages = chat_service.get_messages();



    
    return {
        chat_service,
        messages,
        read_this
        
    }

};