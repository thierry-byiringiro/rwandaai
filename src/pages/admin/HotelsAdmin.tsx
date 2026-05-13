import ListingAdmin from "@/components/admin/ListingAdmin";

const HotelsAdmin = () => (
  <ListingAdmin
    table="hotels"
    title="Hotels"
    titleField="name"
    subField="location"
    priceField="price_per_night"
    fields={[
      { name: "name", label: "Hotel name", required: true },
      { name: "location", label: "Location (city/area)", required: true },
      { name: "region", label: "Region (e.g. Kigali, Musanze)" },
      { name: "price_per_night", label: "Price per night (USD)", type: "number", required: true },
      { name: "rating", label: "Rating (0-5)", type: "number" },
      { name: "image_url", label: "Image URL" },
      { name: "description", label: "Description", type: "textarea" },
    ]}
  />
);
export default HotelsAdmin;
