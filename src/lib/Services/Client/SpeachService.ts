export default class SpeachService{
    user_text = "";
    recognition=null;
    isListening = false;
    transcript = '';

    // Check for microphone permission
    async checkMicrophonePermission() {
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
            if (permissionStatus.state === 'granted') {
                this.startRecognition();
            } else if (permissionStatus.state === 'prompt') {
                this.requestMicrophonePermission();
            } else {
                console.warn('Microphone access denied');
            }
        } catch (error) {
            console.error('Error checking microphone permission', error);
        }
    }

    public get_transcript(){
        return this.transcript;
    }


    // Request microphone permission
    async requestMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.startRecognition();
        } catch (error) {
            console.error('Microphone permission denied', error);
        }
    }
    constructor(){
        this.checkMicrophonePermission();
    }
    // Start speech recognition
    startRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'es-ES'; // Set language to Spanish
            this.recognition.onresult = (event) => {
                this.transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
            };
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
            };
        } else {
            console.warn('Speech recognition not supported in this browser.');
        }
    }

    toggleListening(){
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
        this.isListening = !isListening;
    }

    
}