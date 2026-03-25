# Prompt fondateur : standards web Rachid Seddar

Tu travailles sur un nouveau site web pour moi. Avant de coder quoi que ce soit, lis ce document en entier. Il contient TOUTES mes exigences en matiere de design, UX, marketing, copywriting, technique, securite et performance.

## IMPORTANT : adaptation au projet

Ce document est un referentiel, pas un cahier des charges rigide. Toutes les sections ne s'appliquent pas systematiquement a chaque projet. Adapte intelligemment :

- **Un site vitrine simple** n'aura peut-etre pas de pricing, pas de dashboard admin, pas d'espace client. Ignore ces sections.
- **Un site e-commerce** n'aura peut-etre pas de formulaire multi-etapes mais aura un panier. Adapte les patterns.
- **Un outil SaaS** n'aura peut-etre pas de FAQ ni de section temoignages sur la landing. Adapte l'ordre des sections.
- **Un blog/media** n'aura peut-etre pas de CTA "S'inscrire" mais un CTA "Lire l'article". Adapte le copywriting.

Ce qui est TOUJOURS obligatoire quel que soit le projet :
- La stack technique (Astro + React islands + Tailwind + Supabase + Netlify)
- Les headers de securite
- L'optimisation des fonts (woff2, swap, self-hosted)
- Le SEO technique (sitemap, robots.txt, meta tags, Schema.org adapte)
- Les regles de copywriting (pas de tiret cadratin, vouvoiement, phrases courtes, zero jargon)
- La centralisation des donnees dans config.ts
- Plausible Analytics
- La page mentions legales

Ce qui est conditionnel (applique uniquement si le projet le necessite) :
- Pricing comparatif ou cartes tarifaires
- Formulaire multi-etapes avec Turnstile/honeypot
- Dashboard admin avec MFA
- Espace client avec stepper et upload
- Formulaires SAV
- Emails transactionnels (Resend)
- Pages SEO programmatiques

En cas de doute, applique le standard. Si une section de ce prompt ne correspond pas au projet, ignore-la silencieusement sans me demander confirmation.

---

## 1. STACK TECHNIQUE

- **Astro** (SSG, `output: 'static'`) + **React** (islands architecture uniquement pour les composants interactifs)
- **Tailwind CSS 3** + PostCSS + autoprefixer + plugin `@tailwindcss/typography` pour le contenu prose
- **Supabase** : DB PostgreSQL, Auth (magic link ou email/password), Edge Functions (Deno), Storage
- **Deploiement** : Netlify (static CDN)
- **Node.js v22+** (via nvm)
- **Emails transactionnels** : Resend API (si le projet envoie des emails)
- **Analytics** : Plausible (privacy-focused, RGPD-compliant, pas de bandeau cookies)
- **CAPTCHA** : Cloudflare Turnstile (si le projet a un formulaire public)

React ne s'hydrate QUE sur les composants qui en ont besoin (`client:load` ou `client:only="react"`). Zero full-page hydration. Les pages statiques n'envoient aucun JS au client.

### Architecture fichiers
```
src/
├── layouts/
│   └── Base.astro              # Layout racine (SEO, fonts, Schema.org, security)
├── components/
│   └── [Composants React].tsx  # Islands interactifs uniquement
├── pages/
│   ├── index.astro             # Landing page
│   ├── mentions-legales.astro  # Mentions legales / RGPD
│   └── [autres pages].astro
├── data/
│   └── config.ts               # Donnees centralisees (config site, FAQ, prix, etc.)
├── lib/
│   └── supabase.ts             # Client Supabase (si backend necessaire)
└── styles/
    └── global.css              # Tailwind imports
public/
├── fonts/                      # woff2 variable fonts
├── _headers                    # Security headers Netlify
├── robots.txt
├── favicon.svg
└── og-image.png
supabase/                       # (si backend necessaire)
└── functions/                  # Edge Functions
```

### Build config (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

### Variables d'environnement
- `PUBLIC_*` : exposees au client (Supabase URL, anon key, Turnstile site key)
- Tout le reste : server-side uniquement (service role key, Resend API key, etc.)
- Fichier `.env.example` a la racine pour documenter les variables requises

---

## 2. SECURITE

### Headers (fichier public/_headers)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Anti-spam formulaires (si formulaire public)
- **Honeypot** : champ cache (display:none). Si rempli, on ignore silencieusement (bot).
- **Cloudflare Turnstile** : charge dynamiquement uniquement a l'etape finale. Config : theme light, size flexible, retry auto interval 3s. Token REQUIS avant soumission.
- Site key dans `PUBLIC_TURNSTILE_SITE_KEY`.

