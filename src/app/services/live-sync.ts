import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface EnrollmentStatusEvent {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Injectable({
  providedIn: 'root',
})
export class LiveSync {
  private platformId = inject(PLATFORM_ID);
  private connection: HubConnection | null = null;
  private eventsSubject = new Subject<EnrollmentStatusEvent>();

  // Expose events as an observable — the store subscribes to this,
  // this service only manages the transport, never touches state directly.
  events$ = this.eventsSubject.asObservable();

  // Connection state signal for UI status feedback
  connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');

  connect() {
    // Guard against duplicate connections if called more than once
    if (this.connection) return;

    // SignalR uses WebSocket, which only exists in browsers, not during
    // server-side rendering. Skip connecting if not running in a browser.
    if (!isPlatformBrowser(this.platformId)) return;

    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/tms')
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    // The event name matches the ITmsHubClient method on the backend.
    // Strongly-typed hubs send the method name as the event name automatically.
    this.connection.on(
      'ReceiveEnrollmentStatusUpdated',
      (enrollmentId: string, status: 'Pending' | 'Approved' | 'Rejected') => {
        this.eventsSubject.next({ id: enrollmentId, status });
      }
    );

    this.connection.onreconnecting(() => this.connectionState.set('reconnecting'));
    this.connection.onreconnected(() => this.connectionState.set('connected'));
    this.connection.onclose(() => this.connectionState.set('disconnected'));

    this.connection
      .start()
      .then(() => this.connectionState.set('connected'))
      .catch((err) => console.error('SignalR connection error:', err));
  }
}
