import {getApps, initializeApp, type FirebaseApp} from "firebase/app"
import {type Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User} from "firebase/auth"
import {serialize} from "cookie";
import { goto } from "$app/navigation";


export default class FirebaseService{
    
    private app:FirebaseApp
    private auth:Auth
    

    constructor(){
       if(getApps().length!=0){
        this.app= getApps()[0]
       }else{

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




    public async login(email:string,password:string):Promise<void>{
        try{
            await signInWithEmailAndPassword(this.auth,email,password);
            onAuthStateChanged(this.auth,async (user:User|null)=>{
                const token = await user?.getIdToken() as string;
                await fetch("/set_cookies",{
                    method:"POST",
                    body:JSON.stringify({
                        email:email,
                        token:token
                    }),
                    headers:{
                        "Content-Type":"application/json"
                    }
                })

            },(error:Error)=>{throw new Error(error.message)})
            goto("/Private/Chat")
        }catch(err){
            throw err
        }
    }



    public async register(email:string,password:string):Promise<void>{
        try{
            await createUserWithEmailAndPassword(this.auth,email,password);
            onAuthStateChanged(this.auth,async (user:User|null)=>{
                const token = await user?.getIdToken() as string;
                await fetch("/set_cookies",{
                    method:"POST",
                    body:JSON.stringify({
                        email:email as string,
                        token:token
                    }),
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                await fetch("/register",{
                    method:"POST"
                  })


            },(error:Error)=>{throw new Error(error.message)})
            goto("/Private/Chat")
        }catch(err){
            throw err
        }
    }

    public async logout():Promise<void>{
        await signOut(this.auth);
        await fetch("/API/cookies/delete_user_cookies",{
            method:"POST"
        })
        goto("/")
    }


    public static CreateUID(length:number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }


   
}