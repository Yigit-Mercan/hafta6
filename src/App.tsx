import { useState, useEffect } from 'react';
import './App.css';
import { events } from './data/events';
import type { CampusEvent, Category } from './types/campus-event';

// YENİ: Adım 6'da yazdığımız saf fonksiyonları içeri aktarıyoruz
import { searchEvents, filterByCategory, findEventById } from './utils/filter-events';

type PageName = "home" | "events" | "add" | "update" | "detail";

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // YENİ: Arama metni ve kategori için 2 yeni State (Hafıza) oluşturuyoruz (Slayt Adım 10 / Madde 1)
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
  }

  function handleMenuClick(e: React.MouseEvent<HTMLAnchorElement>, targetPage: PageName) {
    e.preventDefault();
    go(targetPage);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function renderCard(event: CampusEvent) {
    return (
      <article className="card" key={event.id}>
        <h3>{event.title}</h3>
        <p style={{ color: "var(--renk-ana)", fontWeight: "bold" }}>{event.category}</p>
        <p>Tarih: {formatDate(event.date)}, {event.time}</p>
        <p>Yer: {event.location}</p>
        <p>Kontenjan: {event.capacity} kişi</p>
        <p>{event.description}</p>
        <a href="#" className="btn" onClick={(e) => {
          e.preventDefault();
          go("detail", event.id);
        }}>Detayları gör &rarr;</a>
      </article>
    );
  }

  const upcomingEvents = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  // YENİ: Kategorileri veriden otomatik ve tekrarsız (Set) çekiyoruz (Slayt Adım 10 / Madde 3)
  const categories = [...new Set(events.map(e => e.category))];

  // YENİ: Her harf yazıldığında veya kategori seçildiğinde bu liste React tarafından anında baştan hesaplanır! (Slayt Adım 10 / Madde 4)
  const searchedEvents = searchEvents(events, searchText);
  const filteredEvents = filterByCategory(searchedEvents, category);
// Adım 11: Tarayıcı Sekme Başlığını Dinamik Yapma
  // useEffect, içindeki kodu sadece sayfa veya seçili ID (page, selectedId) değiştiğinde çalıştırır.
  useEffect(() => {
    let tabTitle = "Kampüs Etkinlikleri";

    if (page === "events") {
      tabTitle = "Tüm Etkinlikler - Kampüs Etkinlikleri";
    } else if (page === "add") {
      tabTitle = "Etkinlik Ekle - Kampüs Etkinlikleri";
    } else if (page === "update") {
      tabTitle = "Etkinlik Güncelle - Kampüs Etkinlikleri";
    } else if (page === "detail" && selectedId) {
      // Detay sayfasındaysak ve bir ID seçiliyse, o etkinliğin adını bulup sekme adı yapıyoruz
      const event = events.find(e => e.id === selectedId);
      if (event) {
        tabTitle = `${event.title} - Kampüs Etkinlikleri`;
      }
    }

    // Tarayıcının sekme başlığını (document.title) güncelliyoruz
    document.title = tabTitle;

  }, [page, selectedId]); // Bağımlılık dizisi: Bu kod sadece bu iki değişkenden biri değiştiğinde tekrar çalışır.
// Adım 12: Eğer detay sayfasındaysak ve bir id seçiliyse, o etkinliği veritabanından bul (Slayt 27)
  const selectedEvent = (page === "detail" || page === "update") && selectedId 
    ? findEventById(events, selectedId) 
    : undefined;

  return (
    <>
      <header>
        <h1>Kampüs Etkinlikleri</h1>
        <nav>
          <a href="#" onClick={(e) => handleMenuClick(e, "home")} aria-current={page === "home" ? "page" : undefined}>
            Ana Sayfa
          </a>
          <a href="#" onClick={(e) => handleMenuClick(e, "events")} aria-current={page === "events" ? "page" : undefined}>
            Etkinlikler
          </a>
          <a href="#" onClick={(e) => handleMenuClick(e, "add")} aria-current={page === "add" ? "page" : undefined}>
            Ekle
          </a>
        </nav>
      </header>

      <main>
        {page === "home" && (
          <div>
            <p>Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.</p>
            <h2 style={{ marginTop: "1rem" }}>Yaklaşan 2 Etkinlik</h2>
            <section className="etkinlik-grid">
              {upcomingEvents.map(renderCard)}
            </section>
            <p style={{ marginTop: "1rem" }}>
              <a href="#" className="btn" onClick={(e) => handleMenuClick(e, "events")}>Tüm etkinlikleri gör &rarr;</a>
            </p>
          </div>
        )}

        {page === "events" && (
          // YENİ: TÜM ETKİNLİKLER BLOĞU
          <div>
            <h2>Tüm Etkinlikler</h2>

            {/* Arama ve Filtre Formu */}
            <form className="filtre" onSubmit={e => e.preventDefault()}>
              <label htmlFor="arama">Etkinlik ara</label>
              {/* Değeri State'e bağlıyoruz (value) ve her harfte State'i güncelliyoruz (onChange) */}
              <input 
                type="search" 
                id="arama" 
                value={searchText} 
                onChange={e => setSearchText(e.target.value)} 
                placeholder="Örn. atölye, kariyer"
              />
              
              <label htmlFor="kategori-filtre">Kategori</label>
              <select 
                id="kategori-filtre" 
                value={category} 
                onChange={e => setCategory(e.target.value as Category | "")}
              >
                <option value="">Tümü</option>
                {/* Seçenekleri otomatik listeliyoruz */}
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </form>

            {/* Sonuç Cümlesi (Slayt Adım 10 / Madde 5) */}
            <p id="sonuc" style={{ color: filteredEvents.length === 0 ? "darkred" : "inherit", marginBottom: "1rem", fontWeight: "bold" }}>
              {filteredEvents.length === 0 
                ? "Aramanıza uygun etkinlik bulunamadı." 
                : `${filteredEvents.length} etkinlik listeleniyor.`}
            </p>

            {/* Filtrelenmiş Kartları Çizme */}
            <section className="etkinlik-grid">
              {filteredEvents.map(renderCard)}
            </section>
          </div>
        )}

        {/* Adım 13: Ekle ve Güncelle formları için ortak blok (Slayt 28) */}
        {(page === "add" || page === "update") && (
          <div>
            {/* Sayfaya göre başlık değişiyor */}
            <h2 style={{ color: "var(--renk-ana)", marginBottom: "1rem" }}>
              {page === "add" ? "Etkinlik Ekle" : "Etkinlik Güncelle"}
            </h2>
            
            {/* Form submit edildiğinde sayfa yenilenmesini engelliyoruz (e.preventDefault) */}
            <form className="form" onSubmit={(e) => e.preventDefault()} noValidate style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px" }}>
              
              <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.5rem" }}>
                Bu sprintte form sadece görünüm; kayıt yapılmaz.
              </p>

              <div className="form-group">
                <label htmlFor="title" style={{ fontWeight: "bold" }}>Etkinlik Adı *</label>
                <input type="text" id="title" placeholder="Örn. Kariyer Günleri 2026" style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }} />
              </div>

              <div className="form-group">
                <label htmlFor="category" style={{ fontWeight: "bold" }}>Kategori *</label>
                <select id="category" style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}>
                  <option value="">Seçiniz...</option>
                  <option value="Seminer">Seminer</option>
                  <option value="Atölye">Atölye</option>
                  <option value="Söyleşi">Söyleşi</option>
                  <option value="Yarışma">Yarışma</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date" style={{ fontWeight: "bold" }}>Tarih *</label>
                <input type="date" id="date" style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }} />
              </div>

              <div className="form-group">
                <label htmlFor="time" style={{ fontWeight: "bold" }}>Saat *</label>
                <input type="time" id="time" style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }} />
              </div>

              <div className="form-group">
                <label htmlFor="location" style={{ fontWeight: "bold" }}>Yer *</label>
                <input type="text" id="location" placeholder="Örn. A Blok Konferans Salonu" style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }} />
              </div>

              <div className="form-group">
                <label htmlFor="capacity" style={{ fontWeight: "bold" }}>Kontenjan</label>
                <input type="number" id="capacity" style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }} />
              </div>

              <div className="form-group">
                <label htmlFor="description" style={{ fontWeight: "bold" }}>Açıklama</label>
                <textarea id="description" rows={4} style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", width: "100%", fontFamily: "inherit" }}></textarea>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <button type="submit" style={{ backgroundColor: "var(--renk-ana)", color: "white", border: "none", padding: "0.8rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                  {page === "add" ? "Ekle" : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {page === "detail" && (
          <div className="detay-container">
            {/* Eğer id yanlışsa veya etkinlik bulunamadıysa hata göster (Slayt 27 - Madde 2) */}
            {!selectedEvent && (
              <div style={{ border: "2px solid #e74c3c", padding: "1.5rem", borderRadius: "8px", color: "#e74c3c", background: "#fdf0ed", width: "100%" }}>
                <h2 style={{ color: "#e74c3c", marginBottom: "0.5rem" }}>Etkinlik bulunamadı</h2>
                <p>"{selectedId}" numaralı bir etkinlik yok.</p>
                <br />
                <a href="#" className="btn" style={{ background: "#e74c3c", color: "white", padding: "0.5rem 1rem", textDecoration: "none", borderRadius: "4px" }} onClick={(e) => handleMenuClick(e, "events")}>Listeye dön</a>
              </div>
            )}

            {/* Etkinlik bulunduysa detayları çiz (Slayt 27 - Madde 3) */}
            {selectedEvent && (
              <>
                {/* Varsa afişi göster (Slayt 27 - Madde 4) */}
                {selectedEvent.image && (
                  <figure>
                    <img src={selectedEvent.image} alt={`${selectedEvent.title} afişi`} />
                    <figcaption>{selectedEvent.title} afişi</figcaption>
                  </figure>
                )}

                <div className="detay-bilgi" style={{ width: "100%" }}>
                  <h2 style={{ marginBottom: "1rem", color: "var(--renk-ana)" }}>{selectedEvent.title}</h2>
                  
                  {/* Etkinlik Künyesi (Slayt 27 - Madde 5) */}
                  <dl>
                    <dt>Tarih</dt>
                    <dd><time dateTime={`${selectedEvent.date}T${selectedEvent.time}`}>{formatDate(selectedEvent.date)}, {selectedEvent.time}</time></dd>

                    <dt>Yer</dt>
                    <dd>{selectedEvent.location}</dd>

                    <dt>Kategori</dt>
                    <dd>{selectedEvent.category}</dd>

                    <dt>Kontenjan</dt>
                    <dd>{selectedEvent.capacity} kişi</dd>
                  </dl>

                  <h3 style={{ margin: "1rem 0 0.5rem 0" }}>Açıklama</h3>
                  <p>{selectedEvent.description}</p>
                  <br />
                  
                  {/* Butonlar (Slayt 27 - Madde 6) */}
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                    <a href="#" className="btn" style={{ background: "#555", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", textDecoration: "none" }} onClick={(e) => handleMenuClick(e, "events")}>
                      &larr; Listeye dön
                    </a>
                    {/* Güncelle butonuna tıklandığında update sayfasına gönderiyoruz */}
                    <a href="#" className="btn" style={{ background: "var(--renk-ana)", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", textDecoration: "none" }} onClick={(e) => {
                      e.preventDefault();
                      go("update", selectedEvent.id);
                    }}>
                      Bu etkinliği güncelle
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer>
        <p>YİĞİT mercan &middot; 2416501053 &middot; 2026</p>
      </footer>
    </>
  );
}

export default App;