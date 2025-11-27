import { Proposal, ProposalCategory, ForumTopic } from './types';

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: '0',
    title: 'Gouvernance Ouverte et Participative',
    description: 'Mise en place de comptes-rendus complets et transparents du conseil. Tirage au sort d\'habitants sur les listes électorales pour participer aux commissions. Invitation d\'experts indépendants pour les grands projets.',
    author: 'Collectif Citoyen',
    date: '2024-01-10',
    votes: 342,
    category: ProposalCategory.Other,
    aiAnalysis: {
      impact: "Renforcement majeur de la démocratie locale et de la transparence.",
      feasibility: "Élevée",
      estimatedCost: "€",
      tags: ["démocratie", "transparence", "citoyenneté"]
    }
  },
  {
    id: '1',
    title: 'Végétalisation de la Place de l\'Eglise',
    description: 'Remplacer le stationnement temporaire par des jardinières et des bancs pour créer un îlot de fraîcheur au centre du village.',
    author: 'Marie D.',
    date: '2023-10-15',
    votes: 124,
    category: ProposalCategory.Environment,
    aiAnalysis: {
      impact: "Embellissement du patrimoine historique et réduction des îlots de chaleur.",
      feasibility: "Élevée",
      estimatedCost: "€€",
      tags: ["patrimoine", "tourisme", "cadre de vie"]
    }
  },
  {
    id: '3',
    title: 'Festival de la Street Food',
    description: 'Organiser un grand marché gourmand nocturne avec des food trucks locaux, des producteurs régionaux et des animations musicales.',
    author: 'Sophie L.',
    date: '2023-11-20',
    votes: 215,
    category: ProposalCategory.Culture,
     aiAnalysis: {
      impact: "Dynamisation de la vie locale et soutien aux producteurs locaux.",
      feasibility: "Moyenne",
      estimatedCost: "€€",
      tags: ["gastronomie", "convivialité", "événementiel"]
    }
  }
];

export const MOCK_EVENTS = [
  {
    id: 1,
    title: "Conseil Municipal Public",
    date: "15 Décembre 2023",
    location: "Salle Plaimpalais",
    description: "Présentation du projet d'aménagement de la Combe et vote du budget."
  },
  {
    id: 2,
    title: "Conseil Municipal des Jeunes",
    date: "20 Mai 2024",
    location: "Salle du Conseil",
    description: "Installation des nouveaux élus du CMJ et présentation de leurs projets pour la commune."
  }
];

export const INITIAL_FORUM_TOPICS: ForumTopic[] = [
  {
    id: '1',
    title: "Projet Gendarmerie : vos avis ?",
    author: "Jean-Michel T.",
    date: "Il y a 2 heures",
    category: "Travaux",
    views: 89,
    replies: [
      {
        id: 'r1',
        author: 'Sarah L.',
        content: "C'est nécessaire pour la sécurité, mais attention à l'intégration paysagère près du Chéran.",
        date: "Il y a 1 heure"
      }
    ]
  },
  {
    id: '2',
    title: "Stationnement et travaux de parkings",
    author: "Commerçants Alby",
    date: "Il y a 1 jour",
    category: "Infrastructure",
    views: 230,
    replies: [
      {
        id: 'r3',
        author: 'Mairie (Service Technique)',
        content: "Une réunion publique de concertation est prévue le mois prochain pour discuter des nouvelles zones bleues.",
        date: "Il y a 5 heures"
      },
       {
        id: 'r4',
        author: 'Habitant du bourg',
        content: "Il faudrait privilégier les parkings relais en entrée de ville.",
        date: "Il y a 2 heures"
      }
    ]
  },
  {
    id: '3',
    title: "Consultation : Projet de la Combe",
    author: "Association Nature",
    date: "Il y a 3 jours",
    category: "Environnement",
    views: 412,
    replies: []
  }
];