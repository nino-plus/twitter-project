import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AboutComponent } from '../welcome/about/about.component';

@NgModule({
  declarations: [WelcomeComponent, AboutComponent],
  imports: [CommonModule, WelcomeRoutingModule, MatCardModule, MatButtonModule],
})
export class WelcomeModule {}
