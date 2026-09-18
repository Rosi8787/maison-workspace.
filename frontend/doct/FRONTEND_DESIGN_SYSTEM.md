# FRONTEND DESIGN SYSTEM & UI CONSISTENCY GUIDE

> **Purpose:** Dokumen ini menjadi sumber aturan visual utama untuk seluruh frontend.  
> Semua page, component, section, modal, form, dashboard, dan interaction WAJIB mengikuti design system ini agar visual website tetap konsisten.

---

## 1. DESIGN DIRECTION

### Core Visual Identity

Website menggunakan visual direction:

- Premium
- Modern
- Minimalist
- Warm
- Architectural
- Calm
- Professional
- Editorial
- Subtle glassmorphism

Referensi visual utama adalah foto working space/interior yang diberikan.

**Prinsip utama:**

> Jangan membuat setiap halaman terlihat seperti desain yang berbeda. Semua halaman harus terasa sebagai bagian dari satu produk yang sama.

Gunakan:

`Warm Architecture + Dark Brown + Black + Soft Beige + Subtle Glass`

Hindari:

- Warna-warni berlebihan
- Gradient neon
- Glassmorphism berlebihan
- Card putih standard
- Shadow terlalu kuat
- Border terlalu tebal
- Typography terlalu decorative
- Animasi flashy
- Spacing yang tidak konsisten

---

# 2. COLOR SYSTEM

## 2.1 Primary Palette

Gunakan palette berikut sebagai sumber warna utama.

| Token | Value | Penggunaan |
|---|---|---|
| `--background` | `#120E0C` | Background utama |
| `--background-soft` | `#1A1411` | Background section |
| `--background-elevated` | `#211914` | Elevated surface |
| `--surface` | `#261E19` | Card / panel |
| `--surface-light` | `#302620` | Hover / elevated card |
| `--foreground` | `#F4EEE7` | Primary text |
| `--foreground-muted` | `#C8BDB3` | Secondary text |
| `--foreground-subtle` | `#968A80` | Muted text |
| `--border` | `rgba(255,255,255,0.12)` | Default border |
| `--border-strong` | `rgba(255,255,255,0.20)` | Active / hover border |
| `--accent` | `#C9A77A` | Accent warm |
| `--accent-soft` | `rgba(201,167,122,0.16)` | Accent background |
| `--black` | `#090706` | Footer / deepest background |
| `--white` | `#FFFFFF` | Rare/high contrast usage |

### Color Priority

Gunakan rasio visual kira-kira:

- 60% dark background
- 20% image / architectural visual
- 10% glass surface
- 7% text
- 3% accent

Accent hanya digunakan untuk memperkuat hierarchy, bukan sebagai warna utama seluruh UI.

---

# 3. BACKGROUND SYSTEM

## Landing Page

Hero menggunakan architectural/workspace image.

Gunakan:

```css
background-size: cover;
background-position: center;
```

Tambahkan dark overlay.

Contoh:

```css
background:
  linear-gradient(
    180deg,
    rgba(18, 14, 12, 0.10) 0%,
    rgba(18, 14, 12, 0.28) 45%,
    rgba(18, 14, 12, 0.82) 100%
  );
```

Hero harus perlahan menyatu dengan section berikutnya.

Jangan menggunakan hard color transition.

## Dashboard

Dashboard tidak wajib menggunakan full background image.

Gunakan:

```css
background:
  radial-gradient(
    circle at top right,
    rgba(201, 167, 122, 0.08),
    transparent 35%
  ),
  #120E0C;
```

Background harus terasa warm dan tenang.

---

# 4. GLASSMORPHISM SYSTEM

Glassmorphism adalah salah satu identitas utama website, tetapi harus digunakan secara **subtle**.

## Base Glass

```css
background: rgba(255, 255, 255, 0.07);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.12);
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
```

## Strong Glass

Untuk navbar / booking panel / important floating component:

```css
background: rgba(25, 20, 17, 0.58);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.14);
```

## Glass Hover

