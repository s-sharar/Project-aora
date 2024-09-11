import { Client, Account, ID, Storage, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.project.aora',
    projectId: '66df9d55002072ad5bcb',
    databaseId: '66dfaa0e00247f22438e',
    userCollectionId: '66dfaa3b00230e935803',
    videoCollectionId: '66dfaa5b001fba9dbc53',
    storageId: '66dfac4c002e9d2b1b29',
}


const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
export async function login(email, password) {
 try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
 } catch (error) {
    throw new Error(error.message || 'Login failed');
 }
}

export const register = async (email, password, username) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) throw Error('No acc');
        const avatarUrl = avatars.getInitials(username);
        await login(email, password);
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;
    } catch(error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () =>  {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error('ok');
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if (!currentUser) throw new Error('ok');
        return currentUser.documents[0];
    } catch(error) {
        console.log(`${error}`);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch(err) {
        throw new Error(err);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents;
    } catch(err) {
        throw new Error(err);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', query)]
        )
        return posts.documents;
    } catch(err) {
        throw new Error(err);
    }
}

export const userPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch(err) {
        throw new Error(err);
    }
}

export const signOut = async() => {
    try {
        const session = account.deleteSession('current');
        return session;
    } catch(err) {
        throw new Error(err);
    }
}

export const getFilePreview = async(fileId, type) => {
    let fileUrl;
    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(config.storageId, fileId);
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, 'top', 100);
        } else {
            throw new Error('Invalid file type')
        }
        if (!fileUrl) throw Error;
        return fileUrl;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const uploadFile = async(file, type) => {
    if (!file) return;
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }
    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const createVideo = async(form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])
        const newPost = await databases.createDocument(
            config.databaseId,
            config.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )
        return newPost;
    } catch(error) {
        throw new Error(error.message)
    }
}