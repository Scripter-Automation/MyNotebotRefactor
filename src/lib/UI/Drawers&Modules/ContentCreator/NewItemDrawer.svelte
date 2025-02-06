<script lang="ts">
  import * as Drawer from "$lib/components/ui/drawer";
  
  import CreateNotebookForm from "./CreateNotebookForm.svelte";
  import CreateNoteForm from "./CreateNoteForm.svelte";
  import CreateSectionForm from "./CreateSectionForm.svelte";
  import type {NotebookInstance} from "../../../../app";
  export let drawer_toggle: boolean = false;
  export let drawer_context: string = "";
  export let toggle_drawer: () => void;
  export let content:NotebookInstance[]
  export let update_content:(new_content:NotebookInstance[])=>void;
  const title: { [key: string]: string } = {
    notebooks: "Estas a punto de crear un cuaderno",
    sections: "Estas a punto de crear una seccion",
    notes: "Estas a punto de crear una nota"
  };

  const text: { [key: string]: string } = {
    notebooks: `
      Crear un cuaderno te permite separar diferentes temas, los cuales podras
      almacenar secciones y notas. Es recomendable crear un cuaderno cuando el tema
      que quieres crear no es cubierto por ninguno de los otros temas que tienes en otros cuadernos.
      Si el tema es similar a otro cuaderno es mejor utilizar una sección.
      `,
    sections: `
      Crear una sección crea una sub division en un cuaderno, lo cual te permite generar notas
      que esten dentro de un sub tema. Esto es util cuando quieres tener en memoria unicamente
      cierto sub tema en vez de buscar en todos tus datos o en todo un cuaderno.
    `,
    notes: `
      Crear una nota sirve para separar las distintas anotaciónes de un subtema o de un cuaderno.
      Mientras que una sección solamente puede existir dentro de una cuaderno, una nota puede existir unicamente
      dentro de una sección. Por lo cual si no se desea utilizar una sección en especifico se recomiendo utilizar
      la sección general del cuaderno.
    `
  };

  const drawer_map: { [key: string]: typeof CreateNotebookForm | typeof CreateSectionForm | typeof CreateNoteForm } = {
    notebooks: CreateNotebookForm,
    sections: CreateSectionForm,
    notes: CreateNoteForm
  };

</script>

<Drawer.Root open={drawer_toggle}>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>{title[drawer_context]}</Drawer.Title>
      <Drawer.Description>{text[drawer_context]}</Drawer.Description>
    </Drawer.Header>
    <svelte:component this={drawer_map[drawer_context]} {toggle_drawer} {content} {update_content} ></svelte:component>
  </Drawer.Content>
</Drawer.Root>