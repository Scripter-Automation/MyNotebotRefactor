export default class SpeachService{
    user_input = "";
    listening = false
    recognition:any;

    public listen(){
        if(!this.listening){
            this.listening = true;
            if ('webkitSpeechRecognition' in window) {
                this.recognition = new webkitSpeechRecognition();
                this.recognition.continuous = true;
                this.recognition.interimResults = true;
                this.recognition.lang = 'es-ES'; // Set language to Spanish
                this.recognition.onresult = (event) => {
                    this.user_input = Array.from(event.results)
                        .map(result => result[0].transcript)
                        .join('');
                };
                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                };
            } else {
                console.warn('Speech recognition not supported in this browser.');
            }
            this.recognition.start();
        }else{
            this.listening = false;
            this.recognition.stop();
        }
        
    }

    public read_this(message:string){
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


    
}