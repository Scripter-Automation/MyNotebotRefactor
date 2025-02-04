<script lang="ts">
    import { onMount } from "svelte";
    import type { ContentType, Context, Message, Note, Notebook, Section } from "../../../app";
    import MessageComponent from "$lib/UI/MessageComponent.svelte";
    import { BsMicFill } from "svelte-icons-pack/bs";
    import Chat from "$lib/Services/ChatService";
    import { Icon } from "svelte-icons-pack";
    import { firebaseStore } from "../../../store";
    import type FirebaseService from "$lib/Services/firebaseService";
    import { LuNotebookPen, LuBrainCircuit } from "svelte-icons-pack/lu";
    import { TrFillLayoutSidebarLeftCollapse, TrFillLayoutSidebarLeftExpand} from "svelte-icons-pack/tr";
    import { BsSendFill } from "svelte-icons-pack/bs";
    import SideBar from "$lib/UI/UserContentSidebar/SideBar.svelte";
    import ContextPanel from "$lib/UI/Context/ContextPanel.svelte";
    import NewItemDrawer from "$lib/UI/Drawers&Modules/ContentCreator/NewItemDrawer.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    import type { PageProps } from "./$types";



    let firebaseService:FirebaseService;
    let drawer_toggle:boolean = false;
    let drawer_context:string = ""

    function toggle_drawer(){
        drawer_toggle = !drawer_toggle;
    }

    function set_drawer_context(context:string){
        drawer_context = context;
    }

    firebaseStore.subscribe((value)=>{
        firebaseService = value;
    })

    async function logout(){
        await firebaseService.logout();
    }

    export let data: PageProps;
    let chat_service:Chat = data.chat_service;
    let messages:Message[] = data.messages;
    let read_this = data.read_this;

    
    function update_messages(funcmessages:Message[]){
        messages = [...messages,...funcmessages]
        if(!funcmessages[funcmessages.length-1].user_generated){
            read_this(funcmessages[funcmessages.length-1].text)
        }
    }

    chat_service.setUpdateFunction(update_messages);



    let user_input = "";
    let listening = false
    let recognition:any;
    function listen(){
        if(!listening){
            listening = true;
            if ('webkitSpeechRecognition' in window) {
                recognition = new webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'es-ES'; // Set language to Spanish
                recognition.onresult = (event) => {
                    user_input = Array.from(event.results)
                        .map(result => result[0].transcript)
                        .join('');
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

    


    let open = [false,false];


    let chat_class =  "h-screen flex flex-col w-full"
    $: {
        if (open[0]) {
            chat_class = "h-screen flex flex-col w-3/4";
        } else {
            chat_class = "h-screen flex flex-col w-full";
        }
    }

    

    let context = {notebooks:[], sections:[], notes:[]};

    


    function handle_drop(e:any){
        const item:Notebook|Section|Note = JSON.parse(e.dataTransfer.getData("item"));
        context[item.object_type] = [...context[item.object_type], item];
    }
    
    function allowDrop(e:any) {
        e.preventDefault();
        //console.log(e);
    }


</script>
<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>
<div class="flex">

    <SideBar 
        {toggle_drawer}
        {set_drawer_context} 
        open={open[0]}
        notebooks={chat_service?.notebooks}
        section={chat_service?.sections}
        notes={chat_service.notes}
    />

    <div class={chat_class}>
        <div class="shadow-sm p-4 flex justify-between items-center">
            <div>
                <button onclick={()=>open[0] = !open[0]} class="p-2 hover:shadow-md hover:border rounded">
                    {#if open[0]}
                        <Icon className="text-xl" src={TrFillLayoutSidebarLeftExpand}></Icon>
                    {:else}
                        <Icon className="text-xl" src={TrFillLayoutSidebarLeftCollapse}></Icon>
                    {/if}
                </button>
            </div>
            <div class="flex items-center space-x-2">
                <button class="p-2 hover:shadow-md hover:border rounded">
                    <Icon className="text-xl" src={LuNotebookPen} ></Icon>
                </button>
                <button class="p-2 hover:shadow-md hover:border rounded" onclick={()=>open[1] = !open[1]}>
                    <Icon className="text-xl" src={LuBrainCircuit} ></Icon>
                </button>
                <button onclick={logout} class="hidden md:block border-2 border-red-500 hover:bg-red-500 active:bg-red-700 p-2 rounded active:text-white hover:text-white">Cerrar Sesión</button>
            </div>
        </div>
        <div class="flex flex-grow" ondragover={allowDrop} ondrop={handle_drop} role="main">
            <div class="flex grow">
                <main class="flex flex-col grow">
                    <!--This is the element that should take the entire space-->
                    <div id="chat_container" class="h-full flex flex-col overflow-y-scroll no-scrollbar grow" bind:this={chat_container}>
                        {#each messages as message}
                            <MessageComponent {message}></MessageComponent>
                        {/each}
                    </div>
                    <!--This is the chatbox that should go at the bottom of the page-->
                    <div class="w-full pb-5 flex justify-center">
                        <div class="w-5/6 space-x-2 border bg-gray-200 rounded-3xl p-5 shadow-lg">
                            <div class="w-full md:w-full relative">
                                <textarea onkeydown={handleKeyDown} id="UserInput" class="focus:outline-none focus:ring-0 focus:border-transparent bg-gray-200 border rounded w-full h-full p-2" placeholder="¿De qué quieres hablar?" bind:value={user_input}></textarea>
                            </div>
                            <div class="w-full flex justify-end">
                                <button onclick={user_input != "" ? ask : listen} id="Enviar" class="flex items-center justify-center bg-black p-2 hover:opacity-70 text-white rounded-full"><Icon src={user_input != "" ? BsSendFill : BsMicFill}></Icon></button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
                <ContextPanel {context} open={open[1]}></ContextPanel>
            
        </div>
    </div>
</div>

<NewItemDrawer 
    {drawer_toggle}
    {drawer_context}
    {toggle_drawer}
/>

<Toaster/>