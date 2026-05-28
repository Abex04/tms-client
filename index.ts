import { Temporal } from "@js-temporal/polyfill";
import { Student, isStudent, parseStudent } from "./models/student.model";

// Test isStudent — type guard
function processStudent(raw: unknown) {
  if (isStudent(raw)) {
    const gpaDisplay = raw.gpa?.toFixed(2) ?? "Not yet graded";
    console.log(`Student ${raw.name} GPA: ${gpaDisplay}`);
  } else {
    console.error("Invalid student data received");
  }
}

// Valid student — should print student info
processStudent({ id: "STU-001", name: "Hana", gpa: 3.7 });

// Invalid — should print error message
processStudent(42);

// Test parseStudent — throws on invalid data
console.log(parseStudent({ id: "STU-001", name: "Hana" }));

// This should throw a TypeError
parseStudent({ id: 42, name: "Test" });