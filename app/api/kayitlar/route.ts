import { NextRequest, NextResponse } from "next/server";
import { tumKayitlariGetir, kayitSil } from "@/lib/db";

export async function GET() {
  try {
    const kayitlar = tumKayitlariGetir();
    return NextResponse.json({ kayitlar });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Kayıtlar getirilemedi." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID gerekli." }, { status: 400 });

    kayitSil(Number(id));
    return NextResponse.json({ basarili: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Silme işlemi başarısız." }, { status: 500 });
  }
}
