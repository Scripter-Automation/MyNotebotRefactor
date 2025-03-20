<script lang="ts">
  import type FirebaseService from "$lib/Services/Client/FirebaseService";
  import { toast, Toaster } from "svelte-sonner";
  import { firebaseStore } from "../store";

  let register: boolean = false;
  let firebaseService: FirebaseService;

  firebaseStore.subscribe((value) => {
    firebaseService = value;
  });

  async function login() {
    toast.loading("Iniciando sesion");

    const form = document.querySelector("form") as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await firebaseService.login(email, password);
      toast.success("Sesion iniciada");
    } catch (err: any) {
      if (err["code"]?.includes("invalid-credential")) {
        console.error({
          email,
          error: true,
          message: "Invalid username or password",
        });
        toast.error("Contraseña o usuario incorrecto");
      } else if (err["code"]?.includes("user-not-found")) {
        console.error({ email, error: true, message: "User not found" });
        toast.error("usuario no encontrado");
      } else {
        console.error(err);
        console.error({
          email,
          error: true,
          message: "Something went wrong contact support",
        });
        toast.error(
          "Algo salio mal, revisa tu coneccion a internet. Si el problema persiste contacta soporte",
        );
      }
    }
  }

  async function register_fn() {
    toast.loading("Registrando");

    const form = document.querySelector("form") as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await firebaseService.register(email, password);
      toast.success("Usuario registrado");
    } catch (err: any) {
      if (err["code"]?.includes("email-already-in-use")) {
        console.error({ email, error: true, message: "Email already in use" });
        toast.error("Email ya esta en uso");
      } else if (err["code"]?.includes("weak-password")) {
        console.error({ email, error: true, message: "Weak password" });
        toast.error(
          "La contraseña es debil, favor de intentar con una contraseña mas segura",
        );
      } else {
        console.error({
          email,
          error: true,
          message: "Something went wrong contact support",
        });
        toast.error(
          "Algo salio mal, revisa tu coneccion a internet. Si el problema persiste contacta soporte",
        );
      }
    }
  }
</script>

{#if !register}
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
      >
        Iniciar Session
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" on:submit|preventDefault={login}>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900"
            >Correo Electronico</label
          >
          <div class="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-900"
              >Contraseña</label
            >
            <div class="text-sm">
              <a
                href="a"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
                >¿Olvidaste tu contraseña?</a
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Iniciar Session</button
          >
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        ¿No tienes cuenta?
        <button
          on:click={() => {
            register = !register;
          }}
          class="font-semibold text-indigo-600 hover:text-indigo-500"
          >Inicia tu prueba gratis de 14 días</button
        >
      </p>
    </div>
  </div>
{:else}
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
      >
        Crear una cuenta
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" on:submit|preventDefault={register_fn}>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900"
            >Correo Electronico</label
          >
          <div class="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-start">
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-900"
              >Contraseña</label
            >
          </div>
          <div class="mt-2">
            <input
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Crear Cuenta</button
          >
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        ¿Ya tienes cuenta?
        <button
          on:click={() => {
            register = !register;
          }}
          class="font-semibold text-indigo-600 hover:text-indigo-500"
          >Iniciar Session</button
        >
      </p>
    </div>
  </div>
{/if}
<Toaster />
