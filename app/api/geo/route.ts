import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  request.headers.get("x-forwarded-for");
  const country = request.headers.get("x-vercel-ip-country") ?? "";
  const region = country.toUpperCase() === "CN" ? "cn" : "global";

  return NextResponse.json({
    region,
  });
}
