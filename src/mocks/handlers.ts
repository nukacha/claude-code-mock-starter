import { http, HttpResponse } from "msw";

// Add MSW request handlers here. Example:
//
// export const handlers = [
//   http.get("/api/items", () => {
//     return HttpResponse.json([{ id: 1, name: "Sample" }]);
//   }),
// ];

export const handlers = [
  http.get("/api/health", () => HttpResponse.json({ ok: true })),
];