### Pages privees (si espace prive)
- `<meta name="robots" content="noindex, nofollow" />` sur admin et espaces prives
- Auth Supabase avec `persistSession: true` et `autoRefreshToken: true`
- MFA TOTP si dashboard admin

### Edge Functions Supabase (si backend)
- Verifier le Bearer token via `supabase.auth.getUser()` sur toute fonction sensible
- Validation UUID avec regex
- Ne JAMAIS exposer de donnees sensibles cote client
- CORS restreint au domaine de prod, pas de wildcard `*`

### Donnees
- localStorage uniquement pour l'etat du formulaire (jamais de donnees sensibles)
- Wrap tous les acces localStorage dans try-catch
- Nettoyer le localStorage apres soumission reussie

---

## 3. PERFORMANCE

### Fonts
- Toutes en **woff2** (format compresse moderne)
- **Variable fonts** quand disponible (un seul fichier pour tous les poids)
- **`font-display: swap`** obligatoire sur chaque @font-face
- Servies depuis `/public/fonts/` (statique, jamais Google Fonts externe)

### Images
- Formats modernes (WebP/AVIF) quand possible
- `loading="lazy"` sur les images below the fold
- OG image statique en PNG dans `/public/`

### JS
- React en island = zero JS pour les pages statiques
- Turnstile charge dynamiquement au dernier step (si applicable)
- Analytics (Plausible) en `async`
- PAS de jQuery, PAS de bibliotheques d'animation. Animations CSS pures uniquement (transition-all, hover:translate, keyframes)

### CSS
- Tailwind purge automatique en prod
- Sections alternees bg-white / bg-surface pour rythmer la lecture

---

## 4. SEO TECHNIQUE

### Sitemap
Plugin `@astrojs/sitemap` avec filtre pour exclure les pages privees :
```js
sitemap({
  filter: (page) => !page.includes('/admin') && !page.includes('/espace'),
})
```

### robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /espace/
Sitemap: https://[DOMAINE]/sitemap-index.xml
```

### Schema.org
- Schema principal dans Base.astro (type adapte au projet : InsuranceAgency, EducationalOrganization, LocalBusiness, Organization, etc.)
- **FAQPage** sur la landing si FAQ presente, genere dynamiquement depuis FAQ_ITEMS
- **BreadcrumbList** sur les pages internes
- Schema specifique au contenu sur les pages dediees (Service, Course, Product, Offer, etc.)

### Meta tags (chaque page)
- title + description + canonical uniques
- OG complets : og:title, og:description, og:url, og:type, og:locale fr_FR, og:image, og:site_name
- Twitter card summary_large_image
- theme-color

---

## 5. DESIGN & UX

### Principes generaux
- Epure, aere, moderne. Jamais surcharge.
- Palette restreinte : 1 couleur accent forte, fond blanc pur, fond surface (gris tres clair), texte quasi-noir
- Typographie : 3 fonts max. 1 display (titres, black/extrabold), 1 body (texte courant), 1 serif italic (accent emotionnel)
- Ton : vouvoiement simple, direct, zero jargon. Phrases courtes.

### Systeme de couleurs (adapter les teintes au projet, garder la structure)
```
brand:       [couleur accent forte]        # CTA, liens, highlights
brand-light: [variante claire]             # Hover states
brand-pale:  [variante tres claire]        # Fonds de badges, sections highlight
brand-dark:  [variante foncee]             # Texte sur fond pale
accent:      [couleur secondaire]          # Elements d'accentuation optionnels
accent-pale: [fond secondaire]             # Badge accent
ink:         #1A1A2E                        # Texte principal, fond footer (dark navy)
ink-light:   #2D2D44                        # Texte secondaire fonce
ink-soft:    #475569                        # Texte doux
muted:       #64748B                        # Texte gris, descriptions
surface:     #F8FAFB                        # Fond sections alternees (gris ultra-clair)
border:      #E2E8F0                        # Bordures legeres
```

### Ombres (custom dans tailwind.config)
```
shadow-soft: 0 8px 30px rgba(0,0,0,0.04)   # Ombre subtile sur CTA, cards au repos
shadow-lift: 0 12px 40px rgba(0,0,0,0.06)  # Ombre prononcee au hover
```

### Typographie
- **H1** : `font-display text-[clamp(38px,5.5vw,64px)] font-black leading-[0.95] tracking-[-2.5px] text-ink`
- **H2** : `font-display text-[clamp(30px,4.5vw,48px)] font-black tracking-[-2px] leading-[0.95] text-ink`
- **H3 (cards)** : `font-display text-base font-extrabold tracking-[-0.3px] text-ink`
- **Accent emotionnel** : `font-serif italic font-normal text-brand` (ex: "simplement.", "couvert")
- **Labels de section** : `text-xs font-extrabold uppercase tracking-[3px] text-brand mb-4`
- **Badges** : `text-[10px] font-extrabold uppercase tracking-[0.6px] px-3 py-1.5 rounded-full`
- **Body** : `text-base text-muted leading-relaxed` ou `text-sm text-muted`
- Toujours utiliser `clamp()` pour les titres (responsive fluide sans media queries)

### Espacement
- **Sections** : `py-24 lg:py-32` (genereux, aere)
- **Container** : `max-w-6xl mx-auto px-6 sm:px-10 lg:px-16`
- **Entre sections titre et contenu** : `mb-12` a `mb-14`
- **Cards** : `p-6` a `p-9` selon la taille
- **Grids** : `gap-4` a `gap-5`

### Border radius
- Cards : `rounded-2xl` (16px)
- Grosses cartes (pricing, garantie principale) : `rounded-3xl` (24px)
- Boutons, badges, pills : `rounded-full` (9999px)
- Elements interactifs petits : `rounded-xl` (12px)

### Hierarchie visuelle
- UN SEUL hero massif avec H1 typographiquement fort. Pas de surcharge.
- Sous le hero : 4 stats percutantes (chiffres gros en font-display font-black, labels en uppercase text-xs tracking-[1.5px] font-bold)
- Trust bar simple (badges one-liner `text-sm font-bold text-ink/60`) UNE SEULE FOIS, pas repetee
- Sections alternees `bg-white` / `bg-surface` pour rythmer la lecture

### Micro-interactions
- **Cards** : `hover:-translate-y-1 hover:shadow-soft hover:border-brand/30 transition-all`
- **CTA principal** : `rounded-full px-10 py-5 font-bold text-lg shadow-soft hover:-translate-y-1 hover:shadow-lift transition-all`
- **CTA navbar** : `rounded-full px-6 py-2.5 font-bold text-sm tracking-wide hover:-translate-y-1 hover:shadow-lift transition-all`
- **Liens** : `hover:text-brand transition-colors`
- **FAQ** : `<details>` natif HTML avec `group`, chevron SVG en `group-open:rotate-180 transition-transform` (zero JS)
- **CTA mobile sticky** : `fixed bottom-0 z-40 p-4 bg-gradient-to-t from-white via-white to-white/0 pointer-events-none` avec le bouton en `pointer-events-auto`
- **Stagger animation** : les cards ont un `animation-delay` incremental (100ms, 200ms, 300ms...)

### Navbar
- `sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50`
- Logo a gauche : `font-display text-2xl font-black` avec point en `text-brand`
- Liens : `text-sm text-muted hover:text-brand transition-colors`
- CTA a droite : `bg-brand text-white rounded-full`
- Menu hamburger mobile avec panneau `hidden sm:hidden` toggle

### Hero
- Badge au-dessus du H1 : `bg-brand-pale text-brand-dark rounded-full text-xs font-extrabold uppercase tracking-[1.5px]` avec pastille `animate-pulse`
- H1 avec mot accent en `font-serif italic text-brand`
- Sous-titre : `text-lg text-muted max-w-xl mx-auto`
- CTA large centre
- Social proof : stack d'avatars (cercles colores avec initiales, `-ml-2.5` overlap) + note Google
- 4 stats en ligne : `font-display text-3xl font-black text-brand` + `text-xs text-muted uppercase tracking-[1.5px] font-bold`

### Cards standard
```
bg-white border border-border rounded-2xl p-6
hover:-translate-y-1 hover:shadow-soft hover:border-brand/30 transition-all
```

### Pricing (si applicable)
- 2 colonnes : "Ailleurs" (grise, prix barre, ✗ rouges) vs "Nous" (border-brand, shadow-soft, ✓ verts)
- Badge flottant : `absolute -top-3 left-1/2 -translate-x-1/2 rounded-full text-[11px] font-extrabold uppercase`
- Prix : `font-display text-5xl font-black tracking-[-2px]`
- Mobile : la carte mise en avant apparait en premier (`order-1 md:order-2`)

### Temoignages
- Carousel horizontal sur mobile (`overflow-x-auto -mx-6 px-6`), grille sur desktop (`sm:grid sm:grid-cols-3`)
- Etoiles : `text-amber-400 text-sm tracking-[2px]` avec "★★★★★"
- Badge "⭐ X/5 sur Google" a cote du titre de section

### Etapes "Comment ca marche"
- Numeros geants semi-transparents : `text-5xl font-black text-brand/20 tracking-[-3px]`
- Icone emoji + titre `font-display font-extrabold` + description `text-sm text-muted`
- Grille : `sm:grid-cols-2 lg:grid-cols-4 gap-4`

### Marquee (optionnel)
- `overflow-hidden bg-surface py-3`
- Contenu double (pour boucle infinie) : `animate-[scroll_20s_linear_infinite] w-max`
- Items : `text-xs font-bold text-ink/30 uppercase tracking-[2px]` avec pastille `bg-brand`

### Footer
- `bg-ink` (dark navy) avec `pt-14 pb-8`
- Logo : `font-display text-2xl font-black text-white` avec point `text-brand`
- Description : `text-sm text-white/40`
- Colonnes (grille 5 colonnes desktop) avec titres `text-[10px] uppercase tracking-[1.5px] text-white/40 font-bold`
- Liens : `text-sm text-white/40 hover:text-brand transition-colors`
- Contact : `text-white/60`
- Copyright : `text-xs text-white/40` avec separateurs `·`
- Divider : `border-b border-white/10`

### Garanties / Features (si applicable)
- Carte principale grande : `bg-brand-pale rounded-3xl p-8 lg:p-10 border-2 border-[rose clair]` avec glow animation subtile
- Grille 3 cartes secondaires : `bg-white border border-border rounded-2xl p-7` avec badges "Inclus" en `bg-accent-pale text-accent`
- Carte option (dashed) : `border-2 border-dashed border-border` avec badge "Option" en couleur ambre

### Grilles responsive
- 5 colonnes : `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4` (metiers, footer)
- 4 colonnes : `sm:grid-cols-2 lg:grid-cols-4 gap-4` (etapes)
- 3 colonnes : `grid-cols-1 sm:grid-cols-3 gap-4` (garanties, avis)
- 2 colonnes : `md:grid-cols-2 gap-5` (pricing)

### Opacite et transparence
- Texte degrade : `text-ink/70`, `text-ink/60`, `text-ink/30` pour creer de la profondeur
- Bordures subtiles : `border-border/50`, `border-brand/30`
- Fonds semi-transparents : `bg-white/80` (navbar), `bg-white/95` (menu mobile)

### Ce qui fait la difference
- Les titres sont TRES gros, tres serres (tracking negatif, leading 0.95). Ca donne du caractere.
- Le contraste entre le font-black des titres et le font-normal du serif italic cree un rythme visuel fort.
- Les sections sont tres aerees (py-24 a py-32). Jamais d'entassement.
- Les hover sont doux : -translate-y-1 (4px seulement) + ombre progressive. Pas de bounce, pas d'overshoot.
- La couleur accent n'apparait que sur les elements interactifs (CTA, liens, badges). Le reste est en nuances de gris/navy.

---

## 6. ORDRE DES SECTIONS (funnel marketing)

Cet ordre est optimise pour la conversion. Adapte-le au projet : retire les sections qui ne s'appliquent pas, mais conserve la logique du funnel (attention > identification > valeur > confiance > decision > action).

1. **Marquee** (optionnel) : bande scrollante avec les metiers/services
2. **Navbar** : sticky, blur backdrop, logo + liens + CTA principal
3. **Hero** : H1 + sous-titre + CTA + stats + social proof
4. **Trust bar** : badges de confiance (une seule fois)
5. **Pour qui / Metiers** : identification du visiteur
6. **Offre / Programme / Garanties** : ce qu'on propose (valeur)
7. **Pourquoi nous** : differenciateurs (confiance)
8. **Tarifs** : pricing (decision) si applicable
9. **Comment ca marche** : etapes simples (rassurance process)
10. **Outils gratuits** (si applicable)
11. **Temoignages** : preuve sociale
12. **FAQ** : objections levees (juste avant le CTA final)
13. **CTA final** : urgence/action
14. **Footer**

---

## 7. COPYWRITING

### Regles absolues
- **Jamais de tiret cadratin** (le caractere special long). Utiliser des virgules, points, deux-points ou points medians a la place.
- Vouvoiement simple, direct
- Phrases courtes. Privilegier le rythme ternaire. "150h. Une attestation. Vous etes courtier."
- Le CTA ne dit jamais "En savoir plus". Il dit exactement ce qui se passe : "S'inscrire, 590 euros" ou "Obtenir mon devis"
- Zero jargon pompeux. Ecrire comme on parle a un pro entre deux taches.
- Pas d'emojis dans les paragraphes de texte. Emojis uniquement dans les cards, badges, et icones de section.

### Titres
- Font display, black/extrabold, tracking tight, leading tight
- Le mot-cle emotionnel en serif italic + couleur accent
- Exemple : "Votre decennale artisan, *simplement.*"

### Sous-titres de section
- Uppercase, text-xs, font-extrabold, tracking-[3px], couleur accent, margin-bottom genereux
- Exemple : "GARANTIES", "TARIFS", "FAQ"

### Separateurs dans les footers et lignes d'info
- Utiliser le point median (·) pour separer les elements, jamais le tiret cadratin
- Exemple : "SIREN 815 205 067 · RCS Bobigny · ORIAS n16 000 722"

---

## 8. DONNEES CENTRALISEES

Toute donnee reutilisee est centralisee dans `src/data/config.ts`. Pas de donnees en dur dans les templates. Structure type :
```typescript
export const SITE = {
  name: 'monsite.',
  phone: '01 XX XX XX XX',
  email: 'contact@monsite.fr',
  url: 'https://monsite.fr',
  // ... toutes les infos legales, prix, etc.
};

