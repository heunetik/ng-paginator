import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaginatorComponent } from '../components/paginator/paginator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PaginatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  onPaginationChanged(e: any) {
    console.log(e);
  }
}
