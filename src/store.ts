import { readable } from "svelte/store";
import FirebaseService from "$lib/firebaseService";

const firebaseService = new FirebaseService();
export const firebaseStore = readable(firebaseService);