export const FAQ_ITEMS = [
  { q: "Question ?", a: "Reponse." },
];
```

---

## 9. EMAILS TRANSACTIONNELS (si applicable)

### Style
- Font : system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- Header : bande coloree (couleur accent) avec titre blanc
- Body : fond #f8fafb, border #e2e8f0, coins arrondis 16px
- CTA : bouton pill (border-radius 999px), couleur accent, blanc, bold
- Footer : texte gris clair, infos legales
- Pas de tiret cadratin dans les emails

### Notifications
- Email admin a chaque evenement important
- Email client aux etapes cles du parcours
- Tous les envois logges dans la table d'events

---

## 10. ADMIN DASHBOARD (si applicable)

- Supabase Auth + MFA TOTP obligatoire
- Page `/admin` en noindex nofollow, `client:only="react"`
- Pipeline visuel avec statuts colores
- Vue detail avec infos, documents, timeline, notes, actions email
- Upload/download via Supabase Storage (signed URLs)
- Undo 5s sur les actions destructives
- Logging automatique de tous les evenements

---

## 11. ESPACE CLIENT (si applicable)

- Acces via lien unique `/espace?id=[uuid]`
- Edge Function intermediaire pour ne retourner que les champs non-sensibles
- Stepper visuel + accordion par etape
- Upload drag-and-drop
- Section SAV visible uniquement quand le client est couvert

---

## 12. MENTIONS LEGALES / RGPD

Chaque site doit avoir `/mentions-legales` avec :
- Editeur (raison sociale, SIREN, RCS, capital, adresse, dirigeant)
- Hebergeur (Netlify)
- Numeros reglementaires le cas echeant
- Politique de confidentialite (donnees, finalites, duree, droits RGPD)
- Cookies (Plausible = pas de cookies, mention simplifiee)

---

## 13. BLOG / CONTENU MDX (si applicable)

### Structure des articles
- Format MDX (Markdown + composants React) via `@astrojs/mdx`
- Fichiers dans `src/content/blog/[slug].mdx`
- Template de rendu dans `src/pages/blog/[slug].astro`
- Index blog dans `src/pages/blog/index.astro`

### Frontmatter standard
```yaml
---
title: "Titre de l'article"
description: "Meta description SEO (max 155 caracteres)"
date: "2026-03-21"
image: "/blog/images/nom-image.webp"
---
```

### Schema.org sur les articles
```json
{
  "@type": "NewsArticle",
  "headline": "titre",
  "description": "description",
  "author": { "@type": "Organization", "name": "[NOM_SITE]" },
  "publisher": { "@type": "Organization", "name": "[NOM_SITE]" },
  "datePublished": "date",
  "image": "image"
}
```

### Temps de lecture
Calcule automatiquement : nombre de mots / 200 mots par minute, arrondi.

### CTA dans les articles
Utiliser des blockquotes avec emoji + texte gras + lien :
```markdown
> 💰 **Texte d'accroche court** : [Texte du CTA](/lien)
```
Pas de tiret cadratin avant le lien. Utiliser deux-points.

### Publication programmee
Filtrer les articles par date : ne pas afficher les articles dont la date est dans le futur. Cela permet de preparer des articles a l'avance.

### Style prose
Utiliser le plugin `@tailwindcss/typography` avec la classe `prose` pour le contenu des articles. Personnaliser les styles prose dans le tailwind.config si besoin.

---

## 14. PAGES SEO PROGRAMMATIQUES (si applicable)

### Principe
Un template `src/pages/[categorie]/[slug].astro` genere automatiquement des pages a partir de combinaisons de donnees (ex: metier x ville, produit x region).

### Implementation
```typescript
// Dans getStaticPaths()
export function getStaticPaths() {
  const pages = [];
  for (const item of ITEMS) {
    for (const city of SEO_CITIES) {
      pages.push({
        params: { slug: `${item.slug}-${city.slug}` },
        props: { item, city },
      });
    }
  }
  return pages;
}
```

### Donnees dans config.ts
```typescript
export const SEO_CITIES = [
  { slug: 'paris', name: 'Paris', dep: '75', region: 'Ile-de-France' },
  { slug: 'lyon', name: 'Lyon', dep: '69', region: 'Auvergne-Rhone-Alpes' },
  // ...
];
```

### Contenu unique
Chaque page generee doit avoir un contenu suffisamment unique (pas juste le nom de la ville change). Inclure : contexte local, statistiques, specificites regionales.

### Schema.org
Ajouter un schema `Service` ou `Product` avec `areaServed` pointant sur la ville.

### Scale
Commencer petit (5-10 villes), valider l'indexation, puis scaler progressivement.

---

## 15. FORMULAIRE MULTI-ETAPES (si applicable)

### UX
- Une question par ecran. Pas de formulaire long sur une seule page.
- Progression visuelle (stepper ou barre de progression)
- Boutons "Continuer" et "Retour" clairs
- Validation a chaque etape avant de passer a la suivante
- Le bouton "Continuer" est desactive tant que l'etape n'est pas valide

### Persistance
- Sauvegarder la progression dans localStorage (cle : `[projet]_form`)
- Structure : `{ step: number, data: {...} }`
- Restaurer automatiquement au rechargement de la page
- Nettoyer le localStorage apres soumission reussie
- Wrap dans try-catch (localStorage peut etre indisponible)

### Pre-remplissage
- Supporter les query params dans l'URL pour pre-remplir des champs
- Valider les valeurs recues contre les valeurs autorisees avant de les injecter

### Anti-spam
- Honeypot (champ cache) des le debut
- Turnstile charge uniquement a la derniere etape (pas avant)
- Token Turnstile requis pour soumettre

### Soumission
- Desactiver le bouton pendant l'envoi (prevenir le double-clic)
- Afficher un spinner pendant l'envoi
- Message de succes clair apres soumission
- En cas d'erreur : message explicite, ne pas perdre les donnees saisies

---

## 16. ETATS D'INTERFACE

### Loading
- Spinner simple : cercle avec `border-3` dont `borderTopColor` en couleur accent, `animation: spin 0.8s linear infinite`
- Texte d'accompagnement sous le spinner ("Chargement...", "Envoi en cours...")
- Centrer verticalement et horizontalement dans le conteneur

### Erreur
- Message explicite, pas de code technique
- Fond rouge clair (`bg-red-50`), texte rouge fonce, bordure rouge
- Icone ou emoji en tete
- Proposer une action (reessayer, contacter le support)

### Vide (empty state)
- Emoji ou icone grande taille (48px) centree
- Titre court + description
- CTA si pertinent

### Succes
- Toast vert : `bg-green-50 border-green-200 text-green-800`
- Auto-dismiss apres 4 secondes
- Checkmark anime (cercle vert + coche blanche)

### Undo (actions destructives dans l'admin)
- Toast avec compte a rebours 5 secondes
- Bouton "Annuler" dans le toast
- L'action ne s'execute reellement qu'apres les 5 secondes
- Si annule : restaurer l'etat precedent sans recharger

---

## 17. PAGE 404

Chaque site doit avoir une page `/404.astro` personnalisee avec :
- Le layout de base (Base.astro)
- Titre : "Page introuvable | [nom du site]"
- Emoji ou icone (ex: 🔍)
- Titre `font-display font-black`
- Message court et sympathique
- Bouton CTA pour retourner a l'accueil
- Pas de navbar/footer complexe, juste le minimum

---

## 18. FAVICON & OG IMAGE

### Favicon
- Format SVG (`/public/favicon.svg`) pour la nettete a toutes les tailles
- Le favicon reprend le logo ou le point accent du logo
- Apple touch icon en PNG (`/public/apple-touch-icon.png`)

### OG Image
- Image statique en PNG dans `/public/og-image.png`
- Dimensions : 1200x630px
- Contient : le logo du site avec les fonts du projet (display + serif accent)
- Fond clair ou fonce selon le branding
- Referencee dans Base.astro : `<meta property="og:image" content="${SITE.url}/og-image.png" />`

---

## 19. MOBILE-FIRST

### Philosophie
Les utilisateurs cibles (artisans, independants, pros) consultent principalement depuis leur telephone entre deux taches. Le site doit etre concu mobile-first.

### Regles
- Tester chaque composant sur 375px de large avant desktop
- Le CTA principal doit etre visible sans scroller sur mobile
- CTA sticky en bas sur mobile (`fixed bottom-0`) avec gradient fade
- Les grilles passent en 1-2 colonnes sur mobile, 3-5 sur desktop
- Les carousels de temoignages sont en scroll horizontal sur mobile, grille sur desktop
- Le menu est un hamburger sur mobile avec panneau plein ecran
- Les tableaux de prix s'empilent verticalement sur mobile
- Les formulaires occupent toute la largeur sur mobile
- Padding horizontal : `px-6` sur mobile, `sm:px-10`, `lg:px-16` sur desktop
- Ne jamais avoir de scroll horizontal involontaire (`overflow-x-hidden` sur body)

### Breakpoints (Tailwind par defaut)
- `sm:` (640px) : tablette portrait, layout shifts principaux
- `md:` (768px) : tablette paysage, reorganisation des colonnes
- `lg:` (1024px) : desktop, expansion complete des grilles

---

## 20. APIS EXTERNES (si applicable)

### Patterns d'appel
- Toujours definir un **timeout** (5 secondes max) pour ne pas bloquer l'interface
- Gerer l'erreur gracieusement : si l'API ne repond pas, l'utilisateur peut continuer manuellement
- Afficher un indicateur de chargement pendant l'appel

### Exemple : lookup SIREN
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);
try {
  const res = await fetch(`https://api.url/${siren}`, { signal: controller.signal });
  // traiter la reponse
} catch {
  // fallback : laisser l'utilisateur saisir manuellement
} finally {
  clearTimeout(timeout);
}
```

### APIs utiles en France
- **Entreprises** : `https://recherche-entreprises.api.gouv.fr` (lookup SIREN/SIRET)
- **Geographie** : `https://geo.api.gouv.fr/communes` (code postal vers ville)
- **Adresses** : `https://api-adresse.data.gouv.fr` (autocompletion adresse)

