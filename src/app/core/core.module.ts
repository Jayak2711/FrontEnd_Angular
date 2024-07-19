import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DisableButtonDirective } from './disable-button.directive';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    NavbarComponent
  ],
  providers: [AuthGuard]
})
export class CoreModule { }
