import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "diyabet.db");

function getDb() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS saglik_kayitlari (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ad TEXT NOT NULL,
      yas INTEGER NOT NULL,
      cinsiyet TEXT NOT NULL,
      kilo REAL NOT NULL,
      boy REAL NOT NULL,
      bmi REAL NOT NULL,
      bel_cevresi REAL NOT NULL,
      kan_basinci TEXT NOT NULL,
      ac_kan_sekeri REAL NOT NULL,
      hba1c REAL NOT NULL,
      aile_gecmisi TEXT NOT NULL,
      aktivite TEXT NOT NULL,
      risk_yuzdesi REAL NOT NULL,
      risk_seviyesi TEXT NOT NULL,
      olusturma DATETIME DEFAULT (datetime('now', 'localtime'))
    )
  `);

  return db;
}

export type SaglikKaydi = {
  id: number;
  ad: string;
  yas: number;
  cinsiyet: string;
  kilo: number;
  boy: number;
  bmi: number;
  bel_cevresi: number;
  kan_basinci: string;
  ac_kan_sekeri: number;
  hba1c: number;
  aile_gecmisi: string;
  aktivite: string;
  risk_yuzdesi: number;
  risk_seviyesi: string;
  olusturma: string;
};

export function kaydetSaglikVerisi(veri: Omit<SaglikKaydi, "id" | "olusturma">) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO saglik_kayitlari
      (ad, yas, cinsiyet, kilo, boy, bmi, bel_cevresi, kan_basinci, ac_kan_sekeri, hba1c, aile_gecmisi, aktivite, risk_yuzdesi, risk_seviyesi)
    VALUES
      (@ad, @yas, @cinsiyet, @kilo, @boy, @bmi, @bel_cevresi, @kan_basinci, @ac_kan_sekeri, @hba1c, @aile_gecmisi, @aktivite, @risk_yuzdesi, @risk_seviyesi)
  `);

  const result = stmt.run(veri);
  return result.lastInsertRowid;
}

export function tumKayitlariGetir(): SaglikKaydi[] {
  const db = getDb();
  return db.prepare("SELECT * FROM saglik_kayitlari ORDER BY olusturma DESC").all() as SaglikKaydi[];
}

export function kayitSil(id: number) {
  const db = getDb();
  return db.prepare("DELETE FROM saglik_kayitlari WHERE id = ?").run(id);
}
