import { Temporal} from "@js-temporal/polyfill";

export interface EnrollmentRecord {
    readonly id: string;
    readonly courseId: string;
    enrolled: Temporal.Instant;
}