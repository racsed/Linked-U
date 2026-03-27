// ============================================================
// LINKED.U - data.js
// Donnees mock + helpers localStorage
// ============================================================

// --------------- Storage helpers ---------------
const Storage = {
  get(key, fallback) {
    try {
      const val = localStorage.getItem('nexta_' + key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem('nexta_' + key, JSON.stringify(val));
    } catch {}
  },
  remove(key) {
    localStorage.removeItem('nexta_' + key);
  }
};

// --------------- Current user ---------------
const CURRENT_USER = {
  id: 'user_amira',
  firstName: 'Amira',
  lastName: 'K.',
  fullName: 'Amira K.',
  avatar: null,
  initials: 'AK',
  color: '#6366f1',
  classe: '1re STMG',
  filiere: 'Mercatique',
  lycee: 'Lycee Jean Moulin',
  bio: 'Passionnee de marketing digital et de communication. Co-fondatrice de la mini-entreprise LINKED.U dans le cadre du projet EPA. En recherche de stage en marketing/communication pour decouvrir le monde professionnel.',
  headline: '1re STMG Mercatique - Lycee Jean Moulin',
  skills: ['Marketing', 'Communication', 'E-commerce', 'Canva', 'Reseaux sociaux'],
  connections: 42,
  posts: 12,
  views: 156,
  badges: ['profil_complet', '10_connexions', 'ressource_partagee']
};

// --------------- Users ---------------
const USERS = [
  {
    id: 'user_karim',
    firstName: 'Karim',
    lastName: 'D.',
    fullName: 'Karim D.',
    initials: 'KD',
    color: '#22c55e',
    classe: '1re STMG',
    filiere: 'Mercatique',
    lycee: 'Lycee Jean Moulin',
    bio: 'Passione de sport et de commerce. En stage chez Decathlon.',
    skills: ['Vente', 'Sport', 'Relation client']
  },
  {
    id: 'user_ines',
    firstName: 'Ines',
    lastName: 'R.',
    fullName: 'Ines R.',
    initials: 'IR',
    color: '#f97316',
    classe: 'Tle Bac Pro Commerce',
    filiere: 'Commerce',
    lycee: 'Lycee Victor Hugo',
    bio: 'Terminale Bac Pro Commerce, specialisee en vente et conseil client.',
    skills: ['Vente', 'Conseil client', 'Merchandising', 'CV']
  },
  {
    id: 'user_seddar',
    firstName: 'M. Seddar',
    lastName: '',
    fullName: 'M. Seddar',
    initials: 'MS',
    color: '#8b5cf6',
    classe: 'Professeur',
    filiere: 'Eco-gestion',
    lycee: 'Lycee Jean Moulin',
    bio: 'Professeur d\'economie-gestion. Referent numerique et accompagnement des eleves dans leurs projets professionnels.',
    skills: ['Economie', 'Gestion', 'MSDGN', 'Pedagogie']
  },
  {
    id: 'user_nina',
    firstName: 'Nina',
    lastName: 'L.',
    fullName: 'Nina L.',
    initials: 'NL',
    color: '#f59e0b',
    classe: '1re STMG',
    filiere: 'Mercatique',
    lycee: 'Lycee Jean Moulin',
    bio: 'Creatrice de contenu en herbe, passionnee par le digital.',
    skills: ['Reseaux sociaux', 'Creation de contenu', 'Canva']
  },
  {
    id: 'user_mehdi',
    firstName: 'Mehdi',
    lastName: 'A.',
    fullName: 'Mehdi A.',
    initials: 'MA',
    color: '#8b5cf6',
    classe: 'Tle STMG',
    filiere: 'GF',
    lycee: 'Lycee Condorcet',
    bio: 'Terminale STMG option gestion-finance. Interesse par la comptabilite et l\'audit.',
    skills: ['Comptabilite', 'Finance', 'Excel', 'Gestion']
  },
  {
    id: 'user_sofia',
    firstName: 'Sofia',
    lastName: 'T.',
    fullName: 'Sofia T.',
    initials: 'ST',
    color: 'linear-gradient(135deg, #f97316, #f59e0b)',
    classe: '2nde GT',
    filiere: 'Generale et Technologique',
    lycee: 'Lycee Pasteur',
    bio: 'En seconde, j\'explore mes options. Interessee par le commerce et le numerique.',
    skills: ['Curiosite', 'Travail d\'equipe', 'Anglais']
  },
  {
    id: 'user_ryan',
    firstName: 'Ryan',
    lastName: 'B.',
    fullName: 'Ryan B.',
    initials: 'RB',
    color: 'linear-gradient(135deg, #6366f1, #22c55e)',
    classe: 'BTS MCO 1',
    filiere: 'Management Commercial Operationnel',
    lycee: 'Lycee Montaigne',
    bio: 'BTS MCO premiere annee. En alternance chez Fnac. Objectif : manager commercial.',
    skills: ['Management', 'Vente', 'Animation commerciale', 'Excel']
  }
];

// --------------- Helper: find user ---------------
function getUserById(id) {
  if (id === 'user_amira') return CURRENT_USER;
  if (id === 'nexta_team') return { id: 'nexta_team', fullName: 'LINKED.U Equipe', initials: 'L.U', color: '#6366f1' };
  return USERS.find(u => u.id === id) || null;
}

// --------------- Posts ---------------
const DEFAULT_POSTS = [
  {
    id: 'post_1',
    userId: 'user_karim',
    content: '<p>Super nouvelle ! Je viens de decrocher mon <strong>stage chez Decathlon</strong> pour les vacances de fevrier ! 2 semaines en rayon sport collectif.</p><p>Merci a M. Seddar pour la lettre de motivation et a Ines pour ses conseils sur l\'entretien. La communaute LINKED.U, ca aide vraiment !</p>',
    likes: 24,
    liked: false,
    bookmarked: false,
    comments: [
      { id: 'c1_1', userId: 'user_ines', text: 'Bravo Karim ! Tu le merites, tu avais super bien prepare ton entretien !', timestamp: '2026-03-24T10:30:00' },
      { id: 'c1_2', userId: 'user_seddar', text: 'Felicitations ! N\'oublie pas de tenir ton journal de stage.', timestamp: '2026-03-24T11:00:00' }
    ],
    timestamp: '2026-03-24T09:15:00'
  },
  {
    id: 'post_2',
    userId: 'user_seddar',
    content: '<p>Rappel pour mes eleves de 1re STMG : la <strong>fiche de revision MSDGN</strong> sur le chapitre "Les organisations et leur environnement" est disponible dans les ressources.</p><p>Pensez a la telecharger avant le controle de vendredi !</p>',
    likes: 18,
    liked: false,
    bookmarked: false,
    comments: [
      { id: 'c2_1', userId: 'user_nina', text: 'Merci M. Seddar ! Je la telecharge tout de suite.', timestamp: '2026-03-23T15:00:00' }
    ],
    timestamp: '2026-03-23T14:30:00'
  },
  {
    id: 'post_3',
    userId: 'user_ines',
    content: '<p>Mon conseil du jour pour vos candidatures : <strong>personnalisez toujours votre lettre de motivation</strong>. Les recruteurs voient tout de suite quand c\'est du copier-coller.</p><p>Astuce : reprenez des mots-cles de l\'offre de stage dans votre lettre. Ca montre que vous avez lu et compris ce qu\'ils cherchent.</p>',
    likes: 31,
    liked: true,
    bookmarked: false,
    comments: [
      { id: 'c3_1', userId: 'user_amira', text: 'Trop bien comme conseil ! Je vais refaire ma lettre du coup.', timestamp: '2026-03-22T17:00:00' },
      { id: 'c3_2', userId: 'user_mehdi', text: 'Ca marche aussi pour les lettres de motivation Parcoursup ?', timestamp: '2026-03-22T17:30:00' },
      { id: 'c3_3', userId: 'user_ines', text: '@Mehdi Oui exactement le meme principe ! Adapte a chaque formation.', timestamp: '2026-03-22T18:00:00' }
    ],
    timestamp: '2026-03-22T16:45:00'
  },
  {
    id: 'post_4',
    userId: 'nexta_team',
    content: '<p>Nouvelle fonctionnalite sur LINKED.U : vous pouvez maintenant <strong>filtrer les offres de stage</strong> par secteur, niveau et duree !</p><p>Decouvrez les dernieres offres dans l\'onglet Stages. Et n\'hesitez pas a partager vos propres experiences de stage avec la communaute.</p>',
    likes: 45,
    liked: false,
    bookmarked: false,
    comments: [],
    timestamp: '2026-03-21T10:00:00'
  }
];

// --------------- Stages ---------------
const DEFAULT_STAGES = [
  {
    id: 'stage_1',
    title: 'Vendeur conseil - Rayon sport collectif',
    company: 'Decathlon',
    location: 'Lyon 3e',
    duration: '1 semaine',
    level: '3e / 2nde',
    mode: 'Presentiel',
    tags: ['Commerce', 'Sport'],
    category: 'commerce',
    icon: 'fas fa-shopping-bag',
    iconBg: '#dbeafe',
    iconColor: '#3b82f6',
    description: 'Decouverte du metier de vendeur conseil dans un magasin de sport. Accueil client, mise en rayon, conseil produit.'
  },
  {
    id: 'stage_2',
    title: 'Assistant webdesigner',
    company: 'Pixelcraft Studio',
    location: 'Lyon 7e / Teletravail',
    duration: '2 semaines',
    level: '1re / Tle STMG',
    mode: 'Hybride',
    tags: ['Numerique', 'Web'],
    category: 'numerique',
    icon: 'fas fa-laptop-code',
    iconBg: '#ede9fe',
    iconColor: '#8b5cf6',
    description: 'Participation a la creation de maquettes web, initiation au design UI/UX et integration HTML/CSS.'
  },
  {
    id: 'stage_3',
    title: 'Assistant administratif - Accueil patients',
    company: 'Cabinet Dr. Benhamed',
    location: 'Villeurbanne',
    duration: '1 semaine',
    level: '3e',
    mode: 'Presentiel',
    tags: ['Sante', 'Administration'],
    category: 'sante',
    icon: 'fas fa-heartbeat',
    iconBg: '#fce7f3',
    iconColor: '#ec4899',
    description: 'Decouverte de la gestion administrative d\'un cabinet medical. Accueil, prise de rendez-vous, classement.'
  },
  {
    id: 'stage_4',
    title: 'Charge de communication digitale',
    company: 'StartupFlow',
    location: 'Lyon 2e / Teletravail',
    duration: '12 mois',
    level: 'BTS',
    mode: 'Hybride',
    tags: ['Communication', 'Reseaux sociaux'],
    category: 'communication',
    icon: 'fas fa-bullhorn',
    iconBg: '#fef3c7',
    iconColor: '#f59e0b',
    isAlternance: true,
    description: 'Alternance en communication digitale : gestion des reseaux sociaux, creation de contenu, community management.'
  },
  {
    id: 'stage_5',
    title: 'Decouverte patisserie artisanale',
    company: 'Maison Lemoine',
    location: 'Lyon 6e',
    duration: '1 semaine',
    level: '3e / 2nde',
    mode: 'Presentiel',
    tags: ['Artisanat', 'Alimentation'],
    category: 'artisanat',
    icon: 'fas fa-bread-slice',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    description: 'Immersion dans une patisserie artisanale. Decouverte des techniques de fabrication et de la vente en boutique.'
  }
];

// --------------- Resources ---------------
const DEFAULT_RESOURCES = [
  {
    id: 'res_1',
    userId: 'user_seddar',
    title: 'Fiche revision MSDGN - Les organisations',
    description: 'Fiche de synthese complete sur le chapitre "Les organisations et leur environnement". Definitions, schemas et exercices corriges.',
    type: 'fiche',
    typeLabel: 'Fiche de revision',
    typeIcon: 'fas fa-file-alt',
    typeColor: '#3b82f6',
    downloads: 87,
    likes: 34,
    comments: 12,
    category: 'cours',
    tags: ['MSDGN', '1re STMG', 'Organisations']
  },
  {
    id: 'res_2',
    userId: 'user_ines',
    title: 'Template CV lyceen - Word & Canva',
    description: 'Modele de CV adapte aux lyceens, avec conseils de remplissage et exemples. Disponible au format Word et Canva.',
    type: 'modele',
    typeLabel: 'Modele',
    typeIcon: 'fas fa-file-word',
    typeColor: '#8b5cf6',
    downloads: 156,
    likes: 67,
    comments: 23,
    category: 'candidature',
    tags: ['CV', 'Candidature', 'Lyceen']
  },
  {
    id: 'res_3',
    userId: 'user_karim',
    title: 'Guide pratique - Trouver son stage',
    description: 'Toutes les etapes pour trouver un stage : ou chercher, comment postuler, preparer l\'entretien. Base sur mon experience.',
    type: 'guide',
    typeLabel: 'Guide',
    typeIcon: 'fas fa-book',
    typeColor: '#22c55e',
    downloads: 203,
    likes: 89,
    comments: 31,
    category: 'stage',
    tags: ['Stage', 'Recherche', 'Conseils']
  }
];

// --------------- Messages ---------------
const DEFAULT_MESSAGES = [
  {
    id: 'conv_karim',
    userId: 'user_karim',
    lastMessage: 'Merci pour le conseil sur Decathlon !',
    lastTimestamp: '2026-03-24T16:30:00',
    unread: 2,
    messages: [
      { id: 'm1_1', from: 'user_karim', text: 'Salut Amira ! Tu sais s\'il y a encore des places pour le stage Decathlon ?', timestamp: '2026-03-24T14:00:00' },
      { id: 'm1_2', from: 'user_amira', text: 'Salut ! Oui je crois qu\'ils cherchent encore quelqu\'un pour le rayon textile. Postule vite !', timestamp: '2026-03-24T14:15:00' },
      { id: 'm1_3', from: 'user_karim', text: 'Super, je vais envoyer ma candidature ce soir.', timestamp: '2026-03-24T14:30:00' },
      { id: 'm1_4', from: 'user_amira', text: 'N\'hesite pas si tu veux que je relise ta lettre de motivation.', timestamp: '2026-03-24T15:00:00' },
      { id: 'm1_5', from: 'user_karim', text: 'Trop gentille ! Je t\'envoie ca.', timestamp: '2026-03-24T16:00:00' },
      { id: 'm1_6', from: 'user_karim', text: 'Merci pour le conseil sur Decathlon !', timestamp: '2026-03-24T16:30:00' }
    ]
  },
  {
    id: 'conv_ines',
    userId: 'user_ines',
    lastMessage: 'Je t\'envoie la fiche de revision ce soir',
    lastTimestamp: '2026-03-23T18:00:00',
    unread: 0,
    messages: [
      { id: 'm2_1', from: 'user_ines', text: 'Hey Amira, tu as la fiche de revision pour le controle de vendredi ?', timestamp: '2026-03-23T17:00:00' },
      { id: 'm2_2', from: 'user_amira', text: 'Oui ! M. Seddar l\'a mise dans les ressources, tu as vu ?', timestamp: '2026-03-23T17:30:00' },
      { id: 'm2_3', from: 'user_ines', text: 'Ah non j\'avais pas vu, merci !', timestamp: '2026-03-23T17:45:00' },
      { id: 'm2_4', from: 'user_amira', text: 'Je t\'envoie la fiche de revision ce soir', timestamp: '2026-03-23T18:00:00' }
    ]
  },
  {
    id: 'conv_seddar',
    userId: 'user_seddar',
    lastMessage: 'Pensez a completer vos profils avant vendredi',
    lastTimestamp: '2026-03-22T09:00:00',
    unread: 1,
    messages: [
      { id: 'm3_1', from: 'user_seddar', text: 'Bonjour Amira, j\'espere que le projet LINKED.U avance bien. N\'hesitez pas si vous avez des questions.', timestamp: '2026-03-21T10:00:00' },
      { id: 'm3_2', from: 'user_amira', text: 'Bonjour M. Seddar ! Oui tout avance bien, on finalise les fonctionnalites cette semaine.', timestamp: '2026-03-21T14:00:00' },
      { id: 'm3_3', from: 'user_seddar', text: 'Tres bien. Pensez a completer vos profils avant vendredi, c\'est note dans l\'evaluation du projet.', timestamp: '2026-03-22T09:00:00' }
    ]
  },
  {
    id: 'conv_nina',
    userId: 'user_nina',
    lastMessage: 'Regarde ce lien !',
    lastTimestamp: '2026-03-20T20:00:00',
    unread: 0,
    messages: [
      { id: 'm4_1', from: 'user_nina', text: 'Amiraaaa ! J\'ai trouve un super article sur le marketing d\'influence, ca pourrait t\'interesser pour le projet.', timestamp: '2026-03-20T19:30:00' },
      { id: 'm4_2', from: 'user_amira', text: 'Oh trop bien, envoie !', timestamp: '2026-03-20T19:45:00' },
      { id: 'm4_3', from: 'user_nina', text: 'Regarde ce lien !', timestamp: '2026-03-20T20:00:00' }
    ]
  }
];

// --------------- Network users ---------------
const NETWORK_USERS = [
  {
    id: 'user_karim',
    connected: true,
    mutualConnections: 8
  },
  {
    id: 'user_ines',
    connected: true,
    mutualConnections: 5
  },
  {
    id: 'user_seddar',
    connected: true,
    mutualConnections: 12
  },
  {
    id: 'user_nina',
    connected: true,
    mutualConnections: 6
  },
  {
    id: 'user_mehdi',
    connected: false,
    mutualConnections: 3
  },
  {
    id: 'user_sofia',
    connected: false,
    mutualConnections: 2
  }
];

// --------------- Notifications ---------------
const NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'stage',
    icon: 'fas fa-briefcase',
    iconBg: '#dbeafe',
    iconColor: '#3b82f6',
    title: 'Nouveau stage disponible',
    message: 'Pixelcraft Studio recherche un assistant webdesigner pour 2 semaines.',
    timestamp: '2026-03-25T08:00:00',
    read: false,
    link: '#stages'
  },
  {
    id: 'notif_2',
    type: 'message',
    icon: 'fas fa-envelope',
    iconBg: '#ede9fe',
    iconColor: '#8b5cf6',
    title: 'Nouveau message de Karim D.',
    message: 'Merci pour le conseil sur Decathlon !',
    timestamp: '2026-03-24T16:30:00',
    read: false,
    link: '#messages'
  },
  {
    id: 'notif_3',
    type: 'like',
    icon: 'fas fa-heart',
    iconBg: '#fce7f3',
    iconColor: '#ec4899',
    title: 'Ines R. a aime votre publication',
    message: 'Votre conseil sur les lettres de motivation a recu 31 likes.',
    timestamp: '2026-03-23T12:00:00',
    read: false,
    link: '#feed'
  },
  {
    id: 'notif_4',
    type: 'connection',
    icon: 'fas fa-user-plus',
    iconBg: '#d1fae5',
    iconColor: '#22c55e',
    title: 'Demande de connexion',
    message: 'Sofia T. souhaite se connecter avec vous.',
    timestamp: '2026-03-22T14:00:00',
    read: true,
    link: '#network'
  },
  {
    id: 'notif_5',
    type: 'badge',
    icon: 'fas fa-trophy',
    iconBg: '#fef3c7',
    iconColor: '#f59e0b',
    title: 'Badge debloque !',
    message: 'Vous avez obtenu le badge "Ressource partagee" ! Continuez comme ca.',
    timestamp: '2026-03-21T10:00:00',
    read: true,
    link: '#profile'
  }
];

