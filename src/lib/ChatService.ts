import {ChatState, type Message } from "../app";



export default class Chat{

    messages:Message[];
    state:ChatState=ChatState.Entire_context;
    action?:()=>void;



    constructor(messages:Message[]=[]){
        if(messages.length == 0){
            this.messages = [
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

                    this.set_state(ChatState.Notebook_context);
                    this.set_action(this.create_notebook);

                }}, {text:"Seleccionar cuaderno", func:()=>{

                }}, {text:"Nueva nota", func:()=>{
                    messages = [...messages, {
                        type:"normal",
                        text:'Excelente, empiece a hablar y yo comenzare a almacenar esta conversación en una area de notas generales, sin usar cuaderno'
                    } as Message]
                }}]
            } as Message
            ]
        }else{
            this.messages = messages;
        }
    }

    public get_messages(){
        return this.messages;
    }


    private create_notebook(){

    }

    private set_action(action:()=>void){
        this.action = action;
    }

    private set_state(state:ChatState){
        this.state = state;
    }

    public respond(){

    }
}