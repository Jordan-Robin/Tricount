import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notification } from '@shared/components/notification/notification';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, Notification],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
