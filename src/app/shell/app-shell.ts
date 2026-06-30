import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuBar, Menu, MenuItem, MenuTrigger } from '@angular/aria/menu';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, MenuBar, Menu, MenuItem, MenuTrigger],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShellComponent {}
