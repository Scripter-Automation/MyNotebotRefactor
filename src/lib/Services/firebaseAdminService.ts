import { initializeApp, getApps, type App, cert } from 'firebase-admin/app';
import { Auth, getAuth, UserRecord, type DecodedIdToken } from 'firebase-admin/auth';
import { config } from 'dotenv';
export default class FirebaseAdminService {
    private app: App;
    private auth: Auth;
    private static instance: FirebaseAdminService;

    private constructor() {
        if (getApps().length != 0) {
            this.app = getApps()[0];
            this.auth = getAuth(this.app);
        } else {
            if (process.env.NODE_ENV !== 'production') { config(); }
            this.app = initializeApp({
                credential:cert({
                    projectId:process.env.FIREBASE_PROJECT_ID,
                    privateKey:process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    clientEmail:process.env.FIREBASE_CLIENT_EMAIL,
                })
            });
            
            this.auth = getAuth(this.app);

        }
    }

    public static async getInstance(): Promise<FirebaseAdminService> {
        if (!FirebaseAdminService.instance) {
            FirebaseAdminService.instance = new FirebaseAdminService();
        }
        return FirebaseAdminService.instance;
    }



    public async getUser(email?: string): Promise <UserRecord | undefined> {
        if(!email){
            return undefined;
        }
        return await this.auth.getUserByEmail(email);
    }

    public async validate_token(token:string):Promise<DecodedIdToken|null>{
        if(!token){
            return null;
        }
        return await getAuth(this.app).verifyIdToken(token);
    }

    public get_uid(user?:UserRecord):string|undefined{
        if(!user){
            return undefined;
        }
        return user.uid;
    }
    
}