import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';

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
  voteState = 66;
  id: string = "";
  @Input() post: Post;
  constructor(public postService: PostService, public authService: AuthService) { 
    this.post = {
      uid: '',
      content: '',
      title: '',
      posteruid: '',
      upvoteCount: 0,
      timestamp: new Date
    }
  }

  ngOnInit(): void {
    this.id=this.authService.GetLoggedInUserId();
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
