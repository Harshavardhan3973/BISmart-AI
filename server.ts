import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Fallback curated knowledge base answers if no API key is set or during high demand
const KNOWLEDGE_FALLBACKS: Record<string, { answer: string; standard: string; scheme: string; portal: string; steps: string }> = {
  led: {
    answer: "For LED bulbs and self-ballasted LED lamps for general lighting services, the mandatory Indian Standard is **IS 16102 (Part 1): Safety Requirements** and **IS 16102 (Part 2): Performance Requirements**. LED drivers are covered under **IS 15885 (Part 2/Sec 13)**.\n\nUnder the Ministry of Electronics and Information Technology (MeitY) and BIS Compulsory Registration Scheme (CRS), domestic manufacturers and importers cannot sell LED bulbs in India without valid BIS registration and display of the Standard Mark.",
    standard: "IS 16102 (Part 1 & 2) & IS 15885 (Part 2/Sec 13)",
    scheme: "Scheme-II: Compulsory Registration Scheme (CRS)",
    portal: "manakonline.in > Compulsory Registration Scheme (CRS)",
    steps: "1. Sample testing at a BIS-recognized laboratory.\n2. Submit test report and Form VI on the Manakonline portal within 90 days.\n3. Undertake manufacturer declaration of conformity.\n4. Grant of Registration number (R-XXXXXXXX) and label marking."
  },
  certification: {
    answer: "To obtain BIS product certification (ISI Mark under Scheme-I of BIS Conformity Assessment Regulations):\n\n1. **Identify Applicable Standard**: Verify if your product is under voluntary or mandatory Quality Control Orders (QCOs).\n2. **Application Submission**: Register on e-BIS (manakonline.in) and submit Form-1 along with manufacturing setup details, machinery list, test equipment, and raw material specs.\n3. **Factory Audit**: A BIS inspecting officer conducts an on-site evaluation of the manufacturing unit, quality control processes, and tests independent samples in the factory lab.\n4. **Independent Lab Testing**: Product samples drawn during the audit are sent to a BIS or NABL-accredited recognized laboratory.\n5. **Grant of License (CML)**: Upon satisfactory test results and payment of marking fees, BIS grants the Certificate of Manufacturing License (CML).",
    standard: "IS Standards relevant to product (Scheme-I)",
    scheme: "Scheme-I (Product Certification / ISI Mark)",
    portal: "e-BIS / manakonline.in > Product Certification",
    steps: "MSMEs and Startups receive a 20% to 50% concession on minimum marking fees. Follow the Simplified Procedure for faster grant in under 30 days."
  },
  hallmarking: {
    answer: "Hallmarking in India is the accurate determination and official recording of the proportionate content of precious metal (Gold & Silver). Mandatory hallmarking of gold jewellery has been enforced by the Ministry of Consumer Affairs across designated districts.\n\nEvery authentic hallmarked gold article bears three marks:\n1. **BIS Standard Mark** (the triangle logo)\n2. **Purity in Karat and Fineness** (e.g., 22K916 for 22 karat, 18K750 for 18 karat, 14K585 for 14 karat)\n3. **6-digit alphanumeric HUID (Hallmark Unique Identification)** — each piece of jewellery has a unique tracking code assigned by an Assaying and Hallmarking Centre (AHC).\n\nJewellers must register online at manakonline.in (automatic grant of registration without inspection fees for small jewelers in designated areas). Consumers can instantly verify any HUID code via the official **BIS Care App** under 'Verify HUID'.",
    standard: "IS 1417 (Gold & Gold Alloys) & IS 2112 (Silver)",
    scheme: "Hallmarking Scheme under Section 14 & 15 of BIS Act, 2016",
    portal: "manakonline.in > Hallmarking Online Portal & BIS Care App",
    steps: "Apply via portal > Zero inspection fee for online registration > Submit pieces to recognized AHC > Receive laser-marked HUID items."
  },
  water: {
    answer: "Packaged Drinking Water (other than natural mineral water) is governed by mandatory standard **IS 14543**, while Packaged Natural Mineral Water is governed by **IS 13428**.\n\nBoth products fall strictly under the **Mandatory ISI Certification Scheme**. No manufacturer is legally permitted to produce, pack, or market packaged drinking water in India without an active BIS License (CML Number) and Food Safety and Standards Authority of India (FSSAI) clearance.\n\nThe manufacturing unit must have an in-house microbiological and chemical testing laboratory with qualified chemists, automated bottling systems, and regular surveillance audits.",
    standard: "IS 14543 (Packaged Drinking Water) / IS 13428 (Mineral Water)",
    scheme: "Scheme-I (Mandatory ISI Mark Certification)",
    portal: "e-BIS Portal (manakonline.in) > Category: Food & Agriculture",
    steps: "Setup in-house lab > Apply on e-BIS > Preliminary factory inspection & sample drawing > Lab testing > Grant of License (CML)."
  },
  msme: {
    answer: "The Bureau of Indian Standards offers substantial benefits and fee concessions to promote the 'Make in India' and Atmanirbhar Bharat initiatives for Micro, Small, and Medium Enterprises (MSMEs):\n\n- **Micro Enterprises**: Enjoy up to **50% concession** on minimum marking fees and application fees for ISI mark certification.\n- **Small Enterprises**: Enjoy **20% concession** on marking fees.\n- **Startups & Women Entrepreneurs**: Special financial rebates and fast-track processing are provided under e-BIS.\n- **Simplified Procedure**: For products with established test facilities, licenses can be granted within 30 days based on in-house test reports and verification.\n- **Free Indian Standards for Students & Institutions**: Academic institutions and standards clubs have digital access to Indian Standards via the BIS portal.",
    standard: "BIS Conformity Assessment Regulations (Concessions Schedule)",
    scheme: "MSME Special Support Initiative (Scheme-I & Scheme-II)",
    portal: "e-BIS / manakonline.in > Concessions & Subsidies",
    steps: "Submit valid Udyam Registration Certificate along with application to claim automated fee discounts."
  },
  toys: {
    answer: "Safety of Toys in India is governed by the mandatory Toys (Quality Control) Order. Under this order, toys cannot be manufactured, imported, distributed, or sold without the **ISI Mark**.\n\nKey applicable standards include:\n- **IS 9873 (Part 1)**: Mechanical and Physical Properties\n- **IS 9873 (Part 2)**: Flammability\n- **IS 9873 (Part 3)**: Migration of Certain Elements (Toxic Metals)\n- **IS 9873 (Part 4, 7, 9)**: Phthalates and organic chemical compounds\n- **IS 15644**: Electric Toys Safety\n\nForeign and domestic toy manufacturers must obtain a Scheme-I license following factory audit and testing.",
    standard: "IS 9873 (Parts 1-9) & IS 15644",
    scheme: "Scheme-I (Mandatory ISI Mark)",
    portal: "manakonline.in > Product Certification",
    steps: "Audit of factory quality controls > Testing for mechanical sharp edges & chemical toxicity > Grant of CML license."
  },
  helmet: {
    answer: "Protective helmets for two-wheeler riders are mandated under **IS 4151** and the Central Motor Vehicles Rules (CMVR). Selling non-ISI marked helmets in India is a punishable criminal offense under the BIS Act, 2016.\n\nTesting parameters under IS 4151:\n- Impact absorption test across temperature extremes\n- Retention system dynamic test and chin strap strength\n- Rigidity and penetration resistance\n- Field of vision and visor optical clarity (IS 9944)\n\nAll manufacturers must maintain on-site impact testing rigs.",
    standard: "IS 4151:2015 (Protective Helmets for Two-Wheeler Riders)",
    scheme: "Scheme-I (Mandatory ISI Mark Certification)",
    portal: "e-BIS Portal (manakonline.in) > Transport Engineering",
    steps: "In-house impact testing rig required > BIS factory audit > Lab test clearance > CML grant."
  },
  solar: {
    answer: "Solar photovoltaic (PV) modules, inverters, and storage batteries are governed by Ministry of New and Renewable Energy (MNRE) Quality Control Orders under the **Compulsory Registration Scheme (CRS)**:\n- **IS 14286**: Crystalline Silicon Terrestrial Photovoltaic (PV) Modules\n- **IS/IEC 61730 (Part 1 & 2)**: Photovoltaic Module Safety Qualification\n- **IS 16221 & IS 16169**: Solar Inverters (Utility Interconnected)\n\nModules must be tested at BIS-approved test labs (such as NISE, SECI, UL, or TUV) before registration.",
    standard: "IS 14286 & IS/IEC 61730 (Parts 1 & 2)",
    scheme: "Scheme-II: Compulsory Registration Scheme (CRS)",
    portal: "manakonline.in > CRS Portal",
    steps: "Lab testing at BIS-approved PV testing center > Online CRS application > Self-declaration of conformity."
  },
  complaint: {
    answer: "If you encounter fake ISI marks, non-compliant gold hallmarking, or sub-standard goods, you can lodge a formal grievance through official BIS channels:\n\n1. **BIS Care Mobile App**: Download on Android or iOS. Navigate to 'File Complaint' to upload photos of the spurious product, bill, and vendor location.\n2. **e-BIS Grievance Portal**: Visit bis.gov.in > Consumer Affairs > Public Grievance Portal.\n3. **National Consumer Helpline (NCH)**: Call toll-free 1915 or send SMS.\n4. **Enforcement Raids**: BIS regularly executes search and seizure operations against counterfeiters under Sections 17 & 29 of the BIS Act, 2016.",
    standard: "BIS Act, 2016 (Consumer Redressal & Enforcement Provisions)",
    scheme: "Consumer Affairs & Enforcement Department",
    portal: "BIS Care App & bis.gov.in > Public Grievance",
    steps: "File complaint via BIS Care App > Receive grievance tracking token > BIS enforcement inspection initiated."
  }
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "BISmart AI Server",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    });
  });

  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, language = "en" } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const isConfigured = apiKey && apiKey !== "MY_GEMINI_API_KEY";

      // If no valid API key is present, use our extensive curated knowledge engine
      if (!isConfigured) {
        const lower = message.toLowerCase();
        let matched = null;

        if (lower.includes("led") || lower.includes("bulb") || lower.includes("light")) {
          matched = KNOWLEDGE_FALLBACKS.led;
        } else if (lower.includes("certif") || lower.includes("apply") || lower.includes("license") || lower.includes("process") || lower.includes("how do i get")) {
          matched = KNOWLEDGE_FALLBACKS.certification;
        } else if (lower.includes("gold") || lower.includes("hallmark") || lower.includes("huid") || lower.includes("jewel")) {
          matched = KNOWLEDGE_FALLBACKS.hallmarking;
        } else if (lower.includes("water") || lower.includes("bottle") || lower.includes("drink")) {
          matched = KNOWLEDGE_FALLBACKS.water;
        } else if (lower.includes("msme") || lower.includes("startup") || lower.includes("discount") || lower.includes("women") || lower.includes("fee") || lower.includes("concession")) {
          matched = KNOWLEDGE_FALLBACKS.msme;
        }

        if (matched) {
          const responseText = `${matched.answer}\n\n### Sources & Next Steps\n- **Applicable Indian Standard(s):** ${matched.standard}\n- **Certification Scheme:** ${matched.scheme}\n- **Official Portal / Form:** ${matched.portal}\n- **Procedural Guidance:** ${matched.steps}\n- **Official Verification:** Please verify on the official BIS portal at [bis.gov.in](https://www.bis.gov.in) and [manakonline.in](https://www.manakonline.in).`;
          return res.json({
            text: responseText,
            sources: {
              standard: matched.standard,
              scheme: matched.scheme,
              portal: matched.portal,
            },
            isDemoMode: true,
          });
        }

        // Generic domain answer if not a direct keyword match
        const responseText = `Thank you for consulting **BISmart AI**. Regarding your query on "${message}":\n\nThe Bureau of Indian Standards operates multiple schemes including **Scheme-I (ISI Mark)** for general industrial and domestic manufacturing, **Scheme-II (CRS)** for electronic/IT goods, and **Hallmarking** for precious metals.\n\nTo determine the exact Indian Standard:\n1. Search the **Know Your Standards** catalog at **manakonline.in** using your product Harmonized System (HS) code or generic trade description.\n2. Check whether your product is notified under a mandatory **Quality Control Order (QCO)** issued by line ministries (e.g. DPIIT, Ministry of Heavy Industries, MeitY).\n3. If covered under a QCO, manufacturing or importing without a valid BIS license is a cognizable legal violation under the BIS Act, 2016.\n\n### Sources & Next Steps\n- **Applicable Indian Standard(s):** Searchable via BIS Product Directory / Harmonized System (HS) Mapping\n- **Certification Scheme:** Scheme-I (ISI Mark) or Scheme-II (CRS)\n- **Official Portal / Form:** e-BIS (manakonline.in) > Know Your Standards / e-Sale\n- **Verification Note:** Official specifications should always be confirmed at [bis.gov.in](https://www.bis.gov.in).`;
        return res.json({
          text: responseText,
          sources: {
            standard: "BIS Gazette Directory & Quality Control Orders",
            scheme: "Scheme-I / Scheme-II (BIS Conformity Assessment)",
            portal: "manakonline.in & bis.gov.in",
          },
          isDemoMode: true,
        });
      }

      // Gemini client initialization
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const languageInstructionMap: Record<string, string> = {
        en: "Respond in English with clear, authoritative, yet approachable tone.",
        hi: "कृपया पूरा उत्तर शुद्ध और स्पष्ट हिंदी में दें। तकनीकी मानक कोड (जैसे IS 16102, HUID, BIS Care) को मूल रूप में रखें ताकि उपयोगकर्ता उन्हें खोज सकें।",
        ta: "பதிலை தெளிவான தமிழில் வழங்கவும். தொழில்நுட்ப நிலையான குறியீடுகளை (IS 16102, HUID போன்றவை) ஆங்கிலத்திலும் வழங்கவும்.",
        bn: "দয়া করে উত্তরটি স্পষ্ট বাংলায় প্রদান করুন। প্রযুক্তিগত স্ট্যান্ডার্ড কোড (যেমন IS 16102, HUID) মূল আকারে রাখুন।",
        mr: "कृपया संपूर्ण उत्तर स्पष्ट मराठीत द्या. तांत्रिक मानक कोड (जसे की IS 16102, HUID) मूळ स्वरूपात ठेवा.",
        te: "దయచేసి స్పష్టమైన తెలుగులో సమాధానం ఇవ్వండి. సాంకేతిక ప్రామాణిక కోడ్‌లను (IS 16102, HUID వంటివి) ఆంగ్లంలో ఉంచండి.",
        kn: "ದಯವಿಟ್ಟು ಸ್ಪಷ್ಟ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ. ತಾಂತ್ರಿಕ ಗುಣಮಟ್ಟದ ಕೋಡ್‌ಗಳನ್ನು (IS 16102, HUID ನಂತಹವು) ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಇರಿಸಿ.",
        gu: "કૃપા કરીને સ્પષ્ટ ગુજરાતીમાં જવાબ આપો. ટેકનિકલ સ્ટાન્ડર્ડ કોડ્સ (જેમ કે IS 16102, HUID) મૂળ ભાષામાં રાખો."
      };

      const langRule = languageInstructionMap[language] || languageInstructionMap.en;

      const systemInstruction = `You are BISmart AI, an expert, source-grounded conversational assistant for Indian Standards and Bureau of Indian Standards (BIS) services, built for Smart India Hackathon 2026 (Problem Statement 26107, Team BISync).

MISSION & DOMAIN KNOWLEDGE:
Provide accurate, structured, plain-language guidance to MSMEs, startups, manufacturers, importers, students, and Indian consumers.
Ground your answers strictly in authentic BIS and Indian Standards frameworks:
1. Indian Standards (IS Codes, e.g. IS 16102 for LED lamps, IS 14543 for Packaged Drinking Water, IS 1417 for Gold Hallmarking, IS 456 for Concrete, IS 1786 for Steel Rebars, IS 9873 for Toy Safety, IS 13252 for Information Technology Equipment, IS 15885 for LED drivers, IS 12269 for 53 Grade Cement, etc.).
2. BIS Conformity Assessment Regulations:
   - Scheme-I (ISI Mark): Product certification with factory inspection and laboratory testing (both domestic and Foreign Manufacturers Certification Scheme - FMCS).
   - Scheme-II (CRS - Compulsory Registration Scheme): For electronics & IT goods notified by MeitY / BIS based on self-declaration and lab test reports.
   - Hallmarking Scheme: Mandatory for Gold jewellery & artefacts with 6-digit alphanumeric HUID (Hallmark Unique Identification) and AHC network.
   - Scheme-IV: Certificate of Conformity.
   - Management Systems Certification (IS/ISO 9001, IS/ISO 14001, IS/ISO 45001, IS/ISO 22000).
   - Laboratory Recognition Scheme (LRS) & National Accreditation Board for Testing and Calibration Laboratories (NABL).
3. Quality Control Orders (QCOs): Explain mandatory compliance under line ministries (DPIIT, Steel, Chemicals, MeitY) and penalties under the BIS Act, 2016.
4. MSME & Startup Support: Emphasize 20% to 50% marking fee concessions for micro & small enterprises, Simplified Procedure (grant within 30 days).
5. Consumer Tools: BIS Care Mobile App for verifying ISI mark (CML number), CRS registration (R-number), and HUID tracking; grievance redressal portal.
6. Portals: e-BIS (manakonline.in), Know Your Standards, e-Sale portal, and official bis.gov.in.

LANGUAGE REQUIREMENT:
${langRule}

FORMATTING RULE:
Provide a clear, readable explanation using markdown headings, bullet points, and numbered steps.
At the very bottom of EVERY answer, you MUST append a distinct section formatted exactly as:

### Sources & Next Steps
- **Applicable Indian Standard(s):** [Specific IS Code & Standard Title]
- **Certification Scheme:** [e.g., Scheme-I (ISI Mark) / Scheme-II (CRS) / Hallmarking Scheme / Management Systems]
- **Official Portal / Form:** [e.g., manakonline.in (e-BIS) > Product Certification Form-1 / BIS Care App]
- **Key Action:** [Immediate practical next step for the applicant or citizen]
- **Official Verification Note:** Verified against BIS gazetted frameworks. Consult [bis.gov.in](https://www.bis.gov.in) and [manakonline.in](https://www.manakonline.in) for latest Gazette updates.`;

      // Build conversation contents
      let contents: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        // Keep last 6 turns for context
        const trimmedHistory = history.slice(-6);
        for (const item of trimmedHistory) {
          if (item.role === "user" || item.role === "assistant") {
            contents.push({
              role: item.role === "assistant" ? "model" : "user",
              parts: [{ text: item.content }],
            });
          }
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      let responseText = "";
      const CANDIDATE_MODELS = [
        "gemini-3.8-flash",
        "gemini-flash-latest"
      ];

      for (const modelName of CANDIDATE_MODELS) {
        try {
          // Responsive timeout of 3.5s to prevent long user waiting during upstream API demand spikes
          const generatePromise = ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.3,
            },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 3500)
          );

          const response = await Promise.race([generatePromise, timeoutPromise]);
          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch {
          // If a model encounters a 503 high demand spike or timeout, swiftly continue
          continue;
        }
      }

      // If all candidate models were unavailable or in high demand, serve instant domain knowledge fallback
      if (!responseText) {
        // Intelligent domain knowledge lookup
        const lower = message.toLowerCase();
        let matched = null;
        if (lower.includes("led") || lower.includes("bulb") || lower.includes("light")) {
          matched = KNOWLEDGE_FALLBACKS.led;
        } else if (lower.includes("certif") || lower.includes("apply") || lower.includes("license") || lower.includes("process") || lower.includes("how do i get")) {
          matched = KNOWLEDGE_FALLBACKS.certification;
        } else if (lower.includes("gold") || lower.includes("hallmark") || lower.includes("huid") || lower.includes("jewel")) {
          matched = KNOWLEDGE_FALLBACKS.hallmarking;
        } else if (lower.includes("water") || lower.includes("bottle") || lower.includes("drink")) {
          matched = KNOWLEDGE_FALLBACKS.water;
        } else if (lower.includes("msme") || lower.includes("startup") || lower.includes("discount") || lower.includes("women") || lower.includes("fee") || lower.includes("concession")) {
          matched = KNOWLEDGE_FALLBACKS.msme;
        } else if (lower.includes("toy") || lower.includes("game") || lower.includes("child")) {
          matched = KNOWLEDGE_FALLBACKS.toys;
        } else if (lower.includes("helmet") || lower.includes("bike") || lower.includes("rider") || lower.includes("head")) {
          matched = KNOWLEDGE_FALLBACKS.helmet;
        } else if (lower.includes("solar") || lower.includes("pv") || lower.includes("inverter")) {
          matched = KNOWLEDGE_FALLBACKS.solar;
        } else if (lower.includes("complaint") || lower.includes("fake") || lower.includes("fraud") || lower.includes("grievance") || lower.includes("care app")) {
          matched = KNOWLEDGE_FALLBACKS.complaint;
        }

        if (matched) {
          responseText = `${matched.answer}\n\n### Sources & Next Steps\n- **Applicable Indian Standard(s):** ${matched.standard}\n- **Certification Scheme:** ${matched.scheme}\n- **Official Portal / Form:** ${matched.portal}\n- **Procedural Guidance:** ${matched.steps}\n- **Official Verification:** Please verify on the official BIS portal at [bis.gov.in](https://www.bis.gov.in) and [manakonline.in](https://www.manakonline.in).`;
          return res.json({
            text: responseText,
            sources: {
              standard: matched.standard,
              scheme: matched.scheme,
              portal: matched.portal,
            },
            isDemoMode: false,
          });
        }

        responseText = `Regarding your inquiry on "${message}":\n\nThe Bureau of Indian Standards operates multiple certification paths under the **BIS Act, 2016**:\n- **Scheme-I (ISI Mark)**: Mandatory and voluntary product certification covering thousands of industrial, civil, and consumer items.\n- **Scheme-II (CRS)**: Compulsory Registration Scheme for electronics and IT equipment under MeitY notifications.\n- **Hallmarking**: Mandatory 6-digit HUID purity marking for gold and silver jewellery.\n\nTo identify the exact standard, navigate to **e-BIS (manakonline.in)** under the 'Know Your Standards' module or check the active Quality Control Orders (QCOs).\n\n### Sources & Next Steps\n- **Applicable Indian Standard(s):** Searchable via BIS Product Directory / Harmonized System (HS) Mapping\n- **Certification Scheme:** Scheme-I (ISI Mark) / Scheme-II (CRS)\n- **Official Portal / Form:** e-BIS (manakonline.in) > Product Certification\n- **Verification Note:** Official specifications should always be confirmed at [bis.gov.in](https://www.bis.gov.in).`;
        return res.json({
          text: responseText,
          sources: {
            standard: "BIS Gazette Directory & Quality Control Orders",
            scheme: "Scheme-I / Scheme-II (BIS Conformity Assessment)",
            portal: "manakonline.in & bis.gov.in",
          },
          isDemoMode: false,
        });
      }

      return res.json({
        text: responseText || "No response generated from BISmart AI.",
        isDemoMode: false,
      });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      return res.status(500).json({
        error: "Failed to generate AI response.",
        details: error?.message || "Internal server error",
      });
    }
  });

  // Check if we are running in production or Cloud Run container
  const distPath = path.join(process.cwd(), "dist");
  const hasBuiltDist = fs.existsSync(path.join(distPath, "index.html"));
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.K_SERVICE !== undefined ||
    process.argv[1]?.includes("dist") ||
    hasBuiltDist;

  if (isProduction && hasBuiltDist) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BISmart AI server running on http://0.0.0.0:${PORT} (PORT=${PORT})`);
  });
}

startServer();
