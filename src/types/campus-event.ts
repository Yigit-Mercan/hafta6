// Kural 1: Kategori sadece bu 4 kelimeden biri olabilir. (Başka bir şey yazarsan TS kızar).
export type Category = "Seminer" | "Atölye" | "Söyleşi" | "Yarışma";

// Kural 2: Bir etkinliğin (CampusEvent) sahip olmak ZORUNDA olduğu özellikler şunlardır:
export interface CampusEvent {
    id: string;             // Kimlik numarası (yazı olmak zorunda)
    title: string;          // Etkinlik adı (yazı olmak zorunda)
    category: Category;     // Kategori (yukarıdaki 4 seçenekten biri olmak zorunda)
    capacity: number;       // Kontenjan (SAYI olmak zorunda)
    date: string;           // Tarih (yazı formatında olmak zorunda)
    time: string;           // Saat (yazı formatında olmak zorunda)
    location: string;       // Yer (yazı olmak zorunda)
    description: string;    // Açıklama (yazı olmak zorunda)
    image?: string;         // Afiş resmi (Soru işareti var, yani zorunlu değil, boş bırakılabilir)
}
