const { GoogleGenAI } = require('@google/genai');

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Please set it in .env");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

exports.analyzeWithGemini = async (imagesBase64, context, lat, lng) => {
  const ai = getGeminiClient();
  
  if (!ai) {
    throw new Error('Gemini client could not be initialized.');
  }
  
  const systemPrompt = `You are UrbanIQ, an elite AI urban infrastructure analyst for Indian cities. 
You analyze photos of broken urban infrastructure and return a structured JSON redevelopment report.
You must ground your analysis in Indian contexts, citing real government schemes and realistic severity metrics.
Always respond ONLY with valid JSON, no markdown, no preamble.`;

  const userPromptText = `Analyze these photos of a broken urban location in India.
Location context: ${context || 'None provided'}
GPS: ${lat && lng ? `${lat}, ${lng}` : 'Not available'}

Determine the severity score (1-10) using these strict criteria:
- 1-3 (Low): Cosmetic damage, no immediate threat.
- 4-6 (Moderate): Hinders daily usage, risk of escalating over months.
- 7-8 (High): Major traffic/pedestrian disruption, potential for minor accidents.
- 9-10 (Critical): Immediate threat to life, structural collapse, severe flooding.

Identify 1-3 applicable Indian Government Schemes (e.g., Smart Cities Mission, AMRUT, PMGSY, PM SVANidhi, Swachh Bharat) based on the problem type.
Identify the Required Contractor Type (e.g., Level 1 Heavy Civil, Local Municipal Contractor, Electrical Specialist).

Return this exact JSON structure:
{
  "location_type": "string (e.g., Arterial Highway, Pedestrian Zone)",
  "severity_score": number (1-10),
  "severity_label": "Critical/High/Moderate/Low",
  "root_cause": "string (detailed analysis of why it broke)",
  "immediate_actions": ["action 1", "action 2"],
  "phases": [
    { "phase": 1, "title": "...", "work": "...", "cost_inr": "X–Y lakhs", "timeline": "..." }
  ],
  "applicable_schemes": ["Scheme 1", "Scheme 2"],
  "contractor_type": "string",
  "pitch_line": "One powerful sentence to pitch this repair in a council meeting"
}`;

  const contents = [userPromptText];

  imagesBase64.forEach(img => {
    // img is a data URI like "data:image/jpeg;base64,/9j/4AAQ..."
    const parts = img.split(';');
    const mimeType = parts[0].split(':')[1];
    const base64Data = parts[1].split(',')[1];
    
    contents.push({
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: base64Data
      }
    });
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.2,
      responseMimeType: 'application/json',
    }
  });

  return response.text;
};
