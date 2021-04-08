import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from '../post.model';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postCollection: AngularFirestoreCollection<Post>;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) { 
    
    this.postCollection = afs.collection('posts');

  }

  CreatePost(post: Post){
    post.uid = this.afs.createId();
    this.afAuth.authState.subscribe( authState => {
      post.posteruid=authState?.uid;
      const postRef: AngularFirestoreDocument<any> = this.afs.doc(`posts/${post.uid}`);

      const postState: Post = {
        uid: post.uid,
        posteruid: post.posteruid,
        title: post.title,
        content: post.content,
      }
      return postRef.set(postState, {
        merge: true
      })
    });
  }

  GetPostList(){
    const posts = this.postCollection.valueChanges();
    return posts;
  }
}
