// src/modules/bookings/index.ts
export { default as BookingsTablePage } from "./pages/BookingsTable";
export { default as CreateBookingPage } from "./pages/CreateBooking";
export { default as CreateBookingV2Page } from "./pages/CreateBookingV2";
export { default as MyBookingsPage } from "./pages/MyBookings";
export { default as CloseTripsPage } from "./pages/CloseTrips";

export * as bookingsService from "./services/bookings.service";
export * from "./types";