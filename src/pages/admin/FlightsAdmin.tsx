import ListingAdmin from "@/components/admin/ListingAdmin";

const FlightsAdmin = () => (
  <ListingAdmin
    table="flights"
    title="Flights"
    titleField="airline"
    subField="route"
    priceField="price"
    fields={[
      { name: "airline", label: "Airline", required: true },
      { name: "route", label: "Route summary (e.g. KGL → DXB)", required: true },
      { name: "from_city", label: "From city" },
      { name: "to_city", label: "To city" },
      { name: "price", label: "Price (USD)", type: "number", required: true },
      { name: "duration", label: "Duration (e.g. 6h 30m)" },
      { name: "image_url", label: "Image URL" },
      { name: "description", label: "Description", type: "textarea" },
    ]}
  />
);
export default FlightsAdmin;
