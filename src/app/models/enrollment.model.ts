/**
 * Enrollment model - matches the API response from EnrollmentResponseDto
 */
export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  enrolledAt: string;
  // Note: status, studentName, and courseName are not in the API response
  // We'll add computed fields in the component if needed
}
