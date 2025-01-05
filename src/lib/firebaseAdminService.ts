import { initializeApp, getApps, type App, cert } from 'firebase-admin/app';
import { Auth, getAuth, UserRecord, type DecodedIdToken } from 'firebase-admin/auth';
import { config } from 'dotenv';
export default class FirebaseAdminService {
    private app: App;
    private auth: Auth;
    private user?: UserRecord;
    private static instance: FirebaseAdminService;

    private constructor(email?: string) {
        if (getApps().length != 0) {
            this.app = getApps()[0];
            this.auth = getAuth(this.app);
        } else {
            if (process.env.NODE_ENV !== 'production') { config(); }
            this.app = initializeApp({
                credential:cert({
                    projectId:process.env.FIREBASE_PROJECT_ID,
                    privateKey:process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    clientEmail:process.env.FIREBASE_CLIENT_EMAIL
                })
            });
            
            this.auth = getAuth(this.app);
            if (!email) {
                throw new Error("Email is required on initialization");
            }
            this.init(email);
        }
    }

    public static getInstance(email?: string): FirebaseAdminService {
        if (!FirebaseAdminService.instance) {
            FirebaseAdminService.instance = new FirebaseAdminService(email);
        }
        return FirebaseAdminService.instance;
    }

    private async init(email: string) {
        this.user = await this.auth.getUserByEmail(email);
    }

    public getUser(): UserRecord | undefined {
        return this.user;
    }

    public async validate_token(token:string):Promise<DecodedIdToken|null>{
        if(!token){
            return null;
        }
        return await getAuth(this.app).verifyIdToken(token);
    }

    public get_uid():string|undefined{
        if(!this.user){
            return undefined;
        }
        return this.user.uid;
    }
    
}