### Formatage
- Telephone : afficher avec espaces (01 85 10 56 67), stocker sans espaces
- SIREN : afficher avec espaces (815 205 067), stocker sans espaces
- CA / montants : separateur de milliers avec espace (150 000 euros)
- Code postal : toujours 5 chiffres

---

## 21. GIT & WORKFLOW

### Commits
- Messages en anglais, courts, descriptifs
- Format : `Type: description courte`
- Types : `Fix:`, `Feature:`, `Design:`, `UX:`, `Security:`, `SEO:`, `Perf:`, `Docs:`, `Refactor:`
- Exemples : `Fix: SIREN lookup timeout`, `Design: pricing section mobile layout`, `Security: add Turnstile to form`

### Regles
- Ne jamais force push sur main
- Ne jamais skip les hooks (pas de `--no-verify`)
- Preferer un nouveau commit plutot qu'un amend
- Ne pas commiter les fichiers `.env`, `node_modules/`, `dist/`
- Le `.gitignore` doit etre en place des le debut

### Branches
- `main` : production, toujours deployable
- Feature branches si travail en parallele

---

## 22. SUPABASE DATABASE PATTERNS (si backend)

### Conventions de nommage
- Tables : `snake_case`, pluriel (`leads`, `sav_requests`, `lead_notes`)
- Colonnes : `snake_case` (`company_name`, `created_at`, `postal_code`)
- Cles primaires : toujours `id uuid primary key default gen_random_uuid()`
- Timestamps : `created_at timestamptz not null default now()`
- Cles etrangeres : `[table_singulier]_id` (ex: `lead_id uuid not null references leads(id) on delete cascade`)

