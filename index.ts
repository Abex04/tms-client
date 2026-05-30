import { Temporal } from "@js-temporal/polyfill";
import { EnrollmentStatus, describeEnrollment } from "./models/enrollment.model";

const pending: EnrollmentStatus = {
  status: "PENDING",
  requestedAt: Temporal.Now.instant(),
  studentId: "STU-001",
  courseId: "CRS-101",
};

console.log(describeEnrollment(pending));
