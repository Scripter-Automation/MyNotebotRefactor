import { readable } from "svelte/store";
import FirebaseService from "$lib/Services/Client/FirebaseService";

const firebaseService = new FirebaseService();
export const firebaseStore = readable(firebaseService);