// --------------- Badges ---------------
const BADGES = [
  {
    id: 'profil_complet',
    title: 'Profil complete',
    description: 'Vous avez rempli toutes les sections de votre profil.',
    icon: 'fas fa-user-check',
    color: '#6366f1',
    earned: true,
    earnedDate: '2026-03-15'
  },
  {
    id: '10_connexions',
    title: '10 connexions',
    description: 'Vous avez atteint 10 connexions sur LINKED.U.',
    icon: 'fas fa-users',
    color: '#22c55e',
    earned: true,
    earnedDate: '2026-03-18'
  },
  {
    id: 'premiere_candidature',
    title: '1re candidature',
    description: 'Vous avez envoye votre premiere candidature de stage.',
    icon: 'fas fa-paper-plane',
    color: '#3b82f6',
    earned: false,
    earnedDate: null
  },
  {
    id: 'ressource_partagee',
    title: 'Ressource partagee',
    description: 'Vous avez partage votre premiere ressource avec la communaute.',
    icon: 'fas fa-share-alt',
    color: '#f59e0b',
    earned: true,
    earnedDate: '2026-03-21'
  },
  {
    id: '50_connexions',
    title: '50 connexions',
    description: 'Vous avez atteint 50 connexions. Votre reseau s\'agrandit !',
    icon: 'fas fa-network-wired',
    color: '#8b5cf6',
    earned: false,
    earnedDate: null
  },
  {
    id: 'mentor',
    title: 'Mentor',
    description: 'Vous avez aide 5 personnes via les messages ou commentaires.',
    icon: 'fas fa-hands-helping',
    color: '#ec4899',
    earned: false,
    earnedDate: null
  },
  {
    id: 'top_contributeur',
    title: 'Top contributeur',
    description: 'Vous faites partie des membres les plus actifs de LINKED.U ce mois-ci.',
    icon: 'fas fa-star',
    color: '#f97316',
    earned: false,
    earnedDate: null
  }
];

