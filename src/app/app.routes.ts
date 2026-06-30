import { Routes } from '@angular/router';
import { SessionSubmissionComponent } from './features/session-submission/session-submission';

export const routes: Routes = [
  { path: '', component: SessionSubmissionComponent },
  { path: '**', redirectTo: '' },
];
