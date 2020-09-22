import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainShellComponent } from './main-shell/main-shell.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: {
      root: true,
    },
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomeModule),
      // Guard挿入お願いします
  },
  // {
  //   path: '',
  //   component: MainShellComponent,
  //   children: [
  //     {
  //       // Top Componentが入ります
  //     },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
