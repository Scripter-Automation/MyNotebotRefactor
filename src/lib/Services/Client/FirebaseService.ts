import { getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { type Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { serialize } from "cookie";
import { goto } from "$app/navigation";
import type { Persistence } from "firebase/auth";
import StorageService from "./StorageService";
import EndpointUserCookies from "$lib/SDK/Cookies/EndpointUserCookies";


export default class FirebaseService {

    private app: FirebaseApp
    private auth: Auth


    constructor() {
        if (getApps().length != 0) {
            this.app = getApps()[0]
        } else {

            this.app = initializeApp({
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_FIREBASE_APP_ID,
                measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
            })

        }
        this.auth = getAuth(this.app);
    }




    public async login(email: string, password: string): Promise<void> {
        try {
            const user = await signInWithEmailAndPassword(this.auth, email, password);
            const token = await user.user.getIdToken() as string;
            await new EndpointUserCookies().create({ email: email, token: token, register: false });
            goto("/private/chat")
        } catch (err) {
            throw err
        }
    }

    public async register(email: string, password: string): Promise<void> {
        try {
            const user = await createUserWithEmailAndPassword(this.auth, email, password);
            const token = await user.user.getIdToken();
            await new EndpointUserCookies().create({ email: email, token: token, register: true });
            goto("/private/chat")
        } catch (err) {
            throw err
        }
    }

    public async logout(): Promise<void> {
        await signOut(this.auth);
        await new EndpointUserCookies().delete();
        StorageService.DeleteAll();
        goto("/")
    }


    public static CreateUID(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }



}