```css
background: rgba(255, 255, 255, 0.10);
border-color: rgba(255, 255, 255, 0.20);
```

### Glass Rules

WAJIB:

- Blur antara 12px–24px
- Border tipis
- Opacity rendah
- Shadow lembut
- Text tetap readable

JANGAN:

- Blur > 30px tanpa alasan
- Background terlalu transparan
- Border putih terang
- Glow neon
- Glass pada semua elemen kecil

Glass digunakan terutama untuk:

- Navbar
- Booking panel
- Filter bar
- Important card
- Modal
- Floating action
- Dashboard panel

---

# 5. BORDER SYSTEM

Gunakan border tipis dan subtle.

### Default

```css
border: 1px solid rgba(255,255,255,0.12);
```

### Hover

```css
border-color: rgba(255,255,255,0.20);
```

### Active

```css
border-color: rgba(201,167,122,0.55);
```

### Error

Gunakan warna error standar yang muted, jangan merah neon.

### Rules

- Jangan menggunakan border 2px kecuali ada alasan UX.
- Hindari border pada setiap elemen kecil.
- Gunakan contrast melalui surface + border, bukan shadow berlebihan.

---

# 6. BORDER RADIUS

Gunakan radius berdasarkan hierarchy.

| Component | Radius |
|---|---:|
| Large section/card | `24px` |
| Main card | `20px` |
| Booking panel | `20px` |
| Modal | `24px` |
| Input | `12px` |
| Select | `12px` |
| Button | `9999px` |
| Filter pill | `9999px` |
| Small badge | `9999px` |
| Image | mengikuti parent |

### Rule

Jangan memberikan radius random.

Gunakan token:

```text
sm  = 8px
md  = 12px
lg  = 16px
xl  = 20px
2xl = 24px
pill = 9999px
```

---

# 7. TYPOGRAPHY

## Font Family

Gunakan satu font utama secara konsisten.

Prioritas:

1. Geist
2. Inter
3. Manrope

Jika project sudah menggunakan font tertentu, **jangan mengganti font tanpa alasan**.

Recommended:

```css
font-family:
  var(--font-geist-sans),
  Inter,
  system-ui,
  sans-serif;
```

### Font Philosophy

Typography harus:

- clean
- modern
- readable
- sedikit editorial
- tidak terlalu bold
- memiliki whitespace yang cukup

---

# 8. TYPE SCALE

Gunakan scale berikut.

| Element | Desktop | Mobile | Weight |
|---|---:|---:|---:|
| Hero H1 | `56–72px` | `40–48px` | 600–700 |
| Page H1 | `40–48px` | `32–36px` | 600 |
| H2 | `32–40px` | `28–32px` | 600 |
| H3 | `24–28px` | `22–24px` | 600 |
| H4 | `18–20px` | `18px` | 600 |
| Body Large | `18px` | `16px` | 400 |
| Body | `15–16px` | `14–16px` | 400 |
| Caption | `13–14px` | `12–13px` | 400 |
| Label | `12–13px` | `11–12px` | 500 |
| Button | `14–15px` | `14px` | 500–600 |

---

# 9. TYPOGRAPHY RULES

## Heading

Gunakan:

```css
font-weight: 600;
letter-spacing: -0.02em;
line-height: 1.1;
```

Untuk hero title:

```css
letter-spacing: -0.035em;
line-height: 1.05;
```

## Body

```css
font-weight: 400;
line-height: 1.6;
```

## Label

Gunakan uppercase hanya jika diperlukan:

```text
START TIME
DURATION
WORKSPACE TYPE
```

Style:

```css
font-size: 12px;
font-weight: 500;
letter-spacing: 0.08em;
text-transform: uppercase;
```

Jangan membuat seluruh website uppercase.

---

# 10. CONTENT WIDTH

Gunakan maximum width yang konsisten.

Primary container:

```css
max-width: 1280px;
margin-inline: auto;
padding-inline: 24px;
```

Large desktop:

```text
max-width: 1280px–1400px
```

