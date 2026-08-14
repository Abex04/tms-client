// Import required Angular services
// - inject: for dependency injection (similar to constructor injection in .NET)
// - HttpClient: for making HTTP requests to the .NET API
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Import RxJS operators for transforming the response
import { map } from 'rxjs/operators';
// Import our TypeScript interfaces that match the API contracts
import { Course, CourseDetail, PagedResponse } from '../models/course.model';
// M10 Session 1: environment config replaces the old hardcoded absolute
// URL. Development uses the dev-server proxy (relative path, no port);
// production points at whatever host serves the API in that environment -
// swapping environments is now a config change, not a code change.
import { environment } from '../../environments/environment';

// @Injectable() tells Angular: "This class can be injected into other classes"
// providedIn: 'root' means Angular creates one singleton instance and shares it across the entire app
// This is similar to AddSingleton<T>() in .NET's dependency injection
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  // inject(HttpClient) requests Angular's HTTP client - same pattern as inject(FormBuilder)
  // This is how we make HTTP calls to our .NET API
  private http = inject(HttpClient);

  // Base URL for the TMS API — built from environment.apiUrl rather than
  // a hardcoded 'http://localhost:5189/...'. Relative URLs like this flow
  // through the Angular dev-server proxy (proxy.conf.json) in development,
  // and through whatever reverse proxy fronts the app in production.
  private baseUrl = `${environment.apiUrl}/courses`;

  /**
   * Get all courses with pagination
   * @param page - Page number (default: 1)
   * @param pageSize - Number of items per page (default: 50)
   * @returns Observable stream that emits the course array
   *
   * This method:
   * 1. Sends a GET request to /api/v1/courses?page=1&pageSize=50
   * 2. The response is a PagedResponse<Course> envelope
   * 3. We use .pipe(map(...)) to extract only the items[] array
   * 4. The caller receives just the Course[] without paging metadata
   */
  getAll(page = 1, pageSize = 50) {
    return this.http
      .get<PagedResponse<Course>>(this.baseUrl, {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString(),
        },
      })
      .pipe(map((pagedResponse) => pagedResponse.items));
  }

  /**
   * Get a single course by its ID
   * @param id - The course ID (as a string, will be converted in the URL)
   * @returns Observable stream that emits the detailed course data
   *
   * The response includes hypermedia links (HATEOAS) for navigation
   */
  getById(id: string) {
    return this.http.get<CourseDetail>(`${this.baseUrl}/${id}`);
  }
}
