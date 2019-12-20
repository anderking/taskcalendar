import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { CalendarService } from 'src/app/services/calendar.service';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
    CalendarService,
    
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
