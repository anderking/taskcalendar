import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from './../model/IRequest.interface'
import { CalendarService } from 'src/app/services/calendar.service';
import { CalendarComponentOptions } from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import {
	CalendarModal,
	CalendarModalOptions,
	DayConfig,
	CalendarResult
} from 'ion2-calendar';

import * as moment from 'moment';


@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage
{

	public results: any;
	public dateStart:any="2018-12-20";
	public days:string="23";
	public country:string="VE";
	public year:string="2018";
	public dateStartRequest: any;
	public dateEnd:any;
	public dateRange:any;


	constructor(private calendarService: CalendarService,public modalCtrl: ModalController) {}

	ngOnInit()
	{	
	}


	getVacations()
	{
		if(this.dateStart!="" && this.days!="" && this.country!="")
		{
			this.dateStartRequest = moment(this.dateStart).add(1, 'd').format('YYYY-MM-DD');
			this.dateEnd = moment(this.dateStartRequest).add(this.days, 'd').format('YYYY-MM-DD');
			this.dateEnd = moment(this.dateEnd).add(-1, 'd').format('YYYY-MM-DD');
			
			this.calendarService.getVacations(this.country,this.year).subscribe
			(
				response =>
				{
					this.results = response;
					this.results = this.results.holidays
					console.log(this.results);
					this.openCalendar(this.dateStartRequest,this.dateEnd);
				},
				error =>
				{
					console.log(<any>error);
				}
			);

		}
		else
		{
			alert('Eliga los datos');
		}
	}

	async openCalendar(start,end)
	{
		//Indicamos el rango de fechas
		const dateRange:
		{
			from: Date;
			to: Date
		} =
		{
			from:  new Date(start),
			to: new Date(end)
		};

		let _daysConfig: DayConfig[] = [];

		var inicio = new Date(start);
		var fin = new Date(end);
		var timeDiff = Math.abs(fin.getTime() - inicio.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));


		//Separamos los dias de vacaciones y los agregamos a un arreglo auxiliar con una class warning

		for (var j = 0; j <= diffDays; j++)
		{
			//Para cada dia debemos preguntar si el dia actual es igual a alguna de los dias de vacaciones
			for (var i = 0; i < this.results.length; i++)
			{
				let date = new Date(this.results[i].date);
				date.setDate(date.getDate()+1);

				if (moment(inicio).format("YYYY-MM-DD")==moment(date).format("YYYY-MM-DD"))
				{
					_daysConfig.push({ date: new Date(inicio.getTime()), cssClass: 'warning' })
				}
			}

			inicio.setDate(inicio.getDate() + 1);
		}
		
		//Separamos los fines de semana y los agregamos a un arreglo auxiliar con una class yellow
		for (var j = -1; j <= diffDays; j++)
		{
			if ( (inicio.getDay() == 0 || inicio.getDay() == 6) && j!=-1)
			{
				_daysConfig.push({ date: new Date(inicio.getTime()), cssClass: 'yellow' })
			}
			inicio.setDate(inicio.getDate() - 1);
		}

		//Separamos los dias de semanas y los agregamos a un arreglo auxiliar con una class success

		for (var j = -1; j <= diffDays; j++)
		{
			if (inicio.getDay()>0 && inicio.getDay()<6 && j!=-1)
			{
				_daysConfig.push({ date: new Date(inicio.getTime()), cssClass: 'success' })
			}
			inicio.setDate(inicio.getDate() + 1);
		}

		

		/*for (var j = -1; j <= diffDays; j++)
		{
			if (inicio.getDay()>0 && inicio.getDay()<6 && j!=-1)
			{
				_daysConfig.push({ date: new Date(inicio.getTime()), cssClass: 'gray' })
			}
			inicio.setDate(inicio.getDate() - 1);
		}*/

		console.log(_daysConfig);



		const options: CalendarModalOptions =
		{
			pickMode: 'range',
			title: 'Calendario',
			color: 'dark',
			defaultDateRange: dateRange,
			//disableWeeks: [0, 6],
			weekStart: 0,
			daysConfig: _daysConfig,
			canBackwardsSelected: true,
			from:new Date(start),
			to:new Date(end),
		};

		const myCalendar = await this.modalCtrl.create({
			component: CalendarModal,
			componentProps: { options }
		});

		myCalendar.present();

		const event: any = await myCalendar.onDidDismiss();
		const date = event.data;
		date.from = start;
		date.to = end;
		const from: CalendarResult = date.from;
		const to: CalendarResult = date.to;

	}
	onChange($event)
	{
		console.log($event);
	}
}