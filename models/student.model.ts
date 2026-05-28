import { Temporal } from "@js-temporal/polyfill";

/**
 * Represents a student in the TMS system.
 * Matches the Student entity from the C# backend (M1).
 */
export interface Student {
  readonly id: string;              // Cannot be changed after creation
  name: string;                     // Full name of the student
  enrollmentDate: Temporal.Instant; // Modern date/time — replaces legacy Date
  gpa?: number;                     // Optional — undefined until student receives a grade
}

/**
 * Type guard — checks if an unknown API response has the shape of a Student.
 * Use this when you want to handle both valid and invalid data gracefully.
 * Returns true and narrows the type to Student inside an if block.
 */
export function isStudent(value: unknown): value is Student {
  return (
    typeof value === "object" &&   // Must be an object (not a primitive)
    value !== null &&              // null is typeof "object" — exclude it explicitly
    "id" in value &&               // Must have an id property
    "name" in value &&             // Must have a name property
    typeof (value as Record<string, unknown>).id === "string" &&   // id must be a string
    typeof (value as Record<string, unknown>).name === "string"    // name must be a string
  );
}

/**
 * Parse function — either returns a valid Student or throws a descriptive error.
 * Use this when invalid data should stop execution immediately.
 * Unlike isStudent, the caller does not need to handle the invalid case.
 */
export function parseStudent(raw: unknown): Student {
  // Must be a non-null object
  if (typeof raw !== "object" || raw === null) {
    throw new TypeError(
      `Expected an object, received ${raw === null ? "null" : typeof raw}`
    );
  }

  const obj = raw as Record<string, unknown>;

  // id must be a string
  if (typeof obj.id !== "string") {
    throw new TypeError(
      `Expected id to be a string, received ${typeof obj.id}`
    );
  }

  // name must be a string
  if (typeof obj.name !== "string") {
    throw new TypeError(
      `Expected name to be a string, received ${typeof obj.name}`
    );
  }

  // All checks passed — return a valid Student
  return {
    id: obj.id,
    name: obj.name,
    enrollmentDate: Temporal.Now.instant(),
  };
}