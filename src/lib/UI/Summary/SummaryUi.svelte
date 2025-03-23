<script lang="ts">
    import LLMAPIService from "$lib/SDK/LLMAPIService";
    import {ContextSummary} from "../../../store"
    let summary = ""
    ContextSummary.subscribe((context)=>{summary  = context.memory})
</script>
<div class="p-4 flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Comprensión de la conversación</h1>
    <p>Este modo sirve para observar como es que el modelo ha comprendido la conversación actual, con el propósito de maximizar la cantidad de detalle en la menor cantidad de texto posible. En vez de enviar toda la conversación al LLM, se envía este texto, el cual busca reducir la cantidad de tókenes que recibe el LLM sin sacrificar el detalle de lo que se ha conversado. Puedes editarlo si sientes que la máquina no ha logrado comprender bien lo que querías que recordara.</p>
    <h2 class="text-lg font-bold">Memoria actual</h2>
    <textarea class="bg-white text-black border rounded min-h-[500px]" bind:value={summary} onchange={()=>LLMAPIService.updateChatSummary(summary)}></textarea>
</div>