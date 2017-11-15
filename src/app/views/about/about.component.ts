import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
    templateUrl: './about.component.html',
    styleUrls: [ 'about.component.css' ]
})

export class AboutComponent {
  constructor(
    private location: Location,
    private router: Router
  ) {}

  goBack(): void {
    // If the history has only one object, we've probably coming from the chat window
    if (window.history.length <= 1) {
      this.router.navigateByUrl('/chat');
    } else {
      this.location.back();
    }
  }
}