Mobile:

```text
padding: 20px
```

Tablet:

```text
padding: 32px
```

Desktop:

```text
padding: 40px–48px
```

Jangan membuat beberapa page menggunakan container width yang berbeda tanpa alasan.

---

# 11. SPACING SYSTEM

Gunakan kelipatan 4px.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
96px
120px
```

### Common Usage

| Context | Spacing |
|---|---:|
| Icon → text | 8px |
| Label → input | 8px |
| Input → input | 16px |
| Card internal | 20–24px |
| Card → card | 20–24px |
| Section title → description | 12–16px |
| Description → content | 32px |
| Section → section | 80–120px |
| Hero internal spacing | 24–40px |

Jangan menggunakan angka spacing random seperti 13px, 27px, 37px jika tidak diperlukan.

---

# 12. LAYOUT & DIV PLACEMENT

## General Rule

Gunakan hierarchy:

```text
Page
 └── Section
      └── Container
           └── Content
                ├── Header
                └── Main Content
```

Contoh:

```tsx
<section>
  <div className="container">
    <div className="section-header">
      ...
    </div>

    <div className="content-grid">
      ...
    </div>
  </div>
</section>
```

Jangan membuat nested `<div>` yang tidak memiliki fungsi layout, styling, semantic, atau interaction.

---

# 13. GRID SYSTEM

## Workspace Cards

Desktop:

```text
3 columns
```

Large desktop dapat menggunakan:

```text
3–4 columns
```

Tablet:

```text
2 columns
```

Mobile:

```text
1 column
```

Recommended:

```css
grid-template-columns:
  repeat(auto-fit, minmax(280px, 1fr));
```

Tetapi sesuaikan dengan design agar card tidak terlalu sempit.

---

# 14. NAVBAR

Navbar merupakan floating glass element.

Desktop:

```text
max-width: 1280px
height: 64–72px
radius: pill / 20px
```

Structure:

```text
[ Logo ]      [ Navigation ]       [ Login ] [ Register ]
```

Spacing harus seimbang.

Logo tidak terlalu besar.

Recommended:

```text
Logo: 18–20px
Navigation: 14px
Button: 14px
```

Mobile:

```text
[ Logo ]                       [ Menu ]
```

Navigation menjadi mobile drawer/dropdown.

---

# 15. HERO LAYOUT

Hero harus memiliki visual hierarchy:

```text
              NAVBAR

          small eyebrow

       Find Your Perfect Space

   Discover a workspace designed
   for focus, creativity and growth.

        [ Explore Workspace ]


       ┌───────────────────────┐
       │ DATE │ TIME │ DURATION │
       │          CHECK         │
       └───────────────────────┘
```

Hero title adalah focal point.

Jangan meletakkan terlalu banyak element di hero.

---

# 16. BUTTON SYSTEM

## Primary Button

```text
Background: #F4EEE7
Text: #120E0C
Radius: pill
Height: 44–48px
Padding: 20–24px
```

Hover:

```text
transform: translateY(-1px)
opacity: 0.92
```

## Secondary Button

```text
background: rgba(255,255,255,0.08)
border: 1px solid rgba(255,255,255,0.14)
color: #F4EEE7
```

## Ghost Button

Tidak memiliki background.

Gunakan hanya untuk action sekunder.

### Button Rules

- Minimum height: 40px
- Primary CTA: 44–48px
- Icon gap: 8px
- Jangan menggunakan terlalu banyak style button berbeda.

---

# 17. INPUT & FORM

Input:

```text
height: 44–48px
radius: 12px
background: rgba(255,255,255,0.06)
border: 1px solid rgba(255,255,255,0.12)
```

Focus:

```text
border-color: rgba(201,167,122,0.60)
box-shadow: 0 0 0 3px rgba(201,167,122,0.10)
```

Placeholder:

```text
#968A80
```

Label:

```text
12–13px
font-weight: 500
```

---

# 18. WORKSPACE CARD

Workspace card harus konsisten di seluruh website.

Structure:

```text
┌──────────────────────────┐
│                          │
│        IMAGE             │
│                          │
├──────────────────────────┤
│ Workspace Name           │
│ Description              │
│                          │
│ Rp xxx.xxx / hour        │
│                          │
│              [Book Now]  │
└──────────────────────────┘
```

Image:

```text
aspect-ratio: 4 / 3
object-fit: cover
```

Card:

```text
border-radius: 20px
overflow: hidden
```

---

# 19. CARD HOVER ANIMATION

Gunakan subtle movement.

Default:

```css
transform: translateY(0) rotate(0deg);
```

Hover:

```css
transform: translateY(-8px) rotate(-1deg);
```

Image:

```css
transform: scale(1.04);
```

Transition:

```css
transition:
  transform 350ms cubic-bezier(0.22, 1, 0.36, 1),
  border-color 250ms ease,
  box-shadow 350ms ease;
