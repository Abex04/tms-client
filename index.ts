import { Temporal } from "@js-temporal/polyfill";
import { ApiResponse, renderResponse } from "./models/api-response.model";
import { Student } from "./models/student.model";
import { Course } from "./models/course.model";

// Test with ApiResponse<Student>
const studentRes: ApiResponse<Student> = {
  status: "success",
  data: {
    id: "STU-001",
    name: "Dawit Bekele",
    enrollmentDate: Temporal.Now.instant(),
    gpa: 3.4,
  },
  fetchedAt: Temporal.Now.instant(),
};

console.log(
  renderResponse(studentRes, (s) => `${s.name} GPA: ${s.gpa ?? "N/A"}`)
);

// Test with ApiResponse<Course[]>
const courseListRes: ApiResponse<Course[]> = {
  status: "success",
  data: [
    {
      id: "CRS-101",
      title: "Web Development Fundamentals",
      capacity: 30,
      startDate: Temporal.PlainDate.from("2026-09-01"),
    },
  ],
  fetchedAt: Temporal.Now.instant(),
};

console.log(
  renderResponse(courseListRes, (courses) =>
    courses.map((c) => c.title).join(", ")
  )
);
