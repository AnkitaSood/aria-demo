import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShellComponent {
  fileMenuOpen = false;
  helpMenuOpen = false;

  toggleFileMenu(): void {
    this.fileMenuOpen = !this.fileMenuOpen;
    this.helpMenuOpen = false;
  }

  toggleHelpMenu(): void {
    this.helpMenuOpen = !this.helpMenuOpen;
    this.fileMenuOpen = false;
  }

  closeMenus(): void {
    this.fileMenuOpen = false;
    this.helpMenuOpen = false;
  }
}
