
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';
import { ID, ImageGravity, Query } from "appwrite";
// import CreatePost from "@/_root/pages/CreatePost";
import { data, replace } from "react-router-dom";

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

export async function CreatePost(post:INewPost){
    try {
        const uploadedFile = await uploadFile(post.file[0]);
        if(!uploadedFile) throw Error;
        const fileUrl = getFilePreview(uploadedFile.$id);
        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error;
        }

        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        ) 

        if(!newPost){
            await deleteFile(uploadedFile.$id)
            throw Error;
        }
    } catch (error) {
        console.log(error)
    }
}

export async function uploadFile(file: File){
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

//@ts-ignore
export function getFilePreview(fileId: string)
{
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100,
        )

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string){
    try {
       await storage.deleteFile(appwriteConfig.storageId, fileId);
       return {status:"ok"}
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts(){
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
    )

console.log('post from db',posts)
    if(!posts) throw Error;
    return posts;
}

export async function likePost(postId: string, likesArray: string[]){
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
               likes: likesArray
            }
        )
        if(!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function savePost(postId: string, userId: string){
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
               user: userId,
               post: postId
            }
        )
        if(!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function deletesavedPost(savedRecordId: string){
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
           savedRecordId
        )
        if(!statusCode) throw Error;
        return {status: 'ok'};
    } catch (error) {
        console.log(error)
    }
}

export async function getPostById(postId: string){
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return post;
    } catch (error) {
        console.log(error)
    }
}

export async function updatePost(post:IUpdatePost){
    const hasFileToUpdate = post.file.length>0;
    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }
        if(hasFileToUpdate){
            const uploadedFile = await uploadFile(post.file[0]);
            if(!uploadedFile) throw Error;
            const fileUrl = getFilePreview(uploadedFile.$id);
            if(!fileUrl) {
                deleteFile(uploadedFile.$id);
                throw Error;
            }
            image = {...image, imageUrl:new URL(fileUrl), imageId:uploadedFile.$id}
        }
       

        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
          post.postId,
            {
               
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            }
        ) 

        if(!updatedPost){
            await deleteFile(post.imageId)
            throw Error;
        }
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function deletePost(postId: string, imageId: string){
    if(!postId|| imageId) throw Error;
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
      ) 

      return {status: 'ok'}
    } catch (error) {
        console.log(error);
    }
}

export async function getInfinitePosts({pageParam}: {pageParam: number}){
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]
if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()));
}
try {
    const posts  =await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        queries
    )
    if(!posts) throw Error;
    return posts;
} catch (error) {
    console.log(error)
}

}


export async function searchPosts(searchTerm: string){
try {
    const posts  =await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search('caption',searchTerm)]
    )
    if(!posts) throw Error;
    return posts;
} catch (error) {
    console.log(error)
}

}
