import * as csv from "jsr:@std/csv";

const now = new Date();
const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`
const latestHotelUrl = Deno.env.get("LATEST_HOTEL_URL");
const latestReservationUrl = Deno.env.get("LATEST_RESERVATION_URL");

if (!latestHotelUrl || !latestReservationUrl) {
  throw new Error("Environment variables LATEST_HOTEL_URL and LATEST_RESERVATION_URL must be set.");
}

const latestHotel = await (await fetch(latestHotelUrl)).json();
Deno.writeTextFileSync(
  "latest_hotel.csv",
  csv.stringify(latestHotel, {columns: Object.keys(latestHotel[0]), headers: true})
)

const latestReservation = await (await fetch(latestReservationUrl)).json() as {date_visit: string}[];
Deno.writeTextFileSync(
  "latest_rsv_sum.csv",
  csv.stringify(latestReservation, {columns: Object.keys(latestReservation[0]), headers: true})
)

const backupReservation = latestReservation.filter(reservation => {
  return new Date(reservation.date_visit).getTime() >= new Date(dateStr).getTime();
})
await Deno.mkdir("data", { recursive: true });
await Deno.writeTextFile("data/" + dateStr + ".csv", csv.stringify(backupReservation, {columns: Object.keys(backupReservation[0]), headers: true}));
