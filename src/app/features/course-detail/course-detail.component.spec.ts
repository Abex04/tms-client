import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CourseDetailComponent } from './course-detail.component';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;

  beforeEach(async () => {
    // Same NG0201 fix as CourseCardComponent - this component's template
    // uses routerLink, which needs a router context even in tests.
    await TestBed.configureTestingModule({
      imports: [CourseDetailComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;

    // id is a required signal input (normally bound from the :id route
    // param) - must be set explicitly before the component can render.
    fixture.componentRef.setInput('id', 'test-id-1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
