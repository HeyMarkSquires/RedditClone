import { Component, ElementRef, OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  faGoogle = faGoogle;
  constructor(private elementRef: ElementRef, public authService: AuthService) { }

  ngOnInit(): void {
  }

  
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'rgb(49, 49, 49)';
    this.elementRef.nativeElement.ownerDocument.body.style.margin = '0px';
 }

}
