import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

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

  constructor(public postService: PostService, public authService: AuthService) { }

  ngOnInit(): void {
  }

  createPost(){
    const post = {
      uid: '',
      posteruid: '',
      title: this.postTitleControl.value,
      content: this.postContentControl.value
    }
    this.postService.CreatePost(post);
  }

}
