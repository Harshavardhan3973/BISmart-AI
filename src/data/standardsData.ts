import { IndianStandard } from '../types';

export const INDIAN_STANDARDS_DATA: IndianStandard[] = [
  {
    id: 'is-16102',
    code: 'IS 16102 (Part 1 & 2)',
    title: 'Self-Ballasted LED Lamps for General Lighting Services',
    category: 'Electronics',
    mandatory: true,
    qcoNotification: 'Electronics & IT Goods (Compulsory Registration Order) by MeitY',
    description: 'Mandatory standard specifying electrical safety, insulation resistance, thermal endurance, lumen output, and efficiency of LED bulbs used in domestic and commercial setups.',
    scheme: 'Scheme-II (Compulsory Registration Scheme - CRS)',
    scope: [
      'Omnidirectional self-ballasted LED lamps',
      'Operating voltages up to 250V AC 50Hz',
      'Caps: B22d, E27, and E14'
    ],
    certificationSteps: [
      'Sample Submission: Send product models to a BIS-recognized testing laboratory (e.g. NABL accredited).',
      'Test Report Evaluation: Receive test report proving compliance with IS 16102 (safety & lumen maintenance).',
      'Online Filing: Apply on Manakonline under Scheme-II (Form VI) with test report within 90 days of issue.',
      'Grant of Registration: BIS issues R-number (e.g. R-84001234) allowing printing of Standard Mark.'
    ],
    keyDocuments: [
      'Laboratory Test Report (valid within 90 days)',
      'Brand / Trademark Authorization Certificate',
      'Manufacturing unit layout & machinery list',
      'Undertaking of Conformity as per Form VI'
    ],
    msmeBenefits: 'Simplified submission timeline and preferential testing allocation for domestic MSMEs.'
  },
  {
    id: 'is-13252',
    code: 'IS 13252 (Part 1)',
    title: 'Information Technology Equipment — Safety: General Requirements',
    category: 'Electronics',
    mandatory: true,
    qcoNotification: 'MeitY Compulsory Registration Order',
    description: 'Safety standard covering personal computers, laptops, POS terminals, servers, and power adapters to prevent electric shock, excessive heating, and flammability hazards.',
    scheme: 'Scheme-II (Compulsory Registration Scheme - CRS)',
    scope: [
      'Mains-powered or battery-powered information technology equipment',
      'Data processing equipment, peripherals, and telecom terminal equipment',
      'External power adapters and chargers'
    ],
    certificationSteps: [
      'Pre-testing compliance check of component safety (cables, SMPS, plastic enclosure UL94 rating).',
      'Testing at a BIS-recognized Indian lab under IS 13252 (Part 1).',
      'Registration submission on e-BIS CRS portal.',
      'Grant of CRS registration number and mandatory labeling.'
    ],
    keyDocuments: [
      'Test Report from recognized lab',
      'Authorized Indian Representative (AIR) for foreign OEMs',
      'Factory ISO 9001 certification copy',
      'Declaration of Conformity'
    ],
    msmeBenefits: 'Fast-track document scrutiny available for DPIIT-recognized startups.'
  },
  {
    id: 'is-14543',
    code: 'IS 14543',
    title: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water)',
    category: 'Food & Water',
    mandatory: true,
    qcoNotification: 'Mandatory ISI Certification under Food Safety & Standards (Prohibition and Restriction on Sales) Regulations',
    description: 'Stringent standard defining microbiological purity, heavy metal limits, pesticide residue boundaries, and container sterilization for bottled and bulk packaged water.',
    scheme: 'Scheme-I (Mandatory ISI Mark Certification)',
    scope: [
      'Water packed in hermetically sealed food-grade containers, bottles, or pouches',
      'Treated by reverse osmosis, ozonation, UV, and micro-filtration',
      'Volumes from 200ml pouches to 20-litre reusable carboys'
    ],
    certificationSteps: [
      'Lab Setup: Establish an in-house microbiological and chemical testing facility with dedicated approved chemists.',
      'Online Application: Submit Form-1 on e-BIS portal (manakonline.in) with manufacturing layout and source water analysis.',
      'Factory Audit: BIS officer inspects plant hygiene, clean-room filling section, and draws verification samples.',
      'Independent Lab Testing: Samples tested at BIS central lab for pesticide residues and microbiological purity.',
      'Grant of License: CML (Certificate of Manufacturing License) granted.'
    ],
    keyDocuments: [
      'Source water test report from accredited lab',
      'In-house testing equipment calibration records',
      'Chemists qualification certificates (Microbiologist & Chemist)',
      'NOC from Central Ground Water Authority (CGWA)'
    ],
    msmeBenefits: '50% concession on minimum annual marking fees for Micro manufacturing units.'
  },
  {
    id: 'is-9873',
    code: 'IS 9873 (Parts 1 to 9) & IS 15644',
    title: 'Safety of Toys — Mechanical, Physical, Flammability & Chemical Safety',
    category: 'Toys',
    mandatory: true,
    qcoNotification: 'Toys (Quality Control) Order, 2020 by DPIIT',
    description: 'Comprehensive standard ensuring children toys are free of sharp edges, toxic phthalates, heavy metal contamination (lead, cadmium), and fire hazards.',
    scheme: 'Scheme-I (Mandatory ISI Mark Certification)',
    scope: [
      'Non-electric toys (plush toys, plastic puzzles, ride-on toys, dolls under IS 9873)',
      'Electric toys with battery or transformer inputs under IS 15644',
      'All toys intended for children under 14 years of age'
    ],
    certificationSteps: [
      'Categorize toy models according to age classification and physical material.',
      'Ensure in-house physical drop test, sharp edge tester, and torque-tension test devices.',
      'Apply on e-BIS (manakonline.in) under Toys Category.',
      'BIS audit of factory safety protocols and drawing of representative samples.',
      'Testing at recognized lab followed by Grant of License (ISI mark logo with CML number).'
    ],
    keyDocuments: [
      'Bill of Materials (BOM) specifying non-toxic pigments and plastics',
      'Process flow diagram and quality inspection plan',
      'In-house test equipment list & calibration certificates',
      'Udyam Registration Certificate'
    ],
    msmeBenefits: 'Special toy cluster facilitation scheme with subsidised testing fees and expedited inspection.'
  },
  {
    id: 'is-1417',
    code: 'IS 1417 & IS 2112',
    title: 'Gold and Silver Jewellery & Artefacts — Hallmarking Specifications',
    category: 'Precious Metals',
    mandatory: true,
    qcoNotification: 'Hallmarking of Gold Jewellery and Gold Artefacts Order, 2020 by DoCA',
    description: 'Establishes precise purity grades for gold (e.g., 24K999, 23K958, 22K916, 20K833, 18K750, 14K585) and silver, mandating 6-digit Hallmark Unique Identification (HUID).',
    scheme: 'BIS Hallmarking Scheme (Section 14 & 15 of BIS Act, 2016)',
    scope: [
      'All gold and silver ornaments, medallions, and retail jewellery sold by registered jewellers',
      'Applicable across all notified districts across India'
    ],
    certificationSteps: [
      'Online Jeweller Registration: Apply on manakonline.in (automatic instant grant of registration).',
      'Zero Registration Fee: Government has waived jeweller registration fees to ease compliance.',
      'Assaying at AHC: Send jewellery to a BIS-recognized Assaying and Hallmarking Centre.',
      'XRF Testing & Fire Assay: AHC tests purity, laser marks the 3 marks (BIS triangle, purity karat, 6-digit HUID).',
      'Consumer Verification: Customer verifies HUID via the BIS Care Mobile App.'
    ],
    keyDocuments: [
      'GST Registration Certificate',
      'Premises ownership / lease deed of retail outlet',
      'PAN Card of proprietor or entity',
      'Self-declaration of turnover'
    ],
    msmeBenefits: 'Exemption for artisans and small jewelers below Rs 40 lakh annual turnover.'
  },
  {
    id: 'is-456',
    code: 'IS 456:2000 & IS 1786',
    title: 'Plain & Reinforced Concrete & High Strength Deformed Steel Bars (TMT)',
    category: 'Construction',
    mandatory: true,
    qcoNotification: 'Steel and Steel Products (Quality Control) Order by Ministry of Steel',
    description: 'Defines structural design guidelines for concrete structures and mechanical/chemical specifications for thermo-mechanically treated (TMT) rebars used in national infrastructure.',
    scheme: 'Scheme-I (Mandatory ISI Mark Certification)',
    scope: [
      'Fe 415, Fe 500, Fe 550, Fe 600 grade deformed steel bars and wires',
      'Structural design standards for public works and residential buildings'
    ],
    certificationSteps: [
      'Establish steel manufacturing quality control (billet spectrometry, universal testing machine for tensile strength).',
      'Submit application on e-BIS with mill test reports.',
      'Factory visit by BIS engineers for heat-batch tracking and bending/rebend tests.',
      'Third-party sample verification at NABL laboratory.',
      'Grant of ISI mark certification with CML stamping on every running meter of rebar.'
    ],
    keyDocuments: [
      'Chemical testing lab equipment (Spectrometer)',
      'Tensile and elongation testing facility records',
      'Process flow chart from scrap/billet to rolling mill',
      'Pollution control clearance'
    ],
    msmeBenefits: 'Dedicated technical training programs by BIS National Institute of Training for Standardization (NITS).'
  },
  {
    id: 'is-15748',
    code: 'IS 15748 & IS 17349',
    title: 'Protective Clothing for Industrial Workers & Technical Geotextiles',
    category: 'Textiles',
    mandatory: true,
    qcoNotification: 'Technical Textiles (Quality Control) Order by Ministry of Textiles',
    description: 'Specifies flame resistance, tensile tear resistance, electrostatic dissipation, and durability for high-risk industrial safety apparel and geotextiles used in roads.',
    scheme: 'Scheme-I (ISI Mark Certification)',
    scope: [
      'Fire-retardant coveralls and boiler suits',
      'Non-woven geotextile membranes for highway stabilization',
      'Agrotextiles and medical protective textiles'
    ],
    certificationSteps: [
      'Raw material testing (yarn tenacity, fiber composition).',
      'Factory inspection by BIS textile experts.',
      'Hydrostatic head test, flame spread test, and burst strength verification.',
      'Grant of license and ongoing batch surveillance.'
    ],
    keyDocuments: [
      'Spinning and weaving production records',
      'Dyeing and fire-retardant chemical treatment certifications',
      'In-house textile physical testing lab setup',
      'Udyam MSME certification'
    ],
    msmeBenefits: '20% to 50% rebate on marking fees for handloom/textile MSMEs.'
  },
  {
    id: 'is-1070',
    code: 'IS 1070 & IS 252',
    title: 'Water for Analytical Laboratories & Caustic Soda (Chemical Quality)',
    category: 'Chemicals',
    mandatory: true,
    qcoNotification: 'Caustic Soda (Quality Control) Order by Dept of Chemicals & Petrochemicals',
    description: 'Ensures high chemical purity, limits of toxic contaminants like mercury/chlorides, and safety handling standards for vital industrial chemicals.',
    scheme: 'Scheme-I (Mandatory ISI Mark Certification)',
    scope: [
      'Caustic soda lye and flakes for soap, paper, and textile manufacturing',
      'Reagent grade pure water for pharmaceutical and diagnostic testing'
    ],
    certificationSteps: [
      'In-plant titration, spectrometry, and purity verification equipment setup.',
      'Safety and environmental compliance review by BIS inspecting officer.',
      'Drawing of sealed sample containers for government lab validation.',
      'Grant of CML license with strict packaging and hazard label specifications.'
    ],
    keyDocuments: [
      'State Pollution Control Board Consent to Operate (CTO)',
      'Factory hazard safety plan',
      'Chemical assay report',
      'Batch traceability logs'
    ],
    msmeBenefits: 'Concessions on testing fees through BIS Central Laboratories network.'
  },
  {
    id: 'is-14286',
    code: 'IS 14286 / IS/IEC 61215',
    title: 'Crystalline Silicon Terrestrial Photovoltaic (PV) Modules',
    category: 'Renewable Energy',
    mandatory: true,
    qcoNotification: 'Solar Photovoltaics, Systems, Devices and Components Goods (Requirements for Compulsory Registration) Order by MNRE',
    description: 'Guarantees durability, electrical safety, UV resistance, and minimum 25-year degradation standards for solar solar panels installed across India.',
    scheme: 'Scheme-II (Compulsory Registration Scheme - CRS)',
    scope: [
      'Mono-crystalline and Poly-crystalline silicon PV modules',
      'Solar panels for rooftop and utility-scale solar farms'
    ],
    certificationSteps: [
      'Environmental chamber testing (damp heat, thermal cycling, hail impact) at accredited solar test centres.',
      'Online application on Manakonline CRS portal.',
      'Review of Bill of Materials and manufacturing cell quality.',
      'Grant of CRS registration number (R-number) for display on solar module label.'
    ],
    keyDocuments: [
      'Comprehensive type test report under IS 14286 & IS/IEC 61730',
      'Factory quality audit certificate (ISO 9001)',
      'Cell manufacturer BOM and warranty declaration',
      'ALMM (Approved List of Models and Manufacturers) alignment declaration'
    ],
    msmeBenefits: 'Eligible for Government renewable energy subsidies and priority procurement.'
  }
];

