import type { BuyerIntent, SourcePlatform } from "./types";

/**
 * ALL RECORDS IN THIS FILE ARE FICTIONAL EXAMPLES FOR UI DEVELOPMENT.
 * They are not real posts or verified leads. Their URLs use reserved `.example` domains (RFC 2606) shaped
 * like each platform's post URLs, so no demo link points at a real site. The set intentionally covers one brand, several brands, no identifiable brand, a brand without an
 * approved logo asset, posts with and without a budget, an unknown country, and missing date / URL.
 */

type Row = Omit<BuyerIntent, "id" | "post_url"> & { path: string | null };

const HOSTS: Record<SourcePlatform, string> = {
  Reddit: "https://reddit.demo-source.example/r/",
  "Facebook Groups": "https://facebook.demo-source.example/groups/",
  "Local Forums": "https://forum.demo-tech.example/",
  "Technology Communities": "https://community.demo-tech.example/",
  "Classified Communities": "https://kleinanzeigen.demo-market.example/",
};

const ROWS: Row[] = [
  {
    post_title: "Suche gebrauchtes ThinkPad T14 (Büro)",
    buyer_intent:
      "Hallo zusammen, ich suche ein gebrauchtes Lenovo ThinkPad T14 für die tägliche Büroarbeit. Idealerweise 16 GB RAM und eine SSD mit mindestens 512 GB. Mein Budget liegt bei etwa 400 €. Abholung in Hamburg oder Versand ist okay.",
    original_language: "de", country: "Germany", laptop_brands: ["Lenovo"], laptop_models: ["ThinkPad T14"],
    requirements: ["16 GB RAM", "SSD, at least 512 GB"], budget: 400, currency: "EUR",
    source_platform: "Reddit", published_at: "2026-11-16T10:30:00Z", path: "de_EDV/comments/demo0001/suche_gebrauchtes_thinkpad_t14/",
  },
  {
    post_title: null,
    buyer_intent:
      "Suche für mein Studium ein Notebook: ThinkPad X1 Carbon oder Dell XPS 13, gebraucht und nicht älter als 3 Jahre. Maximal 650 Euro.",
    original_language: "de", country: "Germany", laptop_brands: ["Lenovo", "Dell"], laptop_models: ["ThinkPad X1 Carbon", "XPS 13"],
    requirements: ["Used", "Not older than 3 years"], budget: 650, currency: "EUR",
    source_platform: "Facebook Groups", published_at: "2026-11-16T08:12:00Z", path: "notebook-gesucht-de/posts/demo0002/",
  },
  {
    post_title: "MacBook Air M1 gesucht",
    buyer_intent: "Ich suche ein MacBook Air M1 mit 8 GB oder 16 GB RAM, gerne mit Rechnung. Preisvorstellung: bis 600 Euro.",
    original_language: "de", country: "Germany", laptop_brands: ["Apple"], laptop_models: ["MacBook Air M1"],
    requirements: ["8 GB or 16 GB RAM", "Invoice preferred"], budget: 600, currency: "EUR",
    source_platform: "Local Forums", published_at: "2026-11-15T19:45:00Z", path: "t/macbook-air-m1-gesucht/demo0003",
  },
  {
    post_title: "Laptop fürs Informatikstudium: Empfehlungen?",
    buyer_intent:
      "Ich fange nächsten Monat mit einem Informatikstudium an und brauche einen Laptop. Welche Geräte könnt ihr empfehlen? Eine Marke habe ich noch nicht im Kopf.",
    original_language: "de", country: "Germany", laptop_brands: [], laptop_models: [],
    requirements: [], budget: null, currency: null,
    source_platform: "Reddit", published_at: "2026-11-16T05:15:00Z", path: "de_EDV/comments/demo0004/laptop_fuers_informatikstudium/",
  },
  {
    post_title: "Framework Laptop 13 gesucht",
    buyer_intent:
      "Looking for a Framework Laptop 13 (DIY edition) delivered to Germany, around €900. Prefer the Intel Core Ultra variant.",
    original_language: "en", country: "Germany", laptop_brands: ["Framework"], laptop_models: ["Framework Laptop 13"],
    requirements: ["DIY edition", "Intel Core Ultra variant preferred"], budget: 900, currency: "EUR",
    source_platform: "Technology Communities", published_at: "2026-11-14T10:55:00Z", path: "t/framework-laptop-13/demo0005",
  },
  {
    post_title: null,
    buyer_intent: "Suche Samsung Galaxy Book3 Pro, gerne gebraucht. Budget bis 700 EUR.",
    original_language: "de", country: "Germany", laptop_brands: ["Samsung"], laptop_models: ["Galaxy Book3 Pro"],
    requirements: ["Used is fine"], budget: 700, currency: "EUR",
    source_platform: "Classified Communities", published_at: "2026-11-12T17:45:00Z", path: "gesuch/demo0006",
  },
  {
    post_title: "Recherche MacBook Air M1 d’occasion",
    buyer_intent:
      "Bonjour, je cherche un MacBook Air M1 d’occasion pour mes études, de préférence en bon état. Mon budget est de 700 €. Je suis sur Lyon.",
    original_language: "fr", country: "France", laptop_brands: ["Apple"], laptop_models: ["MacBook Air M1"],
    requirements: ["Used, preferably in good condition"], budget: 700, currency: "EUR",
    source_platform: "Reddit", published_at: "2026-11-16T12:05:00Z", path: "france/comments/demo0007/recherche_macbook_air_m1_doccasion/",
  },
  {
    post_title: null,
    buyer_intent: "Quelqu’un aurait-il un HP EliteBook 840 à vendre ? Je cherche pour du télétravail, merci !",
    original_language: "fr", country: "France", laptop_brands: ["HP"], laptop_models: ["EliteBook 840"],
    requirements: ["For remote work"], budget: null, currency: null,
    source_platform: "Facebook Groups", published_at: "2026-11-16T07:40:00Z", path: "bonsplans-informatique/posts/demo0008/",
  },
  {
    post_title: "Cherche PC portable gamer",
    buyer_intent: "Je cherche un PC portable gamer, ASUS ROG ou MSI, avec RTX 4060 minimum. Budget maximum 1 100 €.",
    original_language: "fr", country: "France", laptop_brands: ["ASUS", "MSI"], laptop_models: ["ROG"],
    requirements: ["RTX 4060 minimum"], budget: 1100, currency: "EUR",
    source_platform: "Classified Communities", published_at: "2026-11-14T21:10:00Z", path: "recherche/demo0009",
  },
  {
    post_title: null,
    buyer_intent: "Cherche Fujitsu Lifebook pour ma grand-mère, simple et fiable, budget 200 €.",
    original_language: "fr", country: "France", laptop_brands: ["Fujitsu"], laptop_models: ["Lifebook"],
    requirements: ["Simple and reliable"], budget: 200, currency: "EUR",
    source_platform: "Local Forums", published_at: "2026-11-11T12:30:00Z", path: "t/cherche-fujitsu-lifebook/demo0010",
  },
  {
    post_title: null,
    buyer_intent: "Cerco un Asus Zenbook usato, massimo 500 euro. Preferibilmente con schermo OLED.",
    original_language: "it", country: "Italy", laptop_brands: ["ASUS"], laptop_models: ["Zenbook"],
    requirements: ["Used", "OLED display preferred"], budget: 500, currency: "EUR",
    source_platform: "Facebook Groups", published_at: "2026-11-16T09:20:00Z", path: "usato-pc-italia/posts/demo0011/",
  },
  {
    post_title: "Portatile leggero per la scuola",
    buyer_intent: "Cerco un portatile leggero per la scuola di mia figlia, budget 350 €. Accetto consigli su marche e modelli.",
    original_language: "it", country: "Italy", laptop_brands: [], laptop_models: [],
    requirements: ["Lightweight", "For school"], budget: 350, currency: "EUR",
    source_platform: "Reddit", published_at: "2026-11-15T16:30:00Z", path: "Italia/comments/demo0012/portatile_leggero_per_la_scuola/",
  },
  {
    post_title: "Cerco Dell Latitude 7420",
    buyer_intent: "Cerco un Dell Latitude 7420 o simile, anche con qualche graffio, per lavoro. Non ho un budget preciso.",
    original_language: "it", country: "Italy", laptop_brands: ["Dell"], laptop_models: ["Latitude 7420"],
    requirements: ["Minor scratches acceptable", "For work"], budget: null, currency: null,
    source_platform: "Technology Communities", published_at: "2026-11-13T18:00:00Z", path: "t/cerco-dell-latitude-7420/demo0013",
  },
  {
    post_title: null,
    buyer_intent: "Cerco HP Pavilion usato per mio figlio, budget 400 €.",
    original_language: "it", country: "Italy", laptop_brands: ["HP"], laptop_models: ["Pavilion"],
    requirements: ["Used"], budget: 400, currency: "EUR",
    source_platform: "Facebook Groups", published_at: null, path: null,
  },
  {
    post_title: "Portátil gaming: ¿ASUS TUF o MSI Katana?",
    buyer_intent: "Busco portátil gaming y dudo entre un ASUS TUF y un MSI Katana. Presupuesto de 900 €. ¿Alguna oferta actual?",
    original_language: "es", country: "Spain", laptop_brands: ["ASUS", "MSI"], laptop_models: ["TUF", "Katana"],
    requirements: ["Gaming"], budget: 900, currency: "EUR",
    source_platform: "Reddit", published_at: "2026-11-16T14:22:00Z", path: "spain/comments/demo0015/portatil_gaming_asus_tuf_o_msi_katana/",
  },
  {
    post_title: null,
    buyer_intent: "Necesito un Surface Pro usado para trabajar, con teclado incluido si es posible.",
    original_language: "es", country: "Spain", laptop_brands: ["Microsoft Surface"], laptop_models: ["Surface Pro"],
    requirements: ["Used", "Keyboard included if possible"], budget: null, currency: null,
    source_platform: "Facebook Groups", published_at: "2026-11-15T11:05:00Z", path: "compraventa-tecnologia-es/posts/demo0016/",
  },
  {
    post_title: "Compro Acer Aspire 5",
    buyer_intent: "Compro portátil Acer Aspire 5 en buen estado, hasta 300 euros. Entrega en Valencia.",
    original_language: "es", country: "Spain", laptop_brands: ["Acer"], laptop_models: ["Aspire 5"],
    requirements: ["Good condition"], budget: 300, currency: "EUR",
    source_platform: "Classified Communities", published_at: "2026-11-12T09:15:00Z", path: "busco/demo0017",
  },
  {
    post_title: "Portátil ligero: ¿MacBook Air, XPS 13 o Yoga?",
    buyer_intent: "Busco portátil ligero y dudo entre un MacBook Air, un Dell XPS 13 o un Lenovo Yoga. Máximo 1 000 €.",
    original_language: "es", country: "Spain", laptop_brands: ["Apple", "Dell", "Lenovo"], laptop_models: ["MacBook Air", "XPS 13", "Yoga"],
    requirements: ["Lightweight"], budget: 1000, currency: "EUR",
    source_platform: "Reddit", published_at: "2026-11-15T22:05:00Z", path: "spain/comments/demo0018/portatil_ligero_macbook_air_xps_13_o_yoga/",
  },
  {
    post_title: null,
    buyer_intent: "¿Alguien vende un Toshiba Satellite o un Dynabook? Busco algo barato para ofimática.",
    original_language: "es", country: "Spain", laptop_brands: ["Toshiba", "Dynabook"], laptop_models: ["Satellite"],
    requirements: ["Inexpensive", "For office work"], budget: null, currency: null,
    source_platform: "Local Forums", published_at: "2026-11-13T08:20:00Z", path: "t/toshiba-satellite-dynabook/demo0019",
  },
  {
    post_title: "Etsin käytettyä ThinkPad T480:aa",
    buyer_intent: "Etsin käytettyä Lenovo ThinkPad T480 -kannettavaa, budjetti 250 €. Noutaisin Tampereelta.",
    original_language: "fi", country: "Finland", laptop_brands: ["Lenovo"], laptop_models: ["ThinkPad T480"],
    requirements: ["Used"], budget: 250, currency: "EUR",
    source_platform: "Reddit", published_at: "2026-11-16T06:50:00Z", path: "Suomi/comments/demo0020/etsin_kaytettya_thinkpad_t480aa/",
  },
  {
    post_title: null,
    buyer_intent: "Tarvitsen kannettavan opiskeluun. Acer tai HP kelpaa, max 400 euroa.",
    original_language: "fi", country: "Finland", laptop_brands: ["Acer", "HP"], laptop_models: [],
    requirements: ["For studying"], budget: 400, currency: "EUR",
    source_platform: "Local Forums", published_at: "2026-11-14T13:35:00Z", path: "t/kannettava-opiskeluun/demo0021",
  },
  {
    post_title: null,
    buyer_intent: "Onko kellään myytävänä MacBook Pro 13 tuumaa? Hinta-ajatus 500 €.",
    original_language: "fi", country: "Finland", laptop_brands: ["Apple"], laptop_models: ["MacBook Pro 13"],
    requirements: [], budget: 500, currency: "EUR",
    source_platform: "Facebook Groups", published_at: "2026-11-15T20:00:00Z", path: "tori-tietokoneet/posts/demo0022/",
  },
  {
    post_title: "Brugt MacBook Pro 14 til videoredigering",
    buyer_intent: "Hej, jeg leder efter en brugt MacBook Pro 14 til videoredigering. Mit budget er 9.000 kr.",
    original_language: "da", country: "Denmark", laptop_brands: ["Apple"], laptop_models: ["MacBook Pro 14"],
    requirements: ["Used", "For video editing"], budget: 9000, currency: "DKK",
    source_platform: "Reddit", published_at: "2026-11-16T11:10:00Z", path: "Denmark/comments/demo0023/brugt_macbook_pro_14/",
  },
  {
    post_title: "Søger Dell Latitude 5420",
    buyer_intent: "Søger Dell Latitude 5420 til arbejde, max 3.000 kr.",
    original_language: "da", country: "Denmark", laptop_brands: ["Dell"], laptop_models: ["Latitude 5420"],
    requirements: ["For work"], budget: 3000, currency: "DKK",
    source_platform: "Local Forums", published_at: "2026-11-15T09:40:00Z", path: "t/soeger-dell-latitude-5420/demo0024",
  },
  {
    post_title: null,
    buyer_intent: "Køber bærbar til min søn, Lenovo eller HP, helst under 2.500 kr. Må gerne være brugt.",
    original_language: "da", country: "Denmark", laptop_brands: ["Lenovo", "HP"], laptop_models: [],
    requirements: ["Used is fine"], budget: 2500, currency: "DKK",
    source_platform: "Facebook Groups", published_at: "2026-11-13T15:25:00Z", path: "koeb-og-salg-computere/posts/demo0025/",
  },
  {
    post_title: null,
    buyer_intent: "Looking for a used ThinkPad T14, budget around €350. Anyone selling?",
    original_language: "en", country: null, laptop_brands: ["Lenovo"], laptop_models: ["ThinkPad T14"],
    requirements: ["Used"], budget: 350, currency: "EUR",
    source_platform: "Technology Communities", published_at: "2026-11-14T16:00:00Z", path: "t/used-thinkpad-t14/demo0026",
  },
];

export function buildMockBuyerIntents(): BuyerIntent[] {
  return ROWS.map(({ path, ...row }, index) => ({
    ...row,
    id: `bi-${String(index + 1).padStart(3, "0")}`,
    post_url: path ? `${HOSTS[row.source_platform]}${path}` : null,
  }));
}
