export type FormVerisi = {
  yas: number;
  cinsiyet: string;
  kilo: number;
  boy: number;
  belCevresi: number;
  kanBasinciSistolik: number;
  kanBasinciDiyastolik: number;
  acKanSekeri: number;
  hba1c: number;
  aileGecmisi: string;
  aktivite: string;
};

export type RiskSonucu = {
  yuzde: number;
  seviye: "Düşük" | "Orta" | "Yüksek" | "Çok Yüksek";
  renk: string;
  mesaj: string;
  bmi: number;
};

export function riskHesapla(veri: FormVerisi): RiskSonucu {
  let puan = 0;
  let maxPuan = 0;

  const boy_m = veri.boy / 100;
  const bmi = veri.kilo / (boy_m * boy_m);

  // Yaş skoru
  maxPuan += 4;
  if (veri.yas >= 65) puan += 4;
  else if (veri.yas >= 55) puan += 3;
  else if (veri.yas >= 45) puan += 2;
  else if (veri.yas >= 35) puan += 1;

  // BMI skoru
  maxPuan += 4;
  if (bmi >= 35) puan += 4;
  else if (bmi >= 30) puan += 3;
  else if (bmi >= 25) puan += 2;
  else if (bmi >= 23) puan += 1;

  // Bel çevresi
  maxPuan += 3;
  if (veri.cinsiyet === "erkek") {
    if (veri.belCevresi > 102) puan += 3;
    else if (veri.belCevresi >= 94) puan += 2;
    else if (veri.belCevresi >= 90) puan += 1;
  } else {
    if (veri.belCevresi > 88) puan += 3;
    else if (veri.belCevresi >= 80) puan += 2;
    else if (veri.belCevresi >= 75) puan += 1;
  }

  // Kan basıncı
  maxPuan += 3;
  const sistolik = veri.kanBasinciSistolik;
  if (sistolik >= 140) puan += 3;
  else if (sistolik >= 130) puan += 2;
  else if (sistolik >= 120) puan += 1;

  // Açlık kan şekeri
  maxPuan += 5;
  if (veri.acKanSekeri >= 126) puan += 5;
  else if (veri.acKanSekeri >= 110) puan += 3;
  else if (veri.acKanSekeri >= 100) puan += 2;

  // HbA1c
  maxPuan += 5;
  if (veri.hba1c >= 6.5) puan += 5;
  else if (veri.hba1c >= 5.7) puan += 3;
  else if (veri.hba1c >= 5.4) puan += 1;

  // Aile geçmişi
  maxPuan += 3;
  if (veri.aileGecmisi === "her_ikisi") puan += 3;
  else if (veri.aileGecmisi === "bir_ebeveyn") puan += 2;
  else if (veri.aileGecmisi === "kardes_dede") puan += 1;

  // Fiziksel aktivite
  maxPuan += 3;
  if (veri.aktivite === "hic") puan += 3;
  else if (veri.aktivite === "az") puan += 2;
  else if (veri.aktivite === "orta") puan += 1;

  const yuzde = Math.min(Math.round((puan / maxPuan) * 100), 99);

  let seviye: RiskSonucu["seviye"];
  let renk: string;
  let mesaj: string;

  if (yuzde < 20) {
    seviye = "Düşük";
    renk = "#10b981";
    mesaj = "Risk düzeyiniz oldukça düşük. Sağlıklı yaşam tarzını sürdürmeye devam edin.";
  } else if (yuzde < 40) {
    seviye = "Orta";
    renk = "#f59e0b";
    mesaj = "Orta düzey risk tespit edildi. Beslenme ve aktivite alışkanlıklarınızı gözden geçirin.";
  } else if (yuzde < 65) {
    seviye = "Yüksek";
    renk = "#ef4444";
    mesaj = "Risk düzeyiniz yüksek. Bir endokrinolog veya dahiliye uzmanına başvurmanız önerilir.";
  } else {
    seviye = "Çok Yüksek";
    renk = "#7c3aed";
    mesaj = "Çok yüksek risk. En kısa sürede doktora başvurun ve kapsamlı kan testi yaptırın.";
  }

  return { yuzde, seviye, renk, mesaj, bmi: Math.round(bmi * 10) / 10 };
}
