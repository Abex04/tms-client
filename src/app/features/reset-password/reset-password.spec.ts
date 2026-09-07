import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ResetPassword } from './reset-password';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when fields are empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should be invalid with a weak password', () => {
    component.form.setValue({ email: 'jane@example.com', token: 'sometoken', newPassword: 'weak' });
    expect(component.form.valid).toBe(false);
  });

  it('should be valid with a strong password', () => {
    component.form.setValue({ email: 'jane@example.com', token: 'sometoken', newPassword: 'SecurePass123!' });
    expect(component.form.valid).toBe(true);
  });
});
