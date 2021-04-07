import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit  {
  title = 'angular-firebase-crud';

  constructor(private elementRef: ElementRef, public authService: AuthService){
  }
  
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'rgb(49, 49, 49)';
 }
}
