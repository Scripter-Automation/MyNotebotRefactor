<script lang="ts">
  import * as Drawer from "$lib/components/ui/drawer";
  import CreateNotebookForm from "./CreateNotebookForm.svelte";
  export let drawer_toggle:boolean = false;
  export let drawer_context:string = "";
  export let toggle_drawer:()=>void;

  const title:{[key:string]:string} = {
    notebook: "Estas a punto de crear un cuaderno"
  }

  const text:{[key:string]:string} = {
    notebook: `
      Crear un cuaderno te permite separar diferentes temas, los cuales podras
      almacenar secciones y notas. Es recomendable crear un cuaderno cuando el tema
      que quieres crear no es cubierto por ninguno de los otros temas que tienes en otros cuadernos.
      Si el tema es similar a otro cuaderno es mejor utilizar una sección
      `
  }


</script>

<Drawer.Root open={drawer_toggle}>
    <Drawer.Trigger>Open</Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>{title[drawer_context]}</Drawer.Title>
        <Drawer.Description>{text[drawer_context]}</Drawer.Description>
      </Drawer.Header>
      <CreateNotebookForm {toggle_drawer}/>
      
    </Drawer.Content>
</Drawer.Root>