import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-firebase-todo';
  
  constructor(
    private auth: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ){
    this.matIconRegistry.addSvgIcon(
      'icon-check',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-check.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'icon-cross',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-cross.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'icon-moon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-moon.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'icon-sun',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-sun.svg')
    );
  }

  ngOnInit(){
    this.auth.initialise();
  }

}