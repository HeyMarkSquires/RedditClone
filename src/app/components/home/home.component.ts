import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Post } from 'src/app/post.model';
import { AuthService, User } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  template: 'Title: <input type="text"'+
  ' [formControl]="postTitleControl">',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  postTitleControl = new FormControl('');
  postContentControl = new FormControl('');
  posts: Post[] = [];
  faTimes = faTimes;
  id: string = "";
  constructor(public postService: PostService, public authService: AuthService) { }

  ngOnInit(): void {
    this.id=this.authService.GetLoggedInUserId()
    this.postService.GetPostList().subscribe(
      (posts) =>{
        this.posts = posts;
      }
    );
  }

  createPost(){
    const post = {
      uid: '',
      posteruid: '',
      timestamp: new Date,
      title: this.postTitleControl.value,
      content: this.postContentControl.value
    }
    this.postService.CreatePost(post);
  }

  deletePost(uid: string){
    this.postService.DeletePostById(uid);
  }

}
