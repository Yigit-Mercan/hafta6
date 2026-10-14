import type { CampusEvent, Category } from "../types/campus-event";

// 1. Metin ile Arama Fonksiyonu: Başlık veya açıklamada aranan metni bulur.
export function searchEvents(list: CampusEvent[], text: string): CampusEvent[] {
    const q = text.trim().toLocaleLowerCase("tr-TR");
    if (!q) return list; // Arama metni boşsa tüm listeyi döndür

    return list.filter((e) => 
        e.title.toLocaleLowerCase("tr-TR").includes(q) || 
        e.description.toLocaleLowerCase("tr-TR").includes(q)
    );
}

// 2. Kategoriye Göre Filtreleme Fonksiyonu: Seçili kategoriye uyanları bulur.
export function filterByCategory(list: CampusEvent[], category: Category | ""): CampusEvent[] {
    if (category === "") return list; // Kategori seçilmediyse tüm listeyi döndür
    return list.filter((e) => e.category === category);
}

// 3. ID'ye Göre Bulma Fonksiyonu: Belirli bir ID'ye sahip etkinliği bulur. Detay sayfası için gerekli.
export function findEventById(list: CampusEvent[], id: string): CampusEvent | undefined {
    return list.find((e) => e.id === id);
}
