import ListingAdmin from "@/components/admin/ListingAdmin";

const ActivitiesAdmin = () => (
  <ListingAdmin
    table="activities"
    title="Activities"
    titleField="name"
    subField="location"
    priceField="price"
    fields={[
      { name: "name", label: "Activity name", required: true },
      { name: "location", label: "Location", required: true },
      { name: "region", label: "Region / National Park" },
      { name: "category", label: "Category (e.g. Trekking, Safari, Cultural)" },
      { name: "price", label: "Price (USD)", type: "number", required: true },
      { name: "duration", label: "Duration (e.g. 1 day, 2 hours)" },
      { name: "rating", label: "Rating (0-5)", type: "number" },
      { name: "image_url", label: "Image URL" },
      { name: "description", label: "Description", type: "textarea" },
    ]}
  />
);
export default ActivitiesAdmin;
