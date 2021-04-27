import { ComponentFactoryResolver, Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction, QuerySnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Post } from '../models/post.model';
import { Vote } from '../models/vote.model';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postCollection: AngularFirestoreCollection<Post>;
  private upvoteCollection: AngularFirestoreCollection<Vote>;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) { 
    
    this.postCollection = afs.collection('posts', ref=>ref.orderBy('timestamp', 'desc'));
    this.upvoteCollection = afs.collection('votes', ref=>ref.orderBy('timestamp', 'desc'));

  }

  CreatePost(post: Post){
    post.uid = this.afs.createId();
    this.afAuth.authState.subscribe( authState => {
      post.posteruid=authState?.uid;
      const postRef: AngularFirestoreDocument<any> = this.afs.doc(`posts/${post.uid}`);
      
      const postState: Post = {
        uid: post.uid,
        posteruid: post.posteruid,
        upvoteCount: post.upvoteCount,
        timestamp: post.timestamp,
        title: post.title,
        content: post.content,
        uservotestate: post.uservotestate
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

  VotePost(post: Post, userid: string, upvote: boolean){
    let myVote: Vote = {
      uid: '',
      postuid: '',
      upvoteState: 0,
      useruid: '',
      timestamp: new Date,
    }
    const id = this.afs.createId();
    const votesdocref: AngularFirestoreDocument<any> = this.afs.doc(`votes/${id}`);

    //Converter object to convert a firestore item into a vote
    var voteConverter = {
      toFirestore: function(vote: Vote) {
          return {
            uid: vote.uid,
            postuid: vote.postuid,
            upvoteState: vote.upvoteState,
            useruid: vote.useruid,
            timestamp: vote.timestamp,
          };
      },
      fromFirestore: function(snapshot: { data: (arg0: any) => any; }, options: any){
          const data = snapshot.data(options);
          let myVote1: Vote = {
            uid: data.uid,
            postuid: data.postuid,
            upvoteState: data.upvoteState,
            useruid: data.useruid,
            timestamp: data.timestamp,
          }
          return myVote1;
      }
    };
    //Scan the database to see if this user has already made an upvote on this post
    const voteRef = this.afs.firestore.collection(`votes`).withConverter(voteConverter).where('useruid', '==', userid).where('postuid', '==', post.uid);
    voteRef.get().then((querySnapshot) => { 
      let size = querySnapshot.size;
      if (size === 0){
        const vote: Vote = {
          uid: id,
          postuid: post.uid,
          upvoteState: 1,
          useruid: userid,
          timestamp: new Date,
        }
        if (upvote===false){
          vote.upvoteState = 0;
          post.upvoteCount--;
          this.postCollection.doc(`${post.uid}`).update(post);
        }
        else{
          post.upvoteCount++;
          this.postCollection.doc(`${post.uid}`).update(post);
        }
        votesdocref.set(vote, {
          merge: true
        });
      }
      else if (size > 0){
        querySnapshot.forEach((doc) => { 
              myVote = doc.data();
        });
        //Updating an upvote
        if (upvote===true){
          //If the vote used to be a downvote, update it to an upvote and increment upvote count on post by 2
          if (myVote.upvoteState===0){
            myVote.upvoteState=1;
            this.upvoteCollection.doc(`${myVote.uid}`).update(myVote);
            post.upvoteCount+=2;
            this.postCollection.doc(`${post.uid}`).update(post);
  
          }
          //Deleting the vote if it is an upvote
          else if (myVote.upvoteState===1){
            this.upvoteCollection.doc(`${myVote.uid}`).delete();
            post.upvoteCount--;
            this.postCollection.doc(`${post.uid}`).update(post);
  
          }
        }
        //Updating a downvote
        else{
          //If the vote used to be an upvote, update it to a downvote and decrement the upvote count on post by 2
          if (myVote.upvoteState===1){
            
            myVote.upvoteState=0;
            this.upvoteCollection.doc(`${myVote.uid}`).update(myVote);
            post.upvoteCount-=2;
            this.postCollection.doc(`${post.uid}`).update(post);
  
          }
          //Deleting the vote if it is an upvote
          else if (myVote.upvoteState===0){
            console.log(this.upvoteCollection);
            this.upvoteCollection.doc(`${myVote.uid}`).delete();
            post.upvoteCount++;
            this.postCollection.doc(`${post.uid}`).update(post);
  
          }
        }
      }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    
  }
  
  GetVoteState(post: Post, userid: string){
    //Converter object to convert a firestore item into a vote
    console.log("Call");
    var voteConverter = {
      toFirestore: function(vote: Vote) {
          return {
            uid: vote.uid,
            postuid: vote.postuid,
            upvoteState: vote.upvoteState,
            useruid: vote.useruid,
            timestamp: vote.timestamp,
          };
      },
      fromFirestore: function(snapshot: { data: (arg0: any) => any; }, options: any){
          const data = snapshot.data(options);
          let myVote1: Vote = {
            uid: data.uid,
            postuid: data.postuid,
            upvoteState: data.upvoteState,
            useruid: data.useruid,
            timestamp: data.timestamp,
          }
          return myVote1;
      }
    };
    //Scan the database to see if this user has already made an upvote on this post
    return  this.afs.firestore.collection(`votes`).withConverter(voteConverter).where('useruid', '==', userid).where('postuid', '==', post.uid);
  }


  UpdatePost(post: Post){
    this.postCollection.doc(`${post.uid}`).update(post);
  }

  DeletePostById(id: string | undefined){

    
    //Converter object to convert a firestore item into a vote
    var voteConverter = {
      toFirestore: function(vote: Vote) {
          return {
            uid: vote.uid,
            postuid: vote.postuid,
            upvoteState: vote.upvoteState,
            useruid: vote.useruid,
            timestamp: vote.timestamp,
          };
      },
      fromFirestore: function(snapshot: { data: (arg0: any) => any; }, options: any){
          const data = snapshot.data(options);
          let myVote1: Vote = {
            uid: data.uid,
            postuid: data.postuid,
            upvoteState: data.upvoteState,
            useruid: data.useruid,
            timestamp: data.timestamp,
          }
          return myVote1;
      }
    };

    this.postCollection.doc(`${id}`).delete();
    let query = this.afs.firestore.collection(`votes`).withConverter(voteConverter).where('postuid', '==', id);
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
  }
}
