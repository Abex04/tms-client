import { Temporal } from "@js-temporal/polyfill";
import { CourseStatus, describeCourse } from "./models/course.model";

const webDev: CourseStatus = {
  status: "ACTIVE",
  enrolledCount: 28,
  startDate: Temporal.PlainDate.from("2026-09-01"),
};

console.log(describeCourse(webDev));