// --------------- Candidatures ---------------
const DEFAULT_CANDIDATURES = [
  {
    id: 'cand_1',
    stageId: 'stage_1',
    status: 'acceptee',
    motivation: 'Passionnee de sport et de commerce, je souhaite decouvrir le metier de vendeur conseil chez Decathlon.',
    appliedDate: '2026-03-10',
    updatedDate: '2026-03-18'
  },
  {
    id: 'cand_2',
    stageId: 'stage_2',
    status: 'envoyee',
    motivation: 'Le webdesign m\'interesse beaucoup et j\'aimerais decouvrir le quotidien d\'un studio creatif.',
    appliedDate: '2026-03-22',
    updatedDate: '2026-03-22'
  }
];

// --------------- Events ---------------
const DEFAULT_EVENTS = [
  {
    id: 'evt_1',
    title: 'Forum des metiers - Lyon',
    description: 'Rencontrez plus de 50 entreprises et decouvrez des metiers dans tous les secteurs. Apportez votre CV !',
    date: '2026-04-10',
    time: '09:00 - 17:00',
    location: 'Palais des Congres, Lyon',
    type: 'forum',
    icon: 'fas fa-building',
    iconBg: '#dbeafe',
    iconColor: '#3b82f6',
    attendees: 234,
    registered: false
  },
  {
    id: 'evt_2',
    title: 'Atelier CV & Lettre de motivation',
    description: 'Apprenez a rediger un CV percutant et une lettre de motivation efficace avec des professionnels RH.',
    date: '2026-04-05',
    time: '14:00 - 16:00',
    location: 'Lycee Jean Moulin - Salle B12',
    type: 'atelier',
    icon: 'fas fa-pen-fancy',
    iconBg: '#ede9fe',
    iconColor: '#8b5cf6',
    attendees: 28,
    registered: true
  },
  {
    id: 'evt_3',
    title: 'Portes ouvertes BTS Commerce',
    description: 'Decouvrez les formations BTS MCO et BTS NDRC. Echangez avec les etudiants et les enseignants.',
    date: '2026-04-15',
    time: '10:00 - 16:00',
    location: 'Lycee Montaigne, Lyon',
    type: 'portes-ouvertes',
    icon: 'fas fa-door-open',
    iconBg: '#d1fae5',
    iconColor: '#22c55e',
    attendees: 156,
    registered: false
  },
  {
    id: 'evt_4',
    title: 'Conference : Entreprendre au lycee',
    description: 'Temoignages d\'anciens eleves ayant participe au programme EPA et qui ont lance leur propre activite.',
    date: '2026-04-20',
    time: '15:00 - 17:00',
    location: 'Amphitheatre - Lycee Jean Moulin',
    type: 'conference',
    icon: 'fas fa-microphone-alt',
    iconBg: '#fef3c7',
    iconColor: '#f59e0b',
    attendees: 67,
    registered: false
  }
];