### Table principale (leads, users, contacts, etc.)
Structure type :
```sql
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'status_2', 'status_3', 'status_final')),

  -- Donnees metier (adapter au projet)
  email text not null,
  phone text,
  -- ...

  -- Interne
  notes text
);
```

### Table notes
Chaque entite principale a sa table de notes pour l'admin :
```sql
create table if not exists lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_lead_notes_lead_id on lead_notes(lead_id);
```

### Table events (timeline / audit log)
Chaque entite principale a sa table d'events pour tracer l'historique :
```sql
create table if not exists lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  type text not null,
  content text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);
create index if not exists idx_lead_events_lead_id on lead_events(lead_id);
create index if not exists idx_lead_events_created_at on lead_events(created_at);
```

### Trigger auto-log
Chaque table principale a un trigger qui log automatiquement les creations et changements de statut :
```sql
create or replace function public.log_lead_event() returns trigger language plpgsql security definer as $func$
begin
  if tg_op = 'INSERT' then
    insert into lead_events (lead_id, type, content) values (NEW.id, 'lead_created', 'Lead cree');
  elsif tg_op = 'UPDATE' and OLD.status is distinct from NEW.status then
    insert into lead_events (lead_id, type, content, metadata)
    values (NEW.id, 'status_changed', 'Statut : ' || OLD.status || ' > ' || NEW.status,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status));
  end if;
  return NEW;
end;
$func$;

create trigger log_lead_events after insert or update on public.leads
  for each row execute function public.log_lead_event();
```