export const PIPELINE_STEPS = [
  {
    id: 1,
    title: 'User Query',
    subtitle: 'Plain-Language Input',
    iconName: 'MessageSquareText',
    description: 'Citizens, MSMEs, or students enter queries in plain natural language (voice or text in 8+ Indian languages), e.g., "What standard applies to LED bulbs?"',
    techDetails: 'Speech-to-text transcription + language detection and tokenization.'
  },
  {
    id: 2,
    title: 'NLP & Intent Detection',
    subtitle: 'Context Extraction',
    iconName: 'Cpu',
    description: 'Identifies product domain, legal intent (certification vs verification vs consumer grievance), and relevant conformity schemes (Scheme-I, CRS, Hallmarking).',
    techDetails: 'Entity extraction (Product Name, IS codes, QCO category, Harmonized System codes).'
  },
  {
    id: 3,
    title: 'RAG & Semantic Search',
    subtitle: 'Vector Retrieval',
    iconName: 'Search',
    description: 'Searches vector embeddings of 22,000+ Indian Standards, gazette notifications, Quality Control Orders, and e-BIS manuals.',
    techDetails: 'Hybrid vector search + BM25 keyword matching against structured BIS knowledge graphs.'
  },
  {
    id: 4,
    title: 'BIS Knowledge Base',
    subtitle: 'Curated Grounding',
    iconName: 'Database',
    description: 'Retrieves authentic regulatory clauses, step-by-step checklists, testing parameters, fee concessions, and portal workflows.',
    techDetails: 'Strict domain boundaries prevent hallucination; verified against bis.gov.in & manakonline.in.'
  },
  {
    id: 5,
    title: 'LLM Synthesis',
    subtitle: 'Gemini Generative Engine',
    iconName: 'Sparkles',
    description: 'Gemini 3.8 Flash synthesizes the retrieved context into a clear, jargon-free, structured answer tailored to the requested Indian language.',
    techDetails: 'Server-side API proxying with strict system instructions and zero-leakage security.'
  },
  {
    id: 6,
    title: 'Cited Answer & Guidance',
    subtitle: 'Audited Output',
    iconName: 'ShieldCheck',
    description: 'Delivers the complete answer accompanied by an official "Sources & Next Steps" box specifying the exact IS code, scheme, and e-BIS portal actions.',
    techDetails: 'Transparent provenance trail allowing immediate verification on BIS portals.'
  }
];

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' }
];

export const STARTER_QUESTIONS = [
  "What standard applies to LED bulbs?",
  "How do I get BIS certification for my product?",
  "What is hallmarking and how do I apply?",
  "Which standard applies to packaged drinking water?",
  "What are the fee concessions for MSMEs and Women Entrepreneurs?",
  "What is the difference between ISI Mark and CRS Registration?"
];
