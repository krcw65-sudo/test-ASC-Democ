import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysis, ProposalCategory } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_MODEL = "gemini-2.5-flash";
const CHAT_MODEL = "gemini-2.5-flash";

/**
 * Analyzes a citizen proposal to categorize it and estimate impact/cost.
 */
export const analyzeProposalWithGemini = async (
  title: string,
  description: string
): Promise<AIAnalysis & { category: ProposalCategory }> => {
  
  const prompt = `
    Tu es un expert en gestion municipale pour la commune d'Alby-sur-Chéran (Haute-Savoie, village médiéval).
    Analyse la proposition citoyenne suivante.
    Titre: ${title}
    Description: ${description}
    
    Retourne une analyse JSON stricte.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      impact: { type: Type.STRING, description: "Court résumé de l'impact social et environnemental (max 20 mots)." },
      feasibility: { type: Type.STRING, description: "Niveau de faisabilité (Faible, Moyenne, Élevée, Très Élevée)." },
      estimatedCost: { type: Type.STRING, description: "Estimation symbolique du coût (€, €€, €€€, €€€€)." },
      tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 mots-clés pertinents." },
      category: { 
        type: Type.STRING, 
        enum: [
            'Environnement', 
            'Culture & Patrimoine', 
            'Infrastructure', 
            'Éducation', 
            'Sports & Loisirs', 
            'Autre'
        ],
        description: "La catégorie la plus appropriée."
      }
    },
    required: ["impact", "feasibility", "estimatedCost", "tags", "category"]
  };

  try {
    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Error analyzing proposal:", error);
    // Fallback in case of error
    return {
      impact: "Analyse indisponible pour le moment.",
      feasibility: "Inconnue",
      estimatedCost: "?",
      tags: ["N/A"],
      category: ProposalCategory.Other
    };
  }
};

/**
 * Checks content for moderation. Returns true if content is safe, false if toxic.
 */
export const checkContentModeration = async (text: string): Promise<{ safe: boolean; reason?: string }> => {
    const prompt = `
      Tu es un modérateur pour le forum municipal d'Alby-sur-Chéran.
      Analyse le message suivant. Est-il respectueux et approprié pour un forum public ?
      Rejette les insultes, la haine, le spam évident ou les propos illégaux.
      
      Message: "${text}"
      
      Réponds en JSON uniquement.
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        safe: { type: Type.BOOLEAN, description: "True si le message est publiable, False sinon." },
        reason: { type: Type.STRING, description: "Si refusé, explique pourquoi en 5 mots max (ex: 'Propos insultants'). Sinon vide." }
      },
      required: ["safe"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        
        const resText = response.text;
        if (!resText) return { safe: true };
        return JSON.parse(resText);
    } catch (e) {
        console.error("Moderation error", e);
        return { safe: true }; // Fail open if AI fails, in this demo context
    }
};

/**
 * Creates a chat session for the municipal assistant.
 */
export const createMunicipalChat = () => {
  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction: `
        Tu es "AlbyBot", l'assistant virtuel de la mairie d'Alby-sur-Chéran (74540).
        Ton ton est chaleureux, poli et serviable. Tu parles toujours en Français.
        
        Tes missions :
        1. Aider les citoyens avec les démarches administratives et les votes.
        2. Renseigner sur les projets en cours : Aménagement de la Combe, nouvelle Gendarmerie, Travaux de parkings.
        3. Expliquer la nouvelle gouvernance : Comptes-rendus transparents, tirage au sort des citoyens, experts invités.
        
        Informations contextuelles sur Alby-sur-Chéran :
        - Village médiéval traversé par le Chéran.
        - Mairie située Place du Trophée.
        - Spécialité historique : la cordonnerie.
        
        Si tu ne connais pas une réponse, invite à contacter l'accueil.
      `,
      temperature: 0.7,
    }
  });
};