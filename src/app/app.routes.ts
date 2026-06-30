import { Routes } from '@angular/router';
import { SessionSubmissionComponent } from './features/session-submission/session-submission';

export const routes: Routes = [
  { path: 'submit', component: SessionSubmissionComponent },
  { path: '**', redirectTo: '' },
];