// --------------- Chatbot responses ---------------
const CHATBOT_RESPONSES = [
  { keywords: ['stage', 'trouver', 'cherche'], response: 'Pour trouver un stage, je te conseille de : 1) Completer ton profil LINKED.U 2) Consulter l\'onglet Stages 3) Personnaliser ta lettre de motivation pour chaque offre. Tu peux aussi demander a ton reseau !' },
  { keywords: ['cv', 'curriculum'], response: 'Un bon CV lyceen doit inclure : tes coordonnees, ta formation, tes experiences (meme benevoles), tes competences et tes centres d\'interet. Utilise le template CV dans les Ressources !' },
  { keywords: ['lettre', 'motivation'], response: 'Pour ta lettre de motivation : 1) Accroche personnalisee 2) Pourquoi cette entreprise 3) Ce que tu peux apporter 4) Formule de politesse. Sois sincere et concret(e) !' },
  { keywords: ['stmg', 'filiere', 'orientation'], response: 'La filiere STMG offre 4 specialites en Terminale : Mercatique, GF (Gestion-Finance), RHC (Ressources Humaines) et SIG (Systemes d\'Information). Apres le bac : BTS, BUT, licence, prepa ECT...' },
  { keywords: ['parcoursup', 'inscription', 'voeux'], response: 'Pour Parcoursup : 1) Bien remplir ta fiche de preferences 2) Soigner tes lettres de motivation (projet de formation motive) 3) Demander des avis a tes profs. Les voeux comptent, prends le temps !' },
  { keywords: ['badge', 'gagner', 'debloquer'], response: 'Tu peux debloquer des badges en : completant ton profil, atteignant 10 puis 50 connexions, envoyant ta premiere candidature, partageant une ressource, et en aidant les autres membres !' },
  { keywords: ['alternance', 'apprentissage'], response: 'L\'alternance combine formation et experience pro. Tu alternes entre cours et entreprise. C\'est possible des le BTS ! Regarde les offres avec le tag "Alternance" dans l\'onglet Stages.' },
  { keywords: ['entretien', 'preparer'], response: 'Pour un entretien : 1) Renseigne-toi sur l\'entreprise 2) Prepare des questions 3) Habille-toi correctement 4) Sois ponctuel(e) 5) Sois toi-meme et montre ta motivation !' },
  { keywords: ['bonjour', 'salut', 'hello', 'coucou'], response: 'Salut ! Je suis l\'assistant LINKED.U. Je peux t\'aider sur : les stages, le CV, la lettre de motivation, l\'orientation, Parcoursup, les badges... Pose-moi ta question !' },
  { keywords: ['merci', 'super', 'genial'], response: 'Avec plaisir ! N\'hesite pas si tu as d\'autres questions. Bonne continuation sur LINKED.U !' }
];

