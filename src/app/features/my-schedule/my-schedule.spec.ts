import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MySchedule } from './my-schedule';

describe('MySchedule', () => {
  let component: MySchedule;
  let fixture: ComponentFixture<MySchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySchedule],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MySchedule);
    component = fixture.componentInstance;
    // No whenStable() - constructor triggers real HTTP calls that
    // provideHttpClientTesting() leaves pending; see StudentDashboardComponent.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
