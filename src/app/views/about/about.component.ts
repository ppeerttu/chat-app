import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
    templateUrl: './about.component.html',
    styleUrls: [ 'about.component.css' ]
})

export class AboutComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
