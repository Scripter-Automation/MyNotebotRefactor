<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import {Input} from "$lib/components/ui/input";
    import {Label} from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea"
    import { toast } from "svelte-sonner";
    import * as Select from "$lib/components/ui/select/index.js";
    import type { NotebookInstance, SectionBuilder, SectionInstance } from "../../../../app";
    import EndpointSection from "$lib/SDK/VectorDB/EndpointSection";



    export let toggle_drawer:()=>void;
    export let content:NotebookInstance[];
    export let update_content:(new_content:NotebookInstance[])=>void;
    let selected_notebook:number;


    async function handle_submit(event: SubmitEvent) {

        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const formDataObject = Object.fromEntries(data.entries()) as SectionBuilder;
        formDataObject.notebookId = content[selected_notebook].id as string;

        const res = await new EndpointSection().create(formDataObject)

        
        
        if(res.success){
            content[selected_notebook].children?.push(res.object as SectionInstance)
            update_content(content);
            toast(res.message);
        }else{
            toast(res.message);
        }
        
        toggle_drawer();
        

    }

</script>

<form class="p-2 px-10" on:submit|preventDefault={handle_submit}>
    <Label for="Cuaderno">¿A que cuaderno pertenece esta sección?</Label>
    <Select.Root required={true} name="notebook" onSelectedChange={(value:any)=>{selected_notebook = value.value as number}} >
        <Select.Trigger>
            <Select.Value placeholder="Seleccióna el cuaderno" />
        </Select.Trigger>
        <Select.Content>
            <Select.Group>
                {#each content as notebook, i }
                    <Select.Item value={i}>{notebook.title}</Select.Item>
                {/each}
            </Select.Group>
        </Select.Content>
    </Select.Root>
    <Label for="title">¿Cómo quieres llamar a tu Seccion?</Label>
    <Input id="title" name="title" required type="text" placeholder="Nombre del cuaderno"/>
    <Label for="topic">¿Cuál tema de la sección?</Label>
    <Input id="topic" name="topic" required type="text" placeholder="Tema del cuaderno" />
    <Label for="tags">¿Etiquetas de la sección? (Hace falta su funcionalidad)</Label>
    <Input id="tags" name="tags" type="text" placeholder="Etiquetas del cuaderno" />
    <Label for="description">Descripción de la sección</Label>
    <Textarea id="description" name="description" placeholder="Escribe la descripción de tu cuaderno"/>
    <Button type="submit" class="w-full my-2">Crear</Button>
    <Button on:click={toggle_drawer} class="bg-red-500 text-white w-full hover:bg-red-700"> Cancelar </Button>
</form>