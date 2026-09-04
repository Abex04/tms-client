import { test, expect } from '@playwright/test';

test('admin approves a pending enrollment', async ({ page }) => {
  await page.goto('/dashboard');

  // The dashboard heading comes from InstructorDashboardComponent's
  // template ("Instructor Command Center") - matches auth.setup.ts's
  // regex so a future copy edit doesn't silently break the handoff.
  await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible();

  // EnrollmentListComponent renders a per-row "Approve" button only
  // when the enrollment is still Pending. We click the first one and
  // assert the optimistic status flip from EnrollmentStore shows up
  // in the row's badge.
  const firstApprove = page.getByRole('button', { name: 'Approve' }).first();
  await firstApprove.click();

  // The row's status badge flips to "Approved" instantly - no
  // navigation or page reload needed.
  await expect(page.getByText('Approved').first()).toBeVisible();
});
