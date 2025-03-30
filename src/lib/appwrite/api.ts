
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from './config';
import { ID, Query } from "appwrite";

// import { url } from 'inspector';
export async function createUserAccount(user:INewUser) {
    try {
       const newAccount = await account.create(
       ID.unique(),
       user.email,
       user.password,
       user.name
       );

       if(!newAccount) throw Error;

       const avatarUrl = avatars.getInitials(user.name);

       const newUser = await saveUSerToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: new URL(avatarUrl),
       })
       return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUSerToDB(user:{
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?:string;
}) {
    try {
       const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user,
       )

       return newUser;
    } catch (error) {
        console.log(error)
    }
}

export async function SignInAccount(user: {email: string; password: string;
}){
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password)
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser(){
    try {
       const currentAccount = await account.get();
       console.log("current user is ",currentAccount);
       if(!currentAccount) throw Error;
       const CurrentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId',currentAccount.$id)]
       )

       if(!CurrentUser) throw Error;

       return CurrentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}


export async function SignOutAccount(){
    try {
        const session = await account.deleteSession("current")
        console.log(session);
        return session;
    } catch (error) {
        console.log(error);
    }
}