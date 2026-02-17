import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await fetch(
      "https://script.google.com/macros/s/AKfycbzOrv_09l8X6xhLs-U2yBmRs7caQjsWjX8sDB7JL5eaSr3pAP2gaJ1qehHV_jFZ73BskQ/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ success: false });
  }
}
