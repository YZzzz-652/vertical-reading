import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TILEJSON_HOST = "wmts.oldmapsonline.org";

type TileJsonResponse = {
  tiles?: string[];
};

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");

  if (!source) {
    return NextResponse.json({ success: false, error: "Missing TileJSON URL" }, { status: 400 });
  }

  let tileJsonUrl: URL;
  try {
    tileJsonUrl = new URL(source);
  } catch {
    return NextResponse.json({ success: false, error: "Invalid TileJSON URL" }, { status: 400 });
  }

  if (tileJsonUrl.protocol !== "https:" || tileJsonUrl.hostname !== ALLOWED_TILEJSON_HOST) {
    return NextResponse.json({ success: false, error: "Unsupported TileJSON URL" }, { status: 400 });
  }

  try {
    const response = await fetch(tileJsonUrl, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `TileJSON request failed: ${response.status}` },
        { status: 502 },
      );
    }

    const data = (await response.json()) as TileJsonResponse;
    const tileUrl = data.tiles?.[0];

    if (!tileUrl) {
      return NextResponse.json({ success: false, error: "TileJSON missing tiles[0]" }, { status: 502 });
    }

    return NextResponse.json({ success: true, tileUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "TileJSON request failed";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
