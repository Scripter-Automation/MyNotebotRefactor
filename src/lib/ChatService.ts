
import type { Message, Note,  Notebook, Section } from "../app";
import {v4 as uuidv4} from 'uuid';
import StorageService from "./storage.service";


export enum ChatState{
    Entire_context=0,
    Notebook_context=1,
    Section_context=2,
    Note_context=3,
    User_answer=4
}



export default class Chat{

    private messages:Message[];
    private state:ChatState=ChatState.Entire_context;
    private storage_service = new StorageService();



    private context?:{
        notebook?:string,
        section?:string,
        note?:string
    }
    private public_context = {
        notebook:"General",
        section:"General",
        note:"General"
    }



    private general_notebook?:Notebook;
    private notebooks:Notebook[]=[];
    private sections:Section[]=[];
    private action?:(...params:any[])=>void;
    private update_function:(messages:Message[])=>void;
    private update_context:(context:{notebook:string, section:string, note:string})=>void;

    private async init(){
        // Para reducir el numero de llamadas a la base de datos se guardara la informacion en el local storage
        // aun falta implementar esta funcionalidad
        try{
            this.notebooks = await this.get_all_notebooks()
            this.general_notebook = this.notebooks.filter((notebook)=>notebook.title=="General")[0];
            this.context = {
                ...this.context,
                notebook:this.general_notebook.id
            };
            console.log(this.context)
            this.sections = await this.get_all_sections(this.context?.notebook as string);
            this.context = {
                ...this.context,
                section:this.sections.filter((section)=>section.title=="General")[0].id
            }
        }catch(error){
            console.error(error)
            console.error("Error initializing chat")
        }
    }


