import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Saves enquiries from the static homepage (public/site) into the same
// Supabase "enquiries" table the existing site forms use.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const clean = (v: unknown, max = 120) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "Name and a 10-digit phone number are required" }, { status: 400 });
  }

  const exam = clean(body.exam, 20);
  const percentile = clean(body.percentile, 10);
  const interest = clean(body.interest, 40);
  const course = ["MBA/PGDM", interest && interest !== "Help me decide" ? interest : "", exam && `${exam}${percentile ? ` ${percentile} %ile` : ""}`]
    .filter(Boolean)
    .join(" · ");

  const { error } = await supabase.from("enquiries").insert([
    {
      name,
      email: clean(body.email, 120),
      phone,
      state: clean(body.city, 60),
      course,
    },
  ]);

  if (error) {
    console.error("lead insert failed:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
