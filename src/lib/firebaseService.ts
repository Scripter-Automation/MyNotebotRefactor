import {getApps, initializeApp, type FirebaseApp} from "firebase/app"
import {collection, Firestore, getDocs, getFirestore, doc, getDoc, query, where, setDoc, addDoc, updateDoc, runTransaction} from "firebase/firestore"
import {type Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User} from "firebase/auth"
import { redirect } from "@sveltejs/kit"
import { config } from "dotenv"

import { type FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes, type UploadResult } from "firebase/storage"

export default class FirebaseService{
    private static instance: FirebaseService;
    private app:FirebaseApp
    private db:Firestore
    private auth:Auth
    private storage:FirebaseStorage;
    private user:User|undefined|null;

    constructor(){
       if(getApps().length!=0){
        this.app= getApps()[0]
       }else{
        config();
        this.app = initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID 
        });
       }
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.storage = getStorage(this.app);
        this.user = this.auth.currentUser
    }

    public get_uid():string{
        return this.user?.uid as string
    }

    public async login(email:string,password:string):Promise<void>{
        try{
            await signInWithEmailAndPassword(this.auth,email,password);
            onAuthStateChanged(this.auth,(user:User|null)=>{
                this.user = user;
            },(error:Error)=>{throw new Error(error.message)})

        }catch(err){
            throw err
        }
    }

    public async register(email:string,password:string):Promise<void>{
        try{
            await createUserWithEmailAndPassword(this.auth,email,password);
            onAuthStateChanged(this.auth,(user:User|null)=>{
                this.user=user;   
            },(error:Error)=>{throw new Error(error.message)})

        }catch(err){
            throw err
        }
    }

    public async logout():Promise<void>{
        await signOut(this.auth);
        this.user=null;
    }

    public hasUser():boolean{
        return !(this.user==undefined || this.user==null)
    }

    public static CreateUID(length:number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@!#$%&/()=?¡¿+-^{}[]:;.,|';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }


   
}