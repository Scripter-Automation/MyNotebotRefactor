<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let editor: any;

    onMount(async () => {
        // Import EditorJS dynamically to ensure it's only loaded in the browser
        const { default: EditorJS } = await import("@editorjs/editorjs");
        const {default : Header} = await import('@editorjs/header');
        const { default: List } = await import("@editorjs/list");
        const { default: Quote } = await import("@editorjs/quote");
        const { default: Table } = await import("@editorjs/table");
        const { default: DragDrop} = await import("editorjs-drag-drop");

        editor = new EditorJS({
            holder: "editorjs", // Use the correct holder property
            onReady: () => {
                new DragDrop(editor);
            },
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: true,
                    config: {
                        placeholder: "Enter a heading",
                        levels: [1, 2, 3],
                        defaultLevel: 1,
                    },
                    shortcut: "CMD+SHIFT+H"
                },list: {
                    class: List,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    },
                    shortcut: 'CMD+SHIFT+L',
                },
                quote:{
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                    shortcut: 'CMD+SHIFT+O',
                },
                table: {
                    class: Table,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                        maxRows: 5,
                        maxCols: 5,
                    },
                },
            },
        });
    });

    // Clean up the editor instance on component destruction
    onDestroy(() => {
        if (editor) {
            editor.destroy();
            editor = null;
        }
    });
</script>
<style>


</style>

<div id="editorjs"></div>
