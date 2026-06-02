import { Temporal } from "@js-temporal/polyfill";

/**
 * Represents a course in the TMS system.
 * Matches the Course entity from the C# backend (M1).
 */
export interface Course {
  readonly id: string;        // Cannot be changed after creation
  title: string;              // Course title
  capacity: number;           // Maximum number of students
  startDate?: Temporal.PlainDate; // Optional — not set until course is scheduled
}

/**
 * Represents the 5 possible lifecycle states of a course in the TMS.
 * Each state carries only the data meaningful for that state.
 */
export type CourseStatus =
  | { status: "DRAFT"; createdBy: string; createdAt: Temporal.Instant }
  | { status: "PUBLISHED"; publishedAt: Temporal.Instant; syllabus: string }
  | { status: "ACTIVE"; enrolledCount: number; startDate: Temporal.PlainDate }
  | { status: "ARCHIVED"; archivedAt: Temporal.Instant; finalEnrollmentCount: number }
  | { status: "CANCELLED"; reason: string; cancelledAt: Temporal.Instant };

/**
 * Returns a human-readable description of any course state.
 * The never check guarantees all states are handled at compile time.
 */
export function describeCourse(status: CourseStatus): string {
  switch (status.status) {
    case "DRAFT":
      return `Draft — created by ${status.createdBy}`;
    case "PUBLISHED":
      return `Published — syllabus: ${status.syllabus}`;
    case "ACTIVE":
      return `Active with ${status.enrolledCount} students since ${status.startDate}`;
    case "ARCHIVED":
      return `Archived — final enrollment count: ${status.finalEnrollmentCount}`;
    case "CANCELLED":
      return `Cancelled: ${status.reason}`;
    default: {
      const _check: never = status;
      throw new Error(`Unhandled status: ${JSON.stringify(_check)}`);
    }
  }
}