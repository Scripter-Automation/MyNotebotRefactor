<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import {Input} from "$lib/components/ui/input";
    import {Label} from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea"
    import NotebookEndpoint from "$lib/Services/API/NotebookEndpoing";
    import { toast } from "svelte-sonner";
    import {v4 as uuidv4} from 'uuid';

    export let toggle_drawer:()=>void;

    async function handle_submit(event: SubmitEvent) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const formDataObject = Object.fromEntries(data.entries()) as { id: string; title: string; topic: string; description?: string; tags?: string };
        formDataObject.id = uuidv4();
        console.log(formDataObject);

        const res = await new NotebookEndpoint().create(formDataObject) 

        if(res.success){
            toast("request successfull");
        }else{
            toast("request failed")
        }

        toggle_drawer();
        

    }

</script>

<form class="p-2 px-10" on:submit|preventDefault={handle_submit}>
    <Label for="title">¿Cómo quieres llamar a tu cuaderno?</Label>
    <Input id="title" name="title" required type="text" placeholder="Nombre del cuaderno"/>
    <Label for="topic">¿Cuál tema del cuaderno?</Label>
    <Input id="topic" name="topic" required type="text" placeholder="Tema del cuaderno" />
    <Label for="tags">¿Etiquetas del cuaderno? (Hace falta su funcionalidad)</Label>
    <Input id="tags" name="tags" type="text" placeholder="Etiquetas del cuaderno" />
    <Label for="description">Descripción del cuaderno</Label>
    <Textarea id="description" name="description" placeholder="Escribe la descripción de tu cuaderno"/>
    <Button type="submit" class="w-full my-2">Crear</Button>
    <Button on:click={toggle_drawer} class="bg-red-500 text-white w-full hover:bg-red-700"> Cancelar </Button>
</form>