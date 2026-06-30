import { Component } from '@angular/core';
import { AppShellComponent } from './shell/app-shell';

@Component({
  selector: 'app-root',
  imports: [AppShellComponent],
  template: '<app-shell />',
})
export class App {}
