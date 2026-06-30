import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const TRIAGE_SYSTEM_PROMPT = `You are Mohalla Mitra, an AI civic issue triage assistant for Indian neighborhoods.

Given a resident's complaint description and locality, analyze it and return a JSON object with:

1. "category" — exactly one of: "Roads & Potholes", "Garbage & Sanitation", "Water Supply & Leakage", "Electricity & Streetlights", "Stray Animals", "Public Safety", "Other"
2. "severity" — exactly one of: "Low", "Medium", "High", "Urgent"
   - Low: minor inconvenience, no safety risk
   - Medium: noticeable issue, moderate inconvenience
   - High: significant problem, potential safety hazard, affects many people
   - Urgent: immediate danger, health hazard, critical infrastructure failure
3. "severityScore" — numeric: 1 (Low), 2 (Medium), 3 (High), 4 (Urgent)
4. "responsibleAuthority" — the most appropriate civic body, e.g., "Municipal Corporation - Roads Dept", "Water Board", "Electricity Board (BSES/NDMC)", "PWD", "Police", "Municipal Corporation - Sanitation", "Animal Control"
5. "draftedComplaint" — a formal, respectful complaint paragraph (3-5 sentences) addressed to the relevant authority. Start with "Respected Sir/Madam," and include the specific issue, location, and a request for action. Write it as if a concerned resident is writing. Keep it professional but urgent where severity warrants it.

Respond ONLY with valid JSON. No markdown, no code fences.`;

const DUPLICATE_SYSTEM_PROMPT = `You are a duplicate detection engine for a civic issue reporting platform.

You will receive:
- A NEW report (description + locality)
- A list of EXISTING reports (id, description, locality, category)

Your job: determine if the new report describes the SAME real-world issue as any existing report.

Consider two reports as duplicates if:
- They describe the same type of problem (e.g., both about a pothole, both about garbage)
- They are in the same or very nearby locality (e.g., "Sector 12 market" and "sabzi mandi Sector 12" are the same)
- The specific issue is likely the same physical problem (not just same category in same area)

Be smart about language variations: Hindi/English mixing, slang ("gaddha" = pothole, "bijli" = electricity, "kachra" = garbage, "nala" = drain, "sadak" = road), and different ways of describing the same location.

Return a JSON object:
{
  "isDuplicate": boolean,
  "matchedReportId": string or null (the id of the matched report if duplicate),
  "confidence": number (0.0 to 1.0),
  "reason": string (brief explanation of why it's a match or not)
}

If confidence < 0.7, set isDuplicate to false.
Respond ONLY with valid JSON. No markdown, no code fences.`;

/**
 * Triage a new civic report using Gemini
 */
export async function triageReport(description, locality) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Report Description: ${description}\nLocality: ${locality}`,
      config: {
        systemInstruction: TRIAGE_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini triage error:", error);
    throw new Error("Failed to process report with AI. Please try again.");
  }
}

/**
 * Check if a new report duplicates an existing one
 */
export async function detectDuplicate(newDescription, newLocality, newCategory, existingReports) {
  // Filter to same category and only open reports
  const candidates = existingReports.filter(
    (r) => r.category === newCategory && r.status === "open"
  );

  if (candidates.length === 0) {
    return { isDuplicate: false, matchedReportId: null, confidence: 0, reason: "No existing reports in this category" };
  }

  const existingList = candidates
    .map(
      (r) =>
        `- ID: ${r.id} | Description: "${r.description}" | Locality: "${r.locality}" | Category: ${r.category}`
    )
    .join("\n");

  const prompt = `NEW REPORT:
Description: "${newDescription}"
Locality: "${newLocality}"
Category: ${newCategory}

EXISTING OPEN REPORTS:
${existingList}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: DUPLICATE_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini duplicate detection error:", error);
    // Fail open — don't block report creation if duplicate detection fails
    return { isDuplicate: false, matchedReportId: null, confidence: 0, reason: "Detection failed" };
  }
}
