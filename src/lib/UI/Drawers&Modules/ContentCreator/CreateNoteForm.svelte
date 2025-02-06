<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import {Input} from "$lib/components/ui/input";
    import {Label} from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea"
    import { toast } from "svelte-sonner";
    import type { NoteBuilder, NoteInstance, NotebookInstance } from "../../../../app";
    import * as Select from "$lib/components/ui/select/index.js";
    import NoteEndopoint from "$lib/Services/API/NoteEndpoint";

    export let toggle_drawer:()=>void;
    export let content:NotebookInstance[];
    export let update_content:(new_content:NotebookInstance[])=>void;
    let selected_notebook:number|undefined = undefined;
    let selected_section:number|undefined = undefined;

    async function handle_submit(event: SubmitEvent) {
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const formDataObject = Object.fromEntries(data.entries()) as NoteBuilder;
        formDataObject.notebookId = content[selected_notebook as number].id;
        formDataObject.sectionId = content[selected_notebook as number].children[selected_section as number].id;
        
       const res = await new NoteEndopoint().create(formDataObject);

        if(res.success){
            content[selected_notebook as number].children[selected_section as number].children.push(res.object as NoteInstance);
            update_content(content)
            toast(res.message);
        }else{
            toast(res.message);
        }

        toggle_drawer();
        

    }

    $: {
        if(selected_notebook == undefined){}
        else if(content[selected_notebook].children.length == 0){
            alert("No es posible crear una nota para un cuaderno sin secciones")
            selected_notebook = undefined;
        }
    }

</script>

<form class="p-2 px-10" on:submit|preventDefault={handle_submit}>
    <Label for="Cuaderno">¿A que cuaderno pertenece esta nota?</Label>
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
    <Label for="Cuaderno">¿A que sección pertenece esta nota?</Label>
    <Select.Root name="section" required={true} disabled={selected_notebook == undefined} onSelectedChange={(value:any)=>{selected_section = value.value}}>
        <Select.Trigger>
            <Select.Value placeholder="Seleccióna la sección"/>
        </Select.Trigger>
        <Select.Content>
            <Select.Group>
                {#each content[Number(selected_notebook)].children as section, i}
                    <Select.Item value={i}>{section.title}</Select.Item>
                {/each}
            </Select.Group>
        </Select.Content>
    </Select.Root>
    <Label for="title">¿Cómo quieres llamar a tu nota?</Label>
    <Input id="title" name="title" required type="text" placeholder="Nombre del cuaderno"/>
    <Label for="topic">¿Cuál tema de la nota?</Label>
    <Input id="topic" name="topic" required type="text" placeholder="Tema del cuaderno" />
    <Label for="tags">¿Etiquetas de la nota? (Hace falta su funcionalidad)</Label>
    <Input id="tags" name="tags" type="text" placeholder="Etiquetas del cuaderno" />
    <Label for="description">Descripción de la nota</Label>
    <Textarea id="description" name="description" placeholder="Escribe la descripción de tu cuaderno"/>
    <Button type="submit" class="w-full my-2">Crear</Button>
    <Button on:click={toggle_drawer} class="bg-red-500 text-white w-full hover:bg-red-700"> Cancelar </Button>
</form>