```

### Important

Animasi harus terasa:

> smooth, expensive, premium

Bukan:

> playful, bouncy, exaggerated

---

# 20. FILTER BAR

Filter bar berbentuk floating glass pill.

Desktop:

```text
[ Every type ] [ Personal desk ] [ Private office ]
[ Duration ] [ Check ]
```

Height:

```text
48–56px
```

Radius:

```text
9999px
```

Mobile:

Gunakan horizontal scrolling:

```css
overflow-x: auto;
scrollbar-width: none;
```

Jangan memaksa filter menjadi terlalu kecil agar semuanya muat.

---

# 21. IMAGE SYSTEM

Gunakan gambar sebagai bagian penting dari visual identity.

Rules:

- Gunakan `object-fit: cover`
- Jangan stretch image
- Gunakan consistent aspect ratio
- Gunakan `next/image` jika menggunakan Next.js
- Lazy load image di bawah fold
- Hero image harus optimized

Image hover:

```text
scale(1.03–1.05)
```

Jangan menggunakan filter yang mengubah warna gambar secara berlebihan.

---

# 22. IMAGE OVERLAY

Jika text berada di atas image:

Gunakan overlay.

Contoh:

```css
background:
  linear-gradient(
    to top,
    rgba(9, 7, 6, 0.75),
    rgba(9, 7, 6, 0.05)
  );
```

Tujuannya meningkatkan readability, bukan membuat gambar menjadi terlalu gelap.

---

# 23. DASHBOARD DESIGN

Dashboard menggunakan visual language yang sama dengan landing page.

### Sidebar

Dark glass / dark surface.

Width:

```text
240–280px
```

### Dashboard content

Container:

```text
max-width: 1280px
```

Dashboard header:

```text
H1: 32–40px
Subtitle: 15–16px
```

Summary cards:

```text
3 columns desktop
2 columns tablet
1 column mobile
```

---

# 24. DASHBOARD SUMMARY CARD

Gunakan hierarchy:

```text
small label

large value

supporting information

optional action
```

Contoh:

```text
UPCOMING BOOKING

Private Office
17 Sep 2026
09:00 – 11:00