### Webhooks database
Pour declencher des Edge Functions automatiquement :
- **INSERT** sur la table principale : declenche la notification (email admin + confirmation client)
- **UPDATE** sur la table principale (changement de statut) : declenche l'email de transition
- **INSERT** sur les tables secondaires (SAV, etc.) : declenche les notifications specifiques

Configurer les webhooks dans le dashboard Supabase > Database > Webhooks.

### Storage (fichiers)
- Bucket : `documents`
- Structure des chemins : `[entite]/[id]/[prefix]_[timestamp]_[filename]`
- Prefixes pour classer les fichiers : `client_` (uploade par le client), `devis_` ou `quote_` (devis), `attestation_` (documents finaux)
- Signed URLs pour le telechargement (expiration 1h : 3600s)
- Taille max : 20 Mo client, 50 Mo admin

### Types d'events standards
Les events logges dans la table events suivent ces types :
- `lead_created` : creation automatique (trigger)
- `status_changed` : changement de statut automatique (trigger), metadata contient old/new status
- `email_sent` : email envoye (log manuel), metadata contient to/subject
- `note_added` : note ajoutee (log manuel)
- `document_uploaded` : document uploade (log manuel)

### RLS (Row Level Security)
Si RLS est active :
- Les clients anonymes ne peuvent que INSERT (soumission de formulaire)
- SELECT/UPDATE/DELETE requirent le service_role ou un token authentifie
- Sinon, gerer le controle d'acces au niveau des Edge Functions

---

## 23. CE QU'IL NE FAUT JAMAIS FAIRE

- ❌ Utiliser le tiret cadratin
- ❌ Repeter les memes blocs de benefices plusieurs fois
- ❌ Utiliser Google Fonts en externe
- ❌ Mettre des emojis dans les paragraphes
- ❌ Ecrire "En savoir plus" comme CTA
- ❌ Utiliser jQuery ou des libs d'animation JS
- ❌ Laisser des pages privees indexables
- ❌ Exposer des donnees sensibles cote client
- ❌ Wildcard CORS en prod
- ❌ Charger Turnstile au chargement de la page
- ❌ Over-engineer
- ❌ Oublier le CTA mobile sticky
- ❌ Avoir du scroll horizontal sur mobile
- ❌ Appeler une API sans timeout
- ❌ Force push sur main
- ❌ Commiter des fichiers .env ou des credentials
- ❌ Afficher des donnees techniques dans les messages d'erreur utilisateur
- ❌ Perdre les donnees du formulaire en cas d'erreur de soumission

---

Applique ces regles des le debut. Si une section ne correspond pas au projet, ignore-la. Ne me demande pas confirmation pour chaque point, fais-le.
