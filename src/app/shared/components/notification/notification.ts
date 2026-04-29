import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LayoutService } from '@core/services/layout.service';

@Component({
  selector: 'app-notification',
  imports: [NgClass],
  templateUrl: './notification.html',
})
export class Notification {
  protected layoutService = inject(LayoutService);
}