[ View Booking ]
```

Jangan membuat semua informasi memiliki ukuran font sama.

---

# 25. STATUS / BADGE

Badge berbentuk pill.

Contoh:

```text
Confirmed
Pending
Completed
Cancelled
Available
```

Gunakan warna muted.

Jangan menggunakan warna neon.

Badge:

```text
font-size: 12px
font-weight: 500
padding: 6px 10px
border-radius: 9999px
```

---

# 26. FOOTER

Footer harus menjadi transition dari website ke dark background.

Background:

```css
linear-gradient(
  180deg,
  #1A1411 0%,
  #0D0A08 45%,
  #090706 100%
);
```

Footer harus terasa:

- dark
- warm
- calm
- elegant

Typography lebih muted daripada hero.

---

# 27. ICON SYSTEM

Gunakan satu icon library.

Recommended:

```text
Lucide React
```

Icon size:

| Usage | Size |
|---|---:|
| Inline | 14–16px |
| Button | 16–18px |
| Navigation | 16–18px |
| Feature | 20–24px |
| Large decorative | 28–32px |

Jangan mencampur style icon dari library yang berbeda.

---

# 28. MOTION SYSTEM

Semua animation harus memiliki tujuan.

### Fast

```text
150–200ms
```

Untuk:

- hover
- button
- icon

### Medium

```text
250–400ms
```

Untuk:

- card
- dropdown
- filter
- navigation

### Slow

```text
500–800ms
```

Untuk:

- page reveal
- hero animation
- section reveal

Recommended easing:

```text
cubic-bezier(0.22, 1, 0.36, 1)
```

---

# 29. SCROLL ANIMATION

Section yang muncul ketika scroll dapat menggunakan:

```text
opacity: 0 → 1
translateY: 20px → 0
```

Duration:

```text
500–700ms
```

Jangan membuat setiap element memiliki animation berbeda.

Gunakan consistent reveal pattern.

---

# 30. ACCESSIBILITY

Semua component harus:

- memiliki semantic HTML
- memiliki accessible label
- memiliki keyboard focus
- memiliki sufficient contrast
- image memiliki `alt`
- button dapat digunakan dengan keyboard
- form memiliki label
- focus state terlihat

Jangan menghilangkan outline/focus indicator tanpa replacement.

---

# 31. RESPONSIVE RULES

## Mobile

Prioritaskan:

1. readability
2. tap target
3. spacing
4. image
5. navigation
6. content hierarchy

Minimum touch target:

```text
44px
```

## Mobile Typography

Hero:

```text
40–48px
```

H1:

```text
32–36px
```

Body:

```text
14–16px
```

Jangan menggunakan desktop font size yang diperkecil secara sembarangan.

---

# 32. BREAKPOINT

Gunakan breakpoint standard Tailwind jika project menggunakan Tailwind:

```text
sm  = 640px
md  = 768px
lg  = 1024px
xl  = 1280px
2xl = 1536px
```

Default strategy:

```text
Mobile First
→ md
→ lg
→ xl
```

Jangan membuat breakpoint custom jika tidak diperlukan.

---

# 33. DESIGN TOKEN RULE

Semua warna, radius, shadow, spacing penting sebaiknya berasal dari token.

Jangan:

```tsx
className="bg-[#191313] ..."
```

berulang-ulang di banyak component jika warna tersebut merupakan bagian dari design system.

Lebih baik gunakan semantic token:

```text
bg-background
bg-surface
text-foreground
text-muted
border-border
```

Tujuannya agar perubahan visual dapat dilakukan secara global.

---

# 34. COMPONENT CONSISTENCY

Component yang memiliki fungsi sama harus menggunakan style yang sama.

Contoh:

Jika `WorkspaceCard` sudah memiliki:

```text
radius: 20px
padding: 20px
image: 4/3
hover: translateY(-8px)
```

Maka jangan membuat WorkspaceCard lain dengan:

```text
radius: 12px
padding: 16px
hover: translateY(-2px)
```

kecuali terdapat kebutuhan UX yang jelas.

---

# 35. PAGE CONSISTENCY

Setiap page harus mengikuti struktur visual:

```text
Page
│
├── Navigation
│
├── Main
│   ├── Page Header
│   ├── Main Content
│   └── Supporting Content
│
└── Footer
```

Dashboard:

```text
Dashboard Shell
│
├── Sidebar / Mobile Nav
│
└── Main
    ├── Header
    ├── Summary
    ├── Main Feature
    └── Supporting Content
