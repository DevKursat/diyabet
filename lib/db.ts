import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyAxh1FGY2FTsyxoiFpkQhbvzP34ZzJqurM",
  authDomain: "diyabetsev.firebaseapp.com",
  projectId: "diyabetsev",
  storageBucket: "diyabetsev.firebasestorage.app",
  messagingSenderId: "444857307909",
  appId: "1:444857307909:web:1c4d60816ee60786c2dd6c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export type SaglikKaydi = {
  id: string;
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

export async function kaydetSaglikVerisi(veri: Omit<SaglikKaydi, "id" | "olusturma">) {
  const kayitlarRef = collection(db, "saglik_kayitlari");
  const docRef = await addDoc(kayitlarRef, {
    ...veri,
    olusturma: new Date().toISOString()
  });
  return docRef.id;
}

export async function tumKayitlariGetir(): Promise<SaglikKaydi[]> {
  const kayitlarRef = collection(db, "saglik_kayitlari");
  const q = query(kayitlarRef, orderBy("olusturma", "desc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SaglikKaydi[];
}

export async function kayitSil(id: string) {
  const docRef = doc(db, "saglik_kayitlari", id);
  await deleteDoc(docRef);
  return id;
}
