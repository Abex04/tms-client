import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SignUp } from './signup';

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUp],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when fields are empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should be valid when all fields are correctly filled and terms are agreed', () => {
    component.form.setValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      agreeToTerms: true,
    });
    expect(component.form.valid).toBe(true);
  });

  it('should be invalid when terms are not agreed even if everything else is valid', () => {
    component.form.setValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      agreeToTerms: false,
    });
    expect(component.form.valid).toBe(false);
  });

  it('should be invalid when passwords do not match', () => {
    component.form.setValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'DifferentPass456!',
      agreeToTerms: true,
    });
    expect(component.form.valid).toBe(false);
    expect(component.form.errors?.['passwordsMismatch']).toBe(true);
  });

  it('should report weak, medium, and strong password strength correctly', () => {
    expect(component.passwordStrength()).toBe('empty');

    component.form.controls.password.setValue('short');
    expect(component.passwordStrength()).toBe('weak');

    component.form.controls.password.setValue('LongEnoughPassword');
    expect(component.passwordStrength()).toBe('medium');

    component.form.controls.password.setValue('SecurePassword123!');
    expect(component.passwordStrength()).toBe('strong');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);
  });
});
