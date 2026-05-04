import { NextRequest, NextResponse } from "next/server";
import { riskHesapla } from "@/lib/riskHesapla";
import { kaydetSaglikVerisi } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      ad,
      yas,
      cinsiyet,
      kilo,
      boy,
      belCevresi,
      kanBasinciSistolik,
      kanBasinciDiyastolik,
      acKanSekeri,
      hba1c,
      aileGecmisi,
      aktivite,
    } = body;

    const sonuc = riskHesapla({
      yas,
      cinsiyet,
      kilo,
      boy,
      belCevresi,
      kanBasinciSistolik,
      kanBasinciDiyastolik,
      acKanSekeri,
      hba1c,
      aileGecmisi,
      aktivite,
    });

    const kanBasinci = `${kanBasinciSistolik}/${kanBasinciDiyastolik}`;

    kaydetSaglikVerisi({
      ad,
      yas,
      cinsiyet,
      kilo,
      boy,
      bmi: sonuc.bmi,
      bel_cevresi: belCevresi,
      kan_basinci: kanBasinci,
      ac_kan_sekeri: acKanSekeri,
      hba1c,
      aile_gecmisi: aileGecmisi,
      aktivite,
      risk_yuzdesi: sonuc.yuzde,
      risk_seviyesi: sonuc.seviye,
    });

    return NextResponse.json({ sonuc });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Hesaplama sırasında bir hata oluştu." }, { status: 500 });
  }
}
