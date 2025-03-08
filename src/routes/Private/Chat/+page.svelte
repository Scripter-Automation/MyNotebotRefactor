<script lang="ts">
    
    import { type Context, type Note, type Notebook, type NotebookInstance,  type Section,} from "../../../types";
    import { Icon } from "svelte-icons-pack";
    import { firebaseStore } from "../../../store";
    import type FirebaseService from "$lib/Services/Client/FirebaseService";
    import { LuNotebookPen, LuBrainCircuit } from "svelte-icons-pack/lu";
    import { TrFillLayoutSidebarLeftCollapse, TrFillLayoutSidebarLeftExpand} from "svelte-icons-pack/tr";
    import SideBar from "$lib/UI/UserContentSidebar/SideBar.svelte";
    import ContextPanel from "$lib/UI/Context/ContextPanel.svelte";
    import NewItemDrawer from "$lib/UI/Drawers&Modules/ContentCreator/NewItemDrawer.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    import { BsChatLeftTextFill } from "svelte-icons-pack/bs";
    import type { PageProps } from "./$types";
    
    import ChatUi from "$lib/UI/Chat/ChatUI.svelte";
    import NotebookUi from "$lib/UI/NotebookMode/NotebookUi.svelte";

    /**
    * Gets the props loaded in the page.ts which gets the instance of the chat service and context service
    * Then intializes the necesary callbacks to allow the class to interact with the page
    */
    export let data: PageProps;
    const context_service = data.context_service;
    let content = context_service.get_content();

    /**
     * A callback function that allows the drawer to update the content of the user and share it with the 
     * side bar
     * @param new_content
     */
    function update_content(new_content:NotebookInstance[]){
        content = new_content;
    }

    /**
    * Initializes variables for the page, such as the text that the user is writing
    * into the chat, and the firebase service instance. Defines if the drawer is open and if it
    * has any context. 
    */


    let firebaseService:FirebaseService;

    let drawer_toggle:boolean = false;
    let drawer_context:string = ""

    /**
     * This function opens the drawer to create a new item
     * such as a notebook, section or note.
     */
    function toggle_drawer(){
        drawer_toggle = !drawer_toggle;
    }


    /**
     * This function sets the context of the drawer to create
     * a new item. For example defines the parent notebook or folder
     * @param context
     */
    function set_drawer_context(context:string){
        drawer_context = context;
    }


    /**
    * This function gets the firebase instance from the store and makes it available in 
    * the page. 
    */
    firebaseStore.subscribe((value)=>{
        firebaseService = value;
    })

    /**
     * Closes the user's session
     */
    async function logout(){
        await firebaseService.logout();
    }

    /**
     * Determines if the sidebar is open or closed, and also if the context bar is opened or closed 
    */
    let open = [false,false];


    let chat_class =  "h-screen flex flex-col w-full"
    $: {
        if (open[0]) {
            chat_class = "h-screen flex flex-col w-3/4";
        } else {
            chat_class = "h-screen flex flex-col w-full";
        }
    }

    /**
     * Stores the context of the chat, such as the notebooks, sections and notes that have
     * been draged and droped to be used as reference for the RAG application.
     */
    let context:Context = {notebooks:[], sections:[], notes:[]};

    /**
     * This function handles the drop event when an item is dragged and dropped into the chat
     * @param e The item being droped into the chat
     */
    function handle_drop(e:any){
        const item:Notebook|Section|Note = JSON.parse(e.dataTransfer.getData("item"));
        context[item.object_type] = [...context[item.object_type], item];
    }
    
    function allowDrop(e:any) {
        e.preventDefault();
        //console.log(e);
    }

    const Mode = {
        Chat: "chat",
        Notebook: "notebook"
    };

    let mode:string = Mode.Chat;


</script>

<div class="flex">

    <SideBar 
        {toggle_drawer}
        {set_drawer_context} 
        open={open[0]}
        {content}
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
                {#if mode == Mode.Chat}
                <button onclick={()=>mode = Mode.Notebook} class="p-2 hover:shadow-md hover:border rounded">
                    <Icon className="text-xl" src={LuNotebookPen} ></Icon>
                </button>
                {:else}
                    <button onclick={()=>mode = Mode.Chat} class="p-2 hover:shadow-md hover:border rounded">
                        <Icon className="text-xl" src={BsChatLeftTextFill} ></Icon>
                    </button>
                {/if}
                <button class="p-2 hover:shadow-md hover:border rounded" onclick={()=>open[1] = !open[1]}>
                    <Icon className="text-xl" src={LuBrainCircuit} ></Icon>
                </button>
                <button onclick={logout} class="hidden md:block border-2 border-red-500 hover:bg-red-500 active:bg-red-700 p-2 rounded active:text-white hover:text-white">Cerrar Sesión</button>
            </div>
        </div>
        <div class="flex flex-grow" ondragover={allowDrop} ondrop={handle_drop} role="main">
            <div class="flex grow">
                <main class="flex flex-col grow">
                    
                    {#if mode == Mode.Chat}
                        <ChatUi {context}/>
                    {:else}
                        <NotebookUi />
                    {/if}
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
    {content}
    {update_content}
/>

<Toaster/>