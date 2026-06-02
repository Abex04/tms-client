import { Temporal } from "@js-temporal/polyfill";

export type ApiResponse<T> =
  | { status: "loading" }                                              // Request in progress
  | { status: "success"; data: T; fetchedAt: Temporal.Instant }       // Data received
  | { status: "error"; message: string; statusCode: number };         // Request failed


export function renderResponse<T>(
  response: ApiResponse<T>,
  formatter: (data: T) => string
): string {
  switch (response.status) {
    case "loading":
      return "Loading...";
    case "success":
      return formatter(response.data);
    case "error":
      return `Error ${response.statusCode}: ${response.message}`;
      
  }
}