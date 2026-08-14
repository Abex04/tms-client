import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { exhaustMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Grade, GradePayload } from '../../services/grade';

@Component({
  selector: 'app-grade-submission',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './grade-submission.html',
  styleUrl: './grade-submission.scss',
})
export class GradeSubmission {
  private fb = inject(FormBuilder);
  private gradeService = inject(Grade);

  gradeForm = this.fb.group({
    studentId: [101, [Validators.required, Validators.min(1)]],
    courseId: [302, [Validators.required, Validators.min(1)]],
    score: [88, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  isSubmitting = signal(false);
  submitCount = signal(0);
  submissionStatus = signal('');

  // submitClick$ collects every click. exhaustMap ignores new clicks while
  // a submission is already in flight — it does NOT queue them, so 10 rapid
  // clicks during a slow request produce exactly 1 POST, not 10.
  private submitClick$ = new Subject<GradePayload>();

  constructor() {
    this.submitClick$
      .pipe(
        exhaustMap((payload) => {
          this.isSubmitting.set(true);
          this.submitCount.update((n) => n + 1);
          this.submissionStatus.set('Submitting grade to server...');
          return this.gradeService.postGrade(payload).pipe(
            tap((result) => {
              this.isSubmitting.set(false);
              this.submissionStatus.set(`Grade saved successfully! Record ID: ${result.id}`);
            }),
            catchError((err) => {
              this.isSubmitting.set(false);
              this.submissionStatus.set(`Submission failed: ${err.message || 'Server error'}`);
              return of(null);
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  onSubmit() {
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      return;
    }
    const raw = this.gradeForm.getRawValue();
    this.submitClick$.next({
      studentId: Number(raw.studentId),
      courseId: Number(raw.courseId),
      score: Number(raw.score),
    });
  }
}