    constructor(messages:Message[]=[], update_function:(messages:Message[])=>void, update_context:(context:{notebook:string, section:string, note:string})=>void){
        
        this.update_context = update_context;
        this.update_function = update_function;
        this.init();
        
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
                options:[
                    {text:"Nuevo cuaderno", func:this.chat_create_notebook.bind(this)},
                    {text:"Seleccionar cuaderno", func:this.chat_select_notebook.bind(this)},
                    {text:"Nueva nota", func:this.chat_create_note.bind(this)},
                    {text:"Seleccionar nota", func:this.chat_select_note.bind(this)}
                ]
            } as Message
            ]
        }else{
            this.messages = messages;
        }
    }

    public get_messages(){
        return this.messages;
    }

    public get_context(){
        return this.public_context;
    }

    private async get_all_notebooks(){
        const res = await fetch("/API/QDrant/notebook/get_all",{
            method:"GET"
        })
        return await res.json();
    }

    private async get_all_sections(notebook:string){
        const res = await fetch("/API/QDrant/section/get_all",{
            method:"POST",
            body:JSON.stringify({
                notebook:notebook
            })
        })
        return await res.json();
    }

    private async get_all_notes(){
        const res = await fetch("/API/QDrant/note/get_all",{
            method:"POST",
            body:JSON.stringify({
                notebook:this.context?.notebook as string,
                section:this.context?.section as string
            })
        })
        return await res.json();
    }

    private chat_create_notebook(){
        
        const messages=[{
            type:"normal",
            user_generated:false,
            text:"¿Cual es el nombre de tu cuaderno?, ¿Cual es el tema?, ¿Cual es la descripcion?"
        } as Message];


        this.set_state(ChatState.User_answer);
        this.set_action(this.create_notebook);
        this.update_function(messages);
    }

    private chat_select_notebook(){
            
        const options = this.notebooks.map((notebook:any)=>{
            return {text:notebook.title, func:()=>{
                this.context = {
                    notebook:notebook.id
                }
                this.public_context = {
                    ...this.public_context,
                    notebook: notebook.title
                };
                this.update_context(this.public_context);
                this.set_state(ChatState.Notebook_context);
                this.update_function([{
                    type:"menu",
                    text:"Cuaderno seleccionado, ahora puedes empezar a agregar secciones a este cuaderno",
                    options:[
                        {text:"Nueva seccion", func:this.chat_create_section.bind(this)},
                        {text:"Seleccionar seccion", func:this.chat_select_section.bind(this)},
                        {text:"Nueva nota", func: this.chat_create_note.bind(this)},
                        {text:"Seleccionar nota", func:this.chat_select_note.bind(this)}
                    ]
                } as Message])
            }}
        })
        this.update_function([{
            type:"menu",
            text:"Selecciona un cuaderno de la lista",
            options:options
        } as Message])
    }

    private async create_notebook(title:string,topic:string,description:string){
        const notebook_id = uuidv4();
        await fetch("/API/QDrant/notebook/create",{
            method:"POST",
            body:JSON.stringify({
                id: notebook_id,
                title:title,
                topic:topic,
                description:description
            })
        })
        this.set_state(ChatState.Notebook_context);
        this.context = {
            ...this.context,
            notebook:notebook_id
        }
        this.public_context = {
            ...this.public_context,
            notebook: title
        };
        this.update_context(this.public_context);
        this.create_section("General","General","This is the general section of the notebook",true);
        this.update_function([{
            type:"menu",
            text:"Cuaderno creado con exito, ahora puedes empezar a agregar secciones a este cuaderno",
            options:[
                {text:"Nueva seccion", func:this.chat_create_section.bind(this)},
                {text:"Nueva nota", func:this.chat_create_note.bind(this)}
            ]
        } as Message]);
    }

    private chat_create_section(){

        const messages=[{
            type:"normal",
            user_generated:false,
            text:"¿Cual es el nombre de la seccion?, ¿Cual es el tema?, ¿Cual es la descripcion? Usa una coma para separar las respuestas a estas preguntas"
        } as Message];

        this.set_state(ChatState.User_answer);
        this.set_action(this.create_section);
        this.update_function(messages);

    }

    private chat_select_section(){
        this.get_all_sections(this.context?.notebook as string).then((sections)=>{
            const options = sections.map((section:any)=>{
                return {text:section.title, func:()=>{
                    this.context = {
                        ...this.context,
                        section:section.id
                    }
                    this.public_context = {
                        ...this.public_context,
                        section: section.title
                    };
                    this.update_context(this.public_context);
                    this.set_state(ChatState.Section_context);
                    this.update_function([{
                        type:"menu",
                        text:"Seccion seleccionada, ahora puedes empezar a agregar notas a esta seccion. Para comenzar una nota nueva solo dime la frase 'Nueva nota'",
                        options:[
                            {text:"Nueva nota", func:this.chat_create_note.bind(this)},
                            {text:"Seleccionar nota", func:this.chat_select_note.bind(this)}
                        ]
                    } as Message])
                }}})
                this.update_function([{
                    type:"menu",
                    text:"Selecciona una seccion de la lista",
                    options:options
                } as Message])
            })
            
    }

    private async create_section(title:string,topic:string, description:string, default_section:boolean=false){
        const section_id = uuidv4();
        await fetch("/API/QDrant/section/create",{
            method:"POST",
            body:JSON.stringify({
                id:section_id,
                topic:topic,
                notebook_id:this.context?.notebook,
                title:title,
                description:description,
                notebook:this.context?.notebook
            })
        })
        if(default_section){
            this.context = {
                ...this.context,
                section:section_id
            }
            this.public_context = {
                ...this.public_context,
                section: title
            };
            this.update_context(this.public_context);
            return;
        }else{
            this.set_state(ChatState.Section_context);
            this.context = {
                ...this.context,
                section:section_id
            }
            this.update_function([{
                type:"menu",
                text:"Seccion creada con exito, ahora puedes empezar a agregar notas a esta seccion",
                options:[
                    {text:"Nueva nota", func:this.chat_create_note.bind(this)},
                ]
            } as Message]);
        }
    }

    private chat_create_note(){
        

        const messages=[{
            type:"normal",
            user_generated:false,
            text:"¿Cual seria el nombre de esta nota? No uses comas por favor."
        } as Message];

        this.update_function(messages);
        this.set_state(ChatState.User_answer);
        this.set_action(this.create_note);
    }



    private chat_select_note(){
        this.get_all_notes().then((notes)=>{
            const options = notes.map((note:any)=>{
                return {text:note.title, func:()=>{
                    this.context = {
                        ...this.context,
                        note:note.id
                    }
                    this.public_context = {
                        ...this.public_context,
                        note: note.note
                    };
                    this.update_context(this.public_context);
                    this.set_state(ChatState.Note_context);
                    this.update_function([{
                        type:"normal",
                        text:"Nota seleccionada, todo lo que hablemos ahora sera almacenado en esta nota",
                        user_generated:false
                } as Message])
                }}
            })
            this.update_function([{
                type:"menu",
                text:"Selecciona una nota de la lista",
                options:options
            } as Message])
        }).catch((err)=>{console.error(err)})
    
    }

    private async create_note(title:string){
        console.log(this.context)
        const note_id = uuidv4();
        await fetch("/API/QDrant/note/create",{
            method:"POST",
            body:JSON.stringify({
                id:note_id,
                notebook:this.context?.notebook,
                section:this.context?.section,
                title:title,
            })
        })

        this.set_action(this.add_message_to_note.bind(this));

        this.set_state(ChatState.Note_context);
        this.context = {
            ...this.context,
            note:note_id
        }
        this.update_function([{
            type:"normal",
            text:"Nota creada con exito, todo lo que hablemos ahora sera almacenado en esta nota"
        } as Message]);
    }

    private async add_message_to_note(user_prompt:string, response:string){
        await fetch("/API/QDrant/message/create",{
            method:"POST",
            body:JSON.stringify({
                id:uuidv4(),
                note_id:this.context?.note,
                notebookId:this.context?.notebook,
                sectionId:this.context?.section,
                prompt:user_prompt,
                response:response
            })
        })
    }
    

    private async chat(prompt:string){
        const res = await fetch("/API/ChatGPT",{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                prompt:prompt,
                context:this.context,
                public_context:this.public_context
            })
        })
        return await res.json();
    }

    private set_action(action:(...params:any[])=>void){
        this.action = action;
    }

    private set_state(state:ChatState){
        this.state = state;
    }

    public async respond(params:string){
        this.update_function([{
            type:"normal",
            text:params,
            user_generated:true
        } as Message]);
        if(this.state == ChatState.User_answer && this.action!=undefined){
            this.action(...params.split(","));
            if(this.public_context.notebook != "Todo"){
                this.set_state(ChatState.Notebook_context);
            }else if(this.public_context.section != "Todo"){
                this.set_state(ChatState.Section_context);
            }

        }else if(this.state == ChatState.Note_context){
            // Aqui falta poner el rag antes de mandarlo al chat 

            const res = await this.chat(params as string);
            this.update_function([{
                type:"normal",
                text:res,
                user_generated:false
            } as Message])

            this.add_message_to_note(params, res);

        }else if(this.state == ChatState.Section_context){

            const res = await this.chat(params as string);
            this.update_function([{
                type:"normal",
                text:res,
                user_generated:false
            } as Message])

        }else if(this.state == ChatState.Notebook_context){
            
            const res = await this.chat(params as string);
            this.update_function([{
                type:"normal",
                text:res,
                user_generated:false
            } as Message])
        }else{
            const res = await this.chat(params as string);
                this.update_function([{
                    type:"normal",
                    text:res,
                    user_generated:false
                } as Message])
  
        }

    }
}