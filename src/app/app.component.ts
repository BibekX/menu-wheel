import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detectChanges();
  }
}
