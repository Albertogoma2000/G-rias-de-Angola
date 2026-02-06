import { GoogleGenAI } from "@google/genai";

// Initialize Gemini with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

const handleGeminiError = (error: any, defaultMessage: string): string => {
  console.error("Gemini API Error:", error);
  const msg = error?.message || error?.toString() || "";
  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota")) {
    return "⚠️ Muitos pedidos (429). Aguarde um momento.";
  }
  return defaultMessage;
};

/**
 * Translates standard Portuguese to Angolan Slang or explains a phrase.
 */
export const translateToAngolanSlang = async (text: string, direction: 'toSlang' | 'toStandard'): Promise<string> => {
  try {
    const prompt = direction === 'toSlang'
      ? `Aja como um angolano nativo, jovem e carismático. Reescreva a seguinte frase usando gírias angolanas autênticas e modernas (como mambo, bwé, kamba, etc). Mantenha o sentido original mas deixe bem "angolano". Frase: "${text}"`
      : `Aja como um linguista especialista em português de Angola. Traduza a seguinte frase cheia de gírias angolanas para o português padrão (formal ou informal culto), explicando o significado se necessário. Frase: "${text}"`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Speed is priority for this UI
        temperature: 0.8, // Be creative with slang
      }
    });

    return response.text || "Não foi possível traduzir no momento. Tente novamente.";
  } catch (error) {
    return handleGeminiError(error, "Erro ao conectar com a IA. Verifique sua conexão.");
  }
};

/**
 * Gets the "Deep Dive" cultural context for a specific slang term.
 */
export const getCulturalContext = async (term: string): Promise<string> => {
  try {
    const prompt = `Explique a origem, o contexto cultural e curiosidades sobre a gíria angolana "${term}". Seja breve, educativo e divertido (máximo 1 parágrafo).`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Informação indisponível.";
  } catch (error) {
    return handleGeminiError(error, "Não foi possível carregar o contexto cultural.");
  }
};

/**
 * Translates a slang term and its definition to a target international language.
 */
export const translateSlangToInternational = async (term: string, definition: string, targetLanguage: 'English' | 'French'): Promise<string> => {
  try {
    const prompt = `Translate the Angolan slang term "${term}" (which means: "${definition}") to ${targetLanguage}. 
    Provide the translation for the term (if a close equivalent exists in ${targetLanguage} slang) and the translation for the definition.
    Format as: "Term: [Translated Term] | Definition: [Translated Definition]". 
    Be culturally accurate to ${targetLanguage}. Keep it short.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.3, // Accuracy over creativity
      }
    });

    return response.text || "Translation error.";
  } catch (error) {
    return handleGeminiError(error, "Erro ao traduzir. Tente novamente.");
  }
};