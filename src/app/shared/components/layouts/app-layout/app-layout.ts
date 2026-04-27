import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@core/services/layout.service';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet],
  templateUrl: './app-layout.html',
})
export class AppLayout {
  protected layoutService = inject(LayoutService);
}