```

---

# 36. DO & DON'T

## DO

- Gunakan warm dark palette.
- Gunakan glass secara subtle.
- Gunakan whitespace.
- Gunakan consistent radius.
- Gunakan consistent typography.
- Gunakan architectural imagery.
- Gunakan subtle animation.
- Gunakan reusable components.
- Gunakan design tokens.
- Gunakan mobile-first.
- Pertahankan hierarchy.

## DON'T

- Jangan membuat setiap page dengan warna berbeda.
- Jangan mengganti font per page.
- Jangan menggunakan random border radius.
- Jangan menggunakan shadow berat.
- Jangan menggunakan neon.
- Jangan menggunakan terlalu banyak gradient.
- Jangan menggunakan terlalu banyak blur.
- Jangan membuat semua element floating.
- Jangan membuat animation berlebihan.
- Jangan menggunakan font size random.
- Jangan membuat card style berbeda untuk data yang sama.

---

# 37. AI IMPLEMENTATION RULES

Ketika AI coding agent mengimplementasikan frontend:

### SEBELUM CODING

1. Baca design system ini.
2. Baca frontend requirement.
3. Baca struktur project.
4. Identifikasi component yang sudah tersedia.
5. Reuse component jika memungkinkan.
6. Jangan membuat design token baru jika token yang dibutuhkan sudah tersedia.

### SAAT CODING

1. Gunakan design token.
2. Gunakan reusable component.
3. Gunakan Tailwind utility secara konsisten.
4. Jangan hardcode warna random.
5. Jangan membuat font style baru tanpa alasan.
6. Jangan membuat radius baru tanpa alasan.
7. Jangan membuat animation baru jika pattern yang sama sudah tersedia.

### SETELAH CODING

Periksa:

- [ ] Color palette konsisten
- [ ] Font konsisten
- [ ] Typography scale konsisten
- [ ] Border radius konsisten
- [ ] Glassmorphism konsisten
- [ ] Spacing konsisten
- [ ] Button konsisten
- [ ] Card konsisten
- [ ] Hover animation konsisten
- [ ] Responsive
- [ ] Accessibility
- [ ] Tidak ada horizontal overflow
- [ ] Tidak ada style random

---

# 38. VISUAL QA CHECKLIST

Sebelum menyatakan page selesai, lakukan pengecekan:

## Color

- [ ] Background menggunakan dark warm palette.
- [ ] Tidak ada warna random.
- [ ] Accent hanya digunakan sebagai highlight.
- [ ] Image dan background menyatu.

## Typography

- [ ] Font family sama.
- [ ] H1/H2/H3 mengikuti scale.
- [ ] Body text readable.
- [ ] Line-height konsisten.
- [ ] Letter spacing konsisten.

## Layout

- [ ] Container width konsisten.
- [ ] Section spacing konsisten.
- [ ] Grid responsive.
- [ ] Alignment konsisten.
- [ ] Tidak ada div yang tidak diperlukan.

## Components

- [ ] Button konsisten.
- [ ] Card konsisten.
- [ ] Input konsisten.
- [ ] Badge konsisten.
- [ ] Navbar konsisten.
- [ ] Glass component konsisten.

## Interaction

- [ ] Hover smooth.
- [ ] Focus state tersedia.
- [ ] Transition tidak berlebihan.
- [ ] Mobile interaction nyaman.

---

# 39. FINAL DESIGN PRINCIPLE

Jika terdapat konflik antara kreativitas implementasi dan consistency, prioritaskan consistency.

Urutan prioritas:

```text
1. Usability
2. Accessibility
3. Consistency
4. Visual hierarchy
5. Performance
6. Animation
7. Decorative effects
```

Design harus terasa premium bukan karena banyak efek.

Design terasa premium karena:

```text
Good Typography
+
Good Spacing
+
Consistent Layout
+
High Quality Images
+
Subtle Glass
+
Controlled Color
+
Smooth Interaction
```

---

# 40. SHORT AI RULE

Gunakan aturan berikut sebagai pengingat ketika mengimplementasikan page baru:

> "Create the new page using the existing frontend design system. Reuse existing tokens and components. Keep the same warm dark brown palette, typography scale, glassmorphism treatment, border radius, spacing system, container width, button style, card style, and motion language. Do not introduce new colors, fonts, random radius values, excessive shadows, excessive blur, or unrelated animation unless explicitly required by the feature."

**END OF FRONTEND DESIGN SYSTEM**
