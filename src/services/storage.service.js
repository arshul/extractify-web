import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
//place config here
};

firebase.initializeApp(firebaseConfig);
export default class StorageService {
  static storage = firebase.storage();

  static db = firebase.firestore();

  static async uploadFile(file, userId) {
    console.log(file);
    const metadata = {
      contentType: file.type,
      customMetadata: {
        user: userId,
      },
    };
    const snapshot = await this.storage.ref().child(`pdfs/${file.name}`).put(file, metadata);
    console.log(snapshot);
    return snapshot;
  }
}
