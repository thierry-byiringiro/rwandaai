import { supabase } from "@/integrations/supabase/client";

export type LogBookingParams = {
  itemType: "hotel" | "activity" | "flight" | "airport_assist" | "bundle";
  itemName: string;
  itemPrice?: number | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  channel: "whatsapp" | "email" | "phone" | "form";
  notes?: string | null;
};

export const logBooking = async (p: LogBookingParams) => {
  try {
    await supabase.from("bookings").insert({
      item_type: p.itemType,
      item_name: p.itemName,
      item_price: p.itemPrice ?? null,
      customer_name: p.customerName || "Anonymous",
      customer_email: p.customerEmail ?? null,
      customer_phone: p.customerPhone ?? null,
      channel: p.channel,
      notes: p.notes ?? null,
    });
  } catch (e) {
    // Non-blocking — never break the user flow if logging fails
    console.warn("logBooking failed", e);
  }
};

export const logInquiry = async (p: {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const { error } = await supabase.from("inquiries").insert({
    name: p.name,
    email: p.email,
    phone: p.phone,
    subject: p.subject,
    message: p.message,
  });
  return { error };
};
