import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CourseCardComponent } from './course-card.component';

describe('CourseCardComponent', () => {
  let fixture: ComponentFixture<CourseCardComponent>;

  beforeEach(() => {
    // CourseCardComponent's template uses routerLink - without a router
    // provider, RouterLink's constructor fails with NG0201 (No provider
    // found for ActivatedRoute). provideRouter([]) is enough to satisfy
    // that dependency without needing any real routes defined.
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should display the course title', async () => {
    fixture = TestBed.createComponent(CourseCardComponent);

    // Signal-based required inputs can't be set via plain property
    // assignment in tests - setInput() is the API that actually
    // triggers change detection for an input() signal.
    fixture.componentRef.setInput('course', {
      id: 1,
      code: 'CSE-101',
      title: 'Advanced Web Dev',
      maxCapacity: 30,
      enrollmentCount: 12,
    });
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Advanced Web Dev');
  });

  it('should emit enrollClicked event when button is clicked', async () => {
    fixture = TestBed.createComponent(CourseCardComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('course', {
      id: 1,
      code: 'CSE-101',
      title: 'Advanced Web Dev',
      maxCapacity: 30,
      enrollmentCount: 12,
    });
    await fixture.whenStable();

    let emittedCourse: any = null;
    component.enrollClicked.subscribe((c: any) => (emittedCourse = c));

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(emittedCourse).toBeTruthy();
    expect(emittedCourse.title).toBe('Advanced Web Dev');
  });
});
