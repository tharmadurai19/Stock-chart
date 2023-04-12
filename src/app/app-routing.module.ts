import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';

const routes: Routes = [
  { path: '', redirectTo: '/stock-chart', pathMatch: 'full'},

  {
    path: 'stock-chart', component: StockChartComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