// --------------- Leaderboard (gamification) ---------------
const LEADERBOARD = [
  { userId: 'user_ines', points: 420, rank: 1 },
  { userId: 'user_karim', points: 385, rank: 2 },
  { userId: 'user_amira', points: 350, rank: 3 },
  { userId: 'user_seddar', points: 310, rank: 4 },
  { userId: 'user_nina', points: 275, rank: 5 },
  { userId: 'user_ryan', points: 220, rank: 6 },
  { userId: 'user_mehdi', points: 180, rank: 7 },
  { userId: 'user_sofia', points: 95, rank: 8 }
];

// --------------- Mentoring ---------------
const DEFAULT_MENTORS = [
  {
    id: 'mentor_seddar',
    userId: 'user_seddar',
    specialty: 'Orientation & projet professionnel',
    availability: 'Lundi et Jeudi, 12h-13h',
    sessions: 24,
    rating: 4.9
  },
  {
    id: 'mentor_ryan',
    userId: 'user_ryan',
    specialty: 'Alternance & BTS Commerce',
    availability: 'Mercredi 17h-18h',
    sessions: 8,
    rating: 4.7
  },
  {
    id: 'mentor_ines',
    userId: 'user_ines',
    specialty: 'CV, candidatures & entretiens',
    availability: 'Mardi et Vendredi, 16h-17h',
    sessions: 15,
    rating: 4.8
  }
];
