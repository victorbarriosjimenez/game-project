import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameplayComponent } from './gameplay.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { MaterialElementsModule  } from '../shared/material-elements.module';
import { GameplayRoutesModule } from './gameplay.routes';

/* Services */ 
import { GameplayService } from './../shared';
import { DialogComponent } from './dialog/dialog.component';
@NgModule({
  imports: [
    CommonModule,
    MaterialElementsModule,
    GameplayRoutesModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCymJ3rAVKiul5JjB_RBid-57ZnooRssw8'
    })
  ],
  declarations: [
    GameplayComponent,
    DialogComponent
],
  providers: [
    GameplayService
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class GameplayModule { }