import { Temporal } from "@js-temporal/polyfill";
export interface Quiz {
  readonly id: string;  
  kind: "quiz";          
  title: string;
  correctAnswers: number;
  totalQuestions: number;
}
export interface LabAssignment {
  readonly id: string;   
  kind: "lab";           
  title: string;
  functionalityScore: number;
  codeQualityScore: number;
}
export type AssessmentItem = Quiz | LabAssignment;

/**
 * Calculates the grade for any assessment item.
 * Uses the 'kind' discriminant to determine which formula to apply.
 * The compiler enforces that all variants are handled — if you add a new
 * assessment type and forget to handle it here, you get a compile error.
 */
export function calculateGrade(item: AssessmentItem): number {
  switch (item.kind) {
    case "quiz":
      // Quiz grade: correct answers / total questions * 100
      return Math.round((item.correctAnswers / item.totalQuestions) * 100);
    case "lab":
      // Lab grade: functionality is worth 70%, code quality is worth 30%
      return Math.round(
        item.functionalityScore * 0.7 + item.codeQualityScore * 0.3
      );
  }
}