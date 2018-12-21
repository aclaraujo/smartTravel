import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MovimentoPage } from './movimento';

@NgModule({
  declarations: [
    MovimentoPage
  ],
  imports: [
    IonicPageModule.forChild(MovimentoPage),
  ],
})
export class MovimentoPageModule {}
