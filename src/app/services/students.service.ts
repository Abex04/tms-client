import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CurrentStudent {
  id: number;
  registrationNumber: string;
  name: string;
  gpa: number;
}

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private http = inject(HttpClient);

  async getMe(): Promise<CurrentStudent> {
    return firstValueFrom(
      this.http.get<CurrentStudent>('/api/v2/students/me')
    );
  }
}
