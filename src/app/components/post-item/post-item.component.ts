import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';
import { Vote } from 'src/app/models/vote.model';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  faTimes = faTimes;
  faPen = faPen;
  faArrowAltCircleUp = faArrowAltCircleUp;
  faArrowAltCircleDown = faArrowAltCircleDown;
  editMode = false;
  postContentControl = new FormControl('');
  voteState = 0;
  id: string = "";
  @Input() post: Post;
  constructor(public postService: PostService, public authService: AuthService) { 
    this.post = {
      uid: '',
      content: '',
      title: '',
      posteruid: '',
      upvoteCount: 0,
      timestamp: new Date,
      uservotestate: ''
    }
    this.id=this.authService.GetLoggedInUserId();
  }

  ngOnInit(): void {
    this.postService.GetVoteState(this.post, this.id).get().then((querySnapshot) => { 
          let size = querySnapshot.size;
          if (size = 0){
            this.voteState = 0
          }
          else{
            querySnapshot.forEach((doc) => { 
              let v = doc.data().upvoteState;
              //If the vote is an upvote
              if (v === 1){
                this.voteState = 1;
              }
              //If the vote is a downvote
              else{
                this.voteState = 2;
              }
            });
          }
          console.log("Post "+this.post.uid+": "+this.voteState);
    });;
  }

  setEditMode(){
    this.editMode = this.editMode ? this.editMode=false: this.editMode=true;
  }

  updateContent(){
    this.post.content = this.postContentControl.value;
    this.postContentControl = new FormControl('');
    this.postService.UpdatePost(this.post);
    this.setEditMode();
  }

  upvotePost(){
    this.postService.VotePost(this.post, this.id, true);
  }

  downvotePost(){
    this.postService.VotePost(this.post, this.id, false);
  }
  

  deletePost(uid: string | undefined){
    this.postService.DeletePostById(uid);
  }

}
