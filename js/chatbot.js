
window.FurEverAI = {
  isOpen: false,
  isTyping: false,
  isSpeaking: false,
  isListening: false,
  apiKey: localStorage.getItem('furever_ai_key') || '',
  apiEndpoint: localStorage.getItem('furever_ai_endpoint') || '',
  chatHistory: JSON.parse(localStorage.getItem('furever_chat_history') || '[]'),
  recognition: null,

  
  
  
  encyclopedia: {
    
    dog: {
      diseases: [
        {
          keys: ['parvo', 'bloody stool', 'bloody diarrhea', 'bloody vomit', 'parvovirus', 'dast me khoon', 'kutta ulti khoon'],
          title: 'Canine Parvovirus (Parvo) • High Urgency',
          severity: 'CRITICAL EMERGENCY (High Contagion)',
          overview: 'Acute life-threatening viral enteritis destroying rapidly dividing intestinal crypt cells and bone marrow in unvaccinated puppies (6 weeks to 6 months).',
          symptoms: 'Projectile vomiting, foul-smelling hemorrhagic (bloody) diarrhea, subnormal temperature or high fever, severe dehydration, rapid weight loss, complete anorexia.',
          protocol: '1. Immediate IV Fluid Resuscitation (Lactated Ringer\'s solution with Potassium Chloride and 2.5-5% Dextrose).\n2. Antiemetic: Cerenia (Maropitant) 1 mg/kg SC/IV once daily or Ondansetron 0.5 mg/kg IV q8h.\n3. Broad-Spectrum IV Antibiotics (Ampicillin 22 mg/kg IV q8h + Enrofloxacin 5-10 mg/kg IV q24h if > 6 mos, or Cefazolin/Amikacin) to prevent bacterial sepsis across damaged gut barrier.\n4. Gastroprotectants: Famotidine (0.5 mg/kg) or Pantoprazole (1 mg/kg IV).\n5. Plasma/Albumin Transfusion if total protein drops < 4.0 g/dL.\n6. Early Micro-Enteral Nutrition (Royal Canin Recovery / Hills a/d) via nasogastric tube once vomiting stabilizes.',
          homeCare: 'Strict isolation for 21 days. Disinfect environment with 1:30 diluted sodium hypochlorite (household bleach). Oral fluids are contraindicated while actively vomiting.',
          warning: '🚨 Parvo mortality exceeds 90% without intensive fluid therapy. Seek emergency hospital admission immediately!'
        },
        {
          keys: ['distemper', 'canine distemper', 'eye discharge yellow', 'hard pad', 'dog twitching', 'seizures dog', 'cdv'],
          title: 'Canine Distemper Virus (CDV)',
          severity: 'SEVERE / SYSTEMIC',
          overview: 'Highly contagious paramyxovirus targeting respiratory, gastrointestinal, and central nervous systems.',
          symptoms: 'Biphasic fever, thick mucopurulent yellow eye/nasal discharge, persistent coughing, hardened footpads/nose ("hard pad disease"), involuntary muscle spasms (chewing gum fits / myoclonus), seizures, ataxia.',
          protocol: '1. Supportive ICU Care & Secondary Infection Control: Broad-spectrum antibiotics (Doxycycline or Clavamox).\n2. Neuroprotective Therapy: Anticonvulsants (Levetiracetam / Keppra 20 mg/kg q8h or Phenobarbital).\n3. Vitamin Therapy: High-dose Vitamin A, B-Complex (Neurobion) injections.\n4. Nebulization therapy with saline and mucolytics for pneumonia.',
          warning: '⚠️ 100% preventable via DHPP vaccination series starting at 6-8 weeks.'
        },
        {
          keys: ['tick fever', 'anaplasma', 'ehrlichia', 'babesia', 'tick', 'pale gums', 'nose bleed', 'low platelets'],
          title: 'Tick-Borne Disease (Tick Fever / Ehrlichiosis / Babesiosis)',
          severity: 'HIGH / BLOOD PARASITE',
          overview: 'Vector-borne intracellular pathogens transmitted by Rhipicephalus sanguineus (Brown Dog Tick) causing severe thrombocytopenia and bone marrow suppression.',
          symptoms: 'Spiking recurring fever, profound lethargy, petechiae (pinpoint red spots on belly), nosebleeds (epistaxis), pale gums (severe anemia), swollen lymph nodes, joint lameness.',
          protocol: '1. Diagnostic: Complete Blood Count (CBC) to monitor platelet count + 4Dx Plus / PCR.\n2. Targeted Antimicrobial: Doxycycline 10 mg/kg orally ONCE daily (or 5 mg/kg twice daily) given with a full meal for 28 CONSECUTIVE DAYS.\n3. For Babesia species: Imidocarb Dipropionate (6.6 mg/kg IM, 2 doses 14 days apart).\n4. Platelet & RBC Support: Carica Papaya leaf extract, Iron supplements (Ferocline), Vitamin C.\n5. Severe Thrombocytopenia: Short tapering course of Prednisolone (1-2 mg/kg/day).',
          warning: '⚠️ NEVER stop Doxycycline before 28 days even if symptoms resolve. Always administer with food to avoid esophageal stricture.'
        },
        {
          keys: ['bloat', 'gdv', 'swollen stomach', 'dry heaving', 'distended abdomen', 'pait phool gaya', 'twisted stomach'],
          title: 'Gastric Dilatation-Volvulus (GDV / Bloat) • CRITICAL EMERGENCY',
          severity: 'FATAL SURGICAL EMERGENCY (2-4 Hour Window)',
          overview: 'The stomach rapidly fills with gas/foam and twists 180°-360° on its mesenteric axis, occluding portal vein and caudal vena cava.',
          symptoms: 'Non-productive retching/dry heaving, distended hard barrel abdomen (drum-like sound when tapped), extreme pacing, drooling, white pale gums, collapse.',
          protocol: '1. Emergency Decompression: Trocharization with 14G over-the-needle catheter or gentle orogastric tube.\n2. Aggressive Shock Fluid Therapy via two large-bore front-leg IV catheters.\n3. Emergency Exploratory Laparotomy: Derotation of stomach, splenectomy if splenic infarction, and permanent Gastropexy.',
          warning: '🚨 GDV is fatal within hours. Do not wait. Rush to surgical emergency trauma center immediately!'
        },
        {
          keys: ['kennel cough', 'honking cough', 'dog cough', 'kutta khans raha', 'tracheobronchitis', 'dog hacking'],
          title: 'Canine Infectious Respiratory Disease (Kennel Cough)',
          severity: 'MODERATE / CONTAGIOUS',
          overview: 'Airborne infection caused by Bordetella bronchiseptica, Parainfluenza, and Canine Adenovirus-2.',
          symptoms: 'Sudden onset of loud dry hacking "goose-honk" cough, gagging up white foamy phlegm, sneezing, eye discharge.',
          protocol: '1. Doxycycline 10 mg/kg q24h or Clavamox 13.75 mg/kg q12h for 10-14 days.\n2. Cough Suppressant: Dextromethorphan (0.5-1 mg/kg) or Butorphanol under prescription.\n3. Steam Vaporization: 15 minutes in humid bathroom twice daily.\n4. Walk strictly on chest harness (no neck collars to prevent tracheal irritation).',
          warning: '⚠️ Avoid dog parks and groomers until 7 days after coughing stops.'
        }
      ]
    },

    
    cat: {
      diseases: [
        {
          keys: ['urinary blockage', 'flutd', 'straining litter', 'cat cannot pee', 'yowling in litter', 'peshab band', 'feline cystitis'],
          title: 'Feline Lower Urinary Tract Obstruction (FLUTD) • CRITICAL EMERGENCY',
          severity: 'FATAL EMERGENCY (24-48 Hour Window)',
          overview: 'Urethral obstruction in male cats due to struvite/calcium oxalate crystals, mucus plugs, or idiopathic urethral spasm.',
          symptoms: 'Frequent unproductive trips to litter box, crying/screaming in pain while squatting, passing drops of blood, licking prepuce constantly, firm painful golf-ball sized bladder.',
          protocol: '1. Emergency De-obstruction under sedation using sterile 3.5Fr Tomcat catheter.\n2. Baseline Electrolytes (Immediate check for life-threatening Hyperkalemia: K > 7.0 mmol/L requires 10% Calcium Gluconate IV).\n3. Closed indwelling urinary catheter system for 48-72 hours with IV crystalloid diuresis.\n4. Urethral smooth muscle relaxant: Prazosin 0.5 mg/cat orally q8-12h or Phenoxybenzamine.\n5. Pain Management: Buprenorphine 0.01-0.02 mg/kg sublingual or Robenacoxib.\n6. Lifetime Transition: 100% wet prescription urinary diet (Hill\'s c/d, Royal Canin Urinary SO).',
          warning: '🚨 Untreated blockage causes fatal cardiac arrest from hyperkalemia within 24-48 hours. Seek emergency vet immediately!'
        },
        {
          keys: ['cat kidney', 'ckd', 'renal failure', 'excessive drinking cat', 'cat vomiting water', 'gurde', 'feline ckd'],
          title: 'Feline Chronic Kidney Disease (CKD)',
          severity: 'CHRONIC PROGRESSIVE',
          overview: 'Loss of functional nephron architecture leading to azotemia, hyperphosphatemia, and uremic toxin buildup in senior cats.',
          symptoms: 'Polydipsia (drinking excessive water), polyuria (flooded litter box), weight loss, muscle wasting, bad uremic breath, poor unkempt coat, vomiting clear liquid.',
          protocol: '1. Low Phosphorus, controlled high-BV protein renal prescription diet (Royal Canin Renal, Hill\'s k/d).\n2. Subcutaneous Fluid Therapy: 50-100 mL Lactated Ringer\'s SC 2-3x weekly.\n3. Proteinuria & Blood Pressure Management: Telmisartan (Semintra) 1 mg/kg orally q24h or Amlodipine for hypertension.\n4. Enteral Phosphate Binders: Aluminum Hydroxide or Lanthanum Carbonate mixed with meals.\n5. Potassium Gluconate supplementation for hypokalemia.',
          homeCare: 'Provide multiple circulating water fountains. Never restrict water.'
        },
        {
          keys: ['fip', 'feline infectious peritonitis', 'fluid in cat belly', 'gs441524', 'cat wet fip', 'cat dry fip'],
          title: 'Feline Infectious Peritonitis (FIP)',
          severity: 'SEVERE / SYSTEMIC IMMUNE',
          overview: 'Immune-mediated vasculitis caused by mutated Feline Coronavirus (FCoV). Exists in Effusive (Wet) and Non-effusive (Dry/Neurological) forms.',
          symptoms: 'Wet FIP: Rapid fluid buildup in abdomen (pot-belly) or thorax (dyspnea). Dry FIP: Fluctuating antibiotic-unresponsive fever, weight loss, jaundice, uveitis (cloudy eyes), neurological tremors.',
          protocol: '1. Antiviral Therapy: GS-441524 at 5-15 mg/kg SC or orally once daily for 84 CONSECUTIVE DAYS (higher dosages for ocular/neurological involvement).\n2. Alternative: Molnupiravir (EIDD-2801).\n3. Supportive: Cobalamin (Vitamin B12 250 mcg SC weekly), Liver hepatoprotectants (SAMe / Silymarin).\n4. Therapeutic abdominocentesis/thoracocentesis only if breathing is compromised.',
          warning: '⚠️ Early antiviral therapy achieves > 90% cure rates. Consult veterinary FIP specialist immediately.'
        },
        {
          keys: ['cat flu', 'sneezing cat', 'eye discharge cat', 'feline herpes', 'calicivirus', 'billi ko zukam'],
          title: 'Feline Upper Respiratory Tract Complex (Cat Flu)',
          severity: 'HIGH CONTAGION',
          overview: 'Primary infection by Feline Herpesvirus-1 (FHV-1) and/or Feline Calicivirus (FCV).',
          symptoms: 'Severe sneezing, bilateral purulent eye discharge, conjunctivitis, crusty nose, painful tongue/palate ulcers, fever, complete loss of appetite.',
          protocol: '1. L-Lysine 250-500 mg orally twice daily to suppress viral replication.\n2. Antibiotic for secondary bacteria: Doxycycline (10 mg/kg q24h) or Azithromycin (5-10 mg/kg q24h).\n3. Ophthalmic: Terramycin ointment or Cidofovir 0.5% drops for corneal ulcers (NEVER use steroid eye drops with ulcers).\n4. Aromatic feeding: Warm wet food (sardines, fish oil) to stimulate olfactory sense.\n5. Bathroom steam inhalation 15 minutes twice daily.',
          warning: '⚠️ Cats that cannot smell food will stop eating entirely, risking fatal Hepatic Lipidosis within 48 hours.'
        }
      ]
    },

    
    bird: {
      diseases: [
        {
          keys: ['parrot', 'bird', 'budgie', 'cockatiel', 'feather plucking', 'bird sneezing', 'tota', 'chiriya', 'macaw', 'egg bound', 'psittacosis'],
          title: 'Avian Clinical Care, Nutrition & Emergency Protocols',
          severity: 'HIGH SPECIALTY',
          overview: 'Avian species have unique unidirectional respiratory systems and high metabolic rates requiring precise humidity, pelleted diets, and non-toxic environments.',
          diet: '• **Base Diet**: 70% Veterinary-grade extruded pellets (Harrison\'s High Potency, ZuPreem Natural).\n• **Fresh Foods (20%)**: Dark leafy greens (kale, dandelion, spinach), steamed sweet potato, carrots, broccoli, chili peppers.\n• **Seeds & Nuts (10%)**: Strictly as positive foraging rewards.\n• **TOXIC FOODS**: Avocado (Persin toxin causes acute heart failure), Chocolate, Caffeine, Apple seeds, Raw onions/garlic, Salt.',
          emergencyTopics: '1. **Egg Binding (Dystocia)**: Female bird straining on cage floor. Provide 85-90°F heat, 70% humidity, calcium gluconate, and immediate avian vet lubricated delivery.\n2. **Psittacosis (Parrot Fever / Chlamydiosis)**: Lime-green droppings, conjunctivitis, fluffed feathers. Doxycycline avian oral solution for 45 consecutive days (Zoonotic to humans!).\n3. **Feather Destructive Behavior (Plucking)**: Causes: Low humidity, zinc/lead cage toxicity, lack of 10-12 hr dark sleep, dietary deficiency. Provide daily foraging toys, aloe-vera mist sprays, full-spectrum avian UV lighting.',
          warning: '🚨 TEFLON / NON-STICK PANS & PTFE FUMES are 100% FATAL to birds within seconds! Never use self-cleaning ovens, scented candles, or aerosol sprays in bird households.'
        }
      ]
    },

    
    rabbit: {
      diseases: [
        {
          keys: ['rabbit', 'bunny', 'gi stasis', 'rabbit not eating', 'khargosh', 'guinea pig', 'hamster', 'poop small rabbit'],
          title: 'Rabbit GI Stasis, Dental Health & Nutritional Protocols',
          severity: 'CRITICAL METABOLIC EMERGENCY',
          overview: 'Rabbits are obligate hindgut fermenters. Cessation of gut motility leads to gas distension, hypothermia, and fatal hepatic lipidosis.',
          stasisProtocol: '1. **Emergency GI Stasis Action**: If a rabbit has not eaten or passed fecal pellets for > 8 hours:\n- Assist Syringe Feeding: Oxbow Critical Care (15-20 mL/kg divided into 3-4 feeds daily).\n- Pain Control: Meloxicam (0.5-1.0 mg/kg orally q12h) — pain relief is mandatory for rabbits to resume eating.\n- Prokinetics (Gut Motility): Metoclopramide (0.5 mg/kg q12h) + Cisapride (0.5 mg/kg q12h) once blockage/foreign body is ruled out.\n- Subcutaneous Hydration: 50-100 mL warm saline.\n- Gentle belly massage and warm towel heating pad.',
          diet: '• **85% Western Timothy Hay**: Unlimited access 24/7 (crucial for wearing down continuously growing hypsodont teeth and fiber motility).\n• **10% Fresh Greens**: Cilantro, parsley, romaine, mint, basil.\n• **5% Plain Pellets**: High fiber, no corn/seeds.',
          warning: '🚨 NEVER administer oral Penicillin, Amoxicillin, or Cephalosporins to rabbits—they disrupt cecal microflora causing fatal Clostridial enterotoxemia!'
        }
      ]
    },

    
    exotic: {
      diseases: [
        {
          keys: ['fish', 'aquarium', 'white spot', 'ich', 'fin rot', 'turtle', 'machli', 'kachwa', 'reptile', 'swim bladder'],
          title: 'Aquatic Fish & Aquatic Turtle Clinical Guide',
          severity: 'ENVIRONMENTAL & CLINICAL',
          overview: 'Water chemistry (Ammonia, Nitrite, Nitrate, pH, Temp) and UV radiation are fundamental to aquatic immunity.',
          fishCare: '• **Ich (White Spot Disease - Ichthyophthirius)**: Raise tank temp to 28-30°C (82-86°F) to speed up parasite lifecycle. Dose with Aquarium Salt (1 tbsp/5 gal) + Malachite Green / Formalin (Ich-X) for 10-14 days.\n• **Fin Rot (Pseudomonas/Aeromonas)**: 30% water change, Seachem Kanaplex or Melafix + Pimafix.\n• **Swim Bladder Disorder**: Fast for 48 hours, feed thawed de-skinned green peas, maintain pristine water quality.',
          turtleCare: '• **Metabolic Bone Disease (MBD) & Soft Shell**: Inadequate UVB and Calcium. Requires 10.0 UVB linear bulb (replaced every 6 mos) + Basking dock at 32-35°C (90-95°F) + Calcium with D3 powder.\n• **Shell Rot (Ulcerative Dermatitis)**: Clean with dilute Betadine, apply silver sulfadiazine cream, dry-dock for 2-3 hours daily.',
          warning: '⚠️ Always use water conditioner/dechlorinator (Seachem Prime) before adding tap water to any tank.'
        }
      ]
    }
  },

  
  
  
  formulary: [
    {
      drug: 'Amoxicillin / Clavulanate (Clavamox / Augmentin)',
      class: 'Broad-Spectrum Potentiated Penicillin Antibiotic',
      dosage: 'Dogs & Cats: 12.5 - 20 mg/kg orally every 12 hours with food.',
      indications: 'Skin pyoderma, bite wounds, urinary tract infections, respiratory infections, periodontal abscesses.',
      precautions: '⚠️ Must complete full 7-14 days. Contraindicated in rabbits, guinea pigs, hamsters.'
    },
    {
      drug: 'Meloxicam (Metacam)',
      class: 'COX-2 Preferential NSAID (Analgesic / Anti-inflammatory)',
      dosage: 'Dogs: 0.2 mg/kg on Day 1 loading, followed by 0.1 mg/kg once daily with food.\nCats: 0.05 mg/kg single dose, or strictly approved micro-dosages.',
      indications: 'Post-operative pain, osteoarthritis, musculoskeletal trauma.',
      precautions: '⚠️ NEVER give on empty stomach. NEVER combine with steroids (Prednisone) or other NSAIDs (Carprofen/Aspirin).'
    },
    {
      drug: 'Metronidazole (Flagyl)',
      class: 'Nitroimidazole Antibacterial & Antiprotozoal',
      dosage: 'Dogs & Cats: 10 - 15 mg/kg orally every 12 hours with meals for 5-7 days.',
      indications: 'Giardiasis, acute inflammatory bowel disease, anaerobic bacterial diarrhea, stress colitis.',
      precautions: '⚠️ Overdosing can cause reversible central vestibular neurotoxicity (head tilt, nystagmus).'
    },
    {
      drug: 'Cerenia (Maropitant Citrate)',
      class: 'NK1 Receptor Antagonist Antiemetic',
      dosage: 'Acute Vomiting: 2 mg/kg orally once daily (or 1 mg/kg SC/IV once daily) for up to 5 consecutive days.\nMotion Sickness: 8 mg/kg orally given 2 hours prior to travel with a light snack.',
      indications: 'Prevention and acute treatment of vomiting in dogs (8+ wks) and cats (16+ wks).',
      precautions: '⚠️ Exceptionally high safety profile.'
    },
    {
      drug: 'Doxycycline Hyclate / Monohydrate',
      class: 'Tetracycline Antibiotic',
      dosage: 'Dogs & Cats: 10 mg/kg orally once daily (or 5 mg/kg twice daily) with full meal for 28 days for tick-borne diseases; 7-14 days for respiratory infections.',
      indications: 'Ehrlichiosis, Anaplasmosis, Lyme disease, Kennel Cough, Mycoplasma, Avian Psittacosis.',
      precautions: '⚠️ Always follow with water/food to prevent esophageal ulceration in cats and dogs.'
    },
    {
      drug: 'Fenbendazole (Panacur / Safe-Guard)',
      class: 'Benzimidazole Broad-Spectrum Anthelmintic',
      dosage: 'Dogs, Cats & Rabbits: 50 mg/kg orally once daily for 3 to 5 consecutive days.',
      indications: 'Roundworms, Hookworms, Whipworms, Tapeworms (Taenia), and Giardia.',
      precautions: '⚠️ Repeat 3-day course in 2-3 weeks for full parasitic eradication.'
    },
    {
      drug: 'Apoquel (Oclacitinib)',
      class: 'Janus Kinase (JAK-1) Inhibitor Anti-Pruritic',
      dosage: 'Dogs: 0.4 - 0.6 mg/kg orally twice daily for up to 14 days, then once daily maintenance.',
      indications: 'Rapid control of pruritus (itching) associated with allergic dermatitis and atopic dermatitis.',
      precautions: '⚠️ Approved for dogs 12 months of age and older.'
    },
    {
      drug: 'Bravecto / NexGard / Simparica (Isoxazolines)',
      class: 'GABA/Glutamate-Gated Chloride Channel Inhibitor Parasiticide',
      dosage: 'Administered orally according to weight bracket:\n• NexGard & Simparica: Monthly chew.\n• Bravecto: Every 12 weeks chew.',
      indications: '100% kill rate for adult fleas, blacklegged ticks, lone star ticks, brown dog ticks, demodectic and sarcoptic mange.',
      precautions: '⚠️ Use with caution in pets with history of epilepsy or seizures.'
    }
  ],

  
  
  
  breedProfiles: [
    {
      name: 'Golden Retriever',
      species: 'Dog',
      weight: '25 - 34 kg',
      calories: '1,200 - 1,450 kcal/day (approx. 3.5 cups premium large-breed kibble divided into 2 meals)',
      grooming: 'Dense water-repellent double coat. Thorough brushing 3-4x weekly with slicker brush and undercoat rake. Clean ear canals weekly with EpiOtic.',
      exercise: '60-90 minutes daily (fetch, trail walks, swimming)',
      healthRisks: 'Hip/Elbow Dysplasia, Atopic Dermatitis, Subaortic Stenosis, Hemangiosarcoma. Annual echocardiogram and joint screenings recommended.'
    },
    {
      name: 'German Shepherd',
      species: 'Dog',
      weight: '30 - 40 kg',
      calories: '1,400 - 1,750 kcal/day with joint support (Glucosamine/Chondroitin)',
      grooming: 'Heavy shedding ("German Shedder"). Daily brushing during bi-annual coat blowouts. Bathe every 6-8 weeks.',
      exercise: '90+ minutes daily with rigorous mental agility, obedience, and puzzle foraging',
      healthRisks: 'GDV/Bloat (use slow feeder), Degenerative Myelopathy (SOD1 gene test), Hip Dysplasia, Perianal Fistulas.'
    },
    {
      name: 'Labrador Retriever',
      species: 'Dog',
      weight: '25 - 36 kg',
      calories: '1,100 - 1,500 kcal/day (strict portion control—POMC gene mutation makes them constantly hungry)',
      grooming: 'Short dense double coat. Weekly deshedding with rubber curry comb.',
      exercise: '60+ minutes active retrieving and swimming',
      healthRisks: 'Obesity, Cruciate Ligament (CCL) tears, Exercise-Induced Collapse (EIC), Cataracts.'
    },
    {
      name: 'Siberian Husky',
      species: 'Dog',
      weight: '16 - 27 kg',
      calories: '1,000 - 1,350 kcal/day high-protein active formula',
      grooming: 'NEVER shave double coat (destroys thermo-regulation and exposes skin to sunburn/heatstroke). Brush 2-3x weekly.',
      exercise: '90-120 minutes running/pulling in cool weather',
      healthRisks: 'Zinc-Responsive Dermatosis, Corneal Dystrophy, Progressive Retinal Atrophy.'
    },
    {
      name: 'Persian Cat',
      species: 'Cat',
      weight: '3.5 - 5.5 kg',
      calories: '180 - 230 kcal/day (high fiber, hairball control formula)',
      grooming: 'Long luxurious coat requires DAILY metal comb detangling from roots. Wipe facial folds and eye tear stains daily with sterile saline pads.',
      exercise: '20-30 minutes gentle interactive wand/laser play',
      healthRisks: 'Brachycephalic Airway Syndrome, Polycystic Kidney Disease (PKD DNA test), Hypertrophic Cardiomyopathy (HCM).'
    },
    {
      name: 'Siamese Cat',
      species: 'Cat',
      weight: '3.0 - 5.0 kg',
      calories: '190 - 240 kcal/day',
      grooming: 'Short fine coat requires minimal brushing (once weekly with soft bristle brush).',
      exercise: 'Highly active and vocal; needs high cat trees, puzzle feeders, and constant companionship',
      healthRisks: 'Amyloidosis, Asthma/Bronchial disease, Progressive Retinal Atrophy.'
    }
  ],

  get knowledgeBase() {
    return {
      diseases: [
        ...this.encyclopedia.dog.diseases,
        ...this.encyclopedia.cat.diseases,
        ...this.encyclopedia.bird.diseases,
        ...this.encyclopedia.rabbit.diseases,
        ...this.encyclopedia.exotic.diseases
      ],
      medications: this.formulary,
      breeds: this.breedProfiles
    };
  },

  init() {
    this.injectChatbotUI();
    this.bindEvents();
    this.initSpeechRecognition();
    this.renderChatHistory();
  },

  injectChatbotUI() {
    if (document.getElementById('fureverChatWidget')) return;

    const widget = document.createElement('div');
    widget.id = 'fureverChatWidget';
    widget.innerHTML = `
      <!-- Floating AI Toggle Button -->
      <button id="fureverChatToggle" class="furever-chat-toggle" aria-label="Open AI Pet Care Chat">
        <div class="chat-toggle-icon">
          <i class="bi bi-chat-heart-fill"></i>
        </div>
        <span class="chat-toggle-badge">🐾 Ask Dr. Paws AI</span>
      </button>

      <!-- Chat Pop-up Window -->
      <div id="fureverChatBox" class="furever-chat-box">
        <!-- Header -->
        <div class="chat-header">
          <div class="d-flex align-items-center gap-2">
            <div class="chat-avatar position-relative">
              <span class="fs-4">🩺</span>
              <span class="chat-online-dot"></span>
            </div>
            <div>
              <h6 class="chat-title mb-0">Dr. Paws Clinical AI v3.0</h6>
              <small class="chat-status">Multi-Species Veterinary Intelligence</small>
            </div>
          </div>
          <div class="d-flex align-items-center gap-1">
            <button class="chat-header-btn" id="btnChatSettings" title="API Settings">
              <i class="bi bi-gear-fill"></i>
            </button>
            <button class="chat-header-btn" id="btnChatClear" title="Clear Conversation">
              <i class="bi bi-trash3"></i>
            </button>
            <button class="chat-header-btn" id="btnChatClose" title="Minimize Chat">
              <i class="bi bi-dash-lg"></i>
            </button>
          </div>
        </div>

        <!-- Suggestion Quick Chips Bar -->
        <div class="chat-chips-bar" id="chatChipsBar">
          <button class="chip-btn" data-query="🐶 Dog Parvovirus & bloody diarrhea clinical protocol with medicine doses">💉 Parvo & Vomiting</button>
          <button class="chip-btn" data-query="🐱 Cat urinary blockage, FLUTD emergency catheterization & medicine">🐱 Cat Urinary Block</button>
          <button class="chip-btn" data-query="💊 Safe pet antibiotics, pain relief & deworming dosages chart">💊 Meds & Dosages</button>
          <button class="chip-btn" data-query="🐶 Golden Retriever daily food calories, grooming & health issues">🦮 Golden Retriever</button>
          <button class="chip-btn" data-query="🦜 Parrot feather plucking, bird diet, egg binding & teflon toxicity">🦜 Birds & Parrots</button>
          <button class="chip-btn" data-query="🐰 Rabbit GI Stasis emergency feeding and timothy hay diet rules">🐰 Rabbit GI Stasis</button>
          <button class="chip-btn" data-query="🚨 Emergency first aid for chocolate, onion or poison ingestion">🚨 Poison First Aid</button>
          <button class="chip-btn" data-query="Billi khana nahi kha rahi aur ulti kar rahi hai kiya karu?">🗣️ Roman Urdu Query</button>
        </div>

        <!-- Messages Area -->
        <div class="chat-messages" id="chatMessages">
          <!-- Welcome Message -->
          <div class="chat-msg bot-msg">
            <div class="msg-avatar">🩺</div>
            <div class="msg-bubble">
              <p class="mb-1"><strong>Hello! I am Dr. Paws AI — your 24/7 Clinical Veterinary & Multi-Species Pet Care Intelligence.</strong></p>
              <p class="small mb-2">I provide comprehensive, medically accurate guidance across <strong>All Companion Animals</strong> (Dogs, Cats, Birds, Parrots, Rabbits, Hamsters, Fish, Turtles) in <strong>English, Urdu & Roman Urdu</strong>:</p>
              <ul class="small mb-2 ps-3">
                <li>🩺 <strong>Diseases & Emergency Sickness</strong> (Parvo, Kidney failure, Urinary block, Distemper, GDV Bloat)</li>
                <li>💊 <strong>Medications & Safe Mg/Kg Dosages</strong> (Antibiotics, NSAID painkillers, Deworming, Parasites)</li>
                <li>🥗 <strong>Nutritional Diets, Calorie Portions & Toxic Food Alerts</strong></li>
                <li>✂️ <strong>Care, Grooming, Shedding & Behavioral Training Routines</strong></li>
                <li>🚨 <strong>Poison Ingestion & Emergency First-Aid Triage</strong></li>
              </ul>
              <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                <small class="text-muted" style="font-size: 0.72rem;">💡 Tap any chip above, use the microphone, or ask below!</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div class="chat-typing-indicator" id="chatTypingIndicator" style="display: none;">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <small class="ms-2 text-muted" style="font-size: 0.75rem;">Dr. Paws AI is generating comprehensive veterinary guidance...</small>
        </div>

        <!-- Input Area with Mic & Send -->
        <form class="chat-input-area" id="chatInputForm">
          <input type="text" id="chatInputText" class="chat-input" placeholder="Ask about any pet, disease, medicine dose, diet or in Roman Urdu..." autocomplete="off">
          <button type="button" class="chat-mic-btn" id="chatMicBtn" title="Speak to AI (Voice Input)" aria-label="Voice Input">
            <i class="bi bi-mic-fill"></i>
          </button>
          <button type="submit" class="chat-send-btn" id="chatSendBtn" aria-label="Send message">
            <i class="bi bi-send-fill"></i>
          </button>
        </form>
      </div>

      <!-- AI Settings Modal -->
      <div class="modal fade" id="aiSettingsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" style="border-radius: 20px; border: 1px solid var(--light);">
            <div class="modal-header border-bottom">
              <h5 class="modal-title fw-bold text-brown">
                <i class="bi bi-robot text-peach me-2"></i> AI Assistant Engine Configuration
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="p-3 bg-light rounded-3 mb-3 border">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span class="badge bg-success">Dual-Engine Intelligence Active</span>
                </div>
                <p class="small text-muted mb-0">
                  Dr. Paws AI utilizes multi-tier real-time generative cloud intelligence backed by an offline clinical knowledge matrix. You can also connect your own custom OpenAI, Gemini or OpenRouter key.
                </p>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Custom AI API Key (Optional)</label>
                <input type="password" id="aiApiKeyInput" class="form-control form-control-sm" placeholder="e.g. OpenAI / Gemini / OpenRouter Key">
                <small class="text-muted" style="font-size: 0.72rem;">Optional. Cloud AI works automatically out of the box.</small>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Custom Endpoint URL (Optional)</label>
                <input type="url" id="aiApiEndpointInput" class="form-control form-control-sm" placeholder="https://api.openai.com/v1/chat/completions">
              </div>
            </div>
            <div class="modal-footer border-top">
              <button type="button" class="btn btn-peach btn-sm" id="btnSaveAiSettings">Save Settings</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
  },

  bindEvents() {
    const toggleBtn = document.getElementById('fureverChatToggle');
    const chatBox = document.getElementById('fureverChatBox');
    const closeBtn = document.getElementById('btnChatClose');
    const clearBtn = document.getElementById('btnChatClear');
    const form = document.getElementById('chatInputForm');
    const input = document.getElementById('chatInputText');
    const settingsBtn = document.getElementById('btnChatSettings');

    
    const toggleChat = () => {
      this.isOpen = !this.isOpen;
      chatBox.classList.toggle('active', this.isOpen);
      if (this.isOpen) {
        input?.focus();
        this.scrollToBottom();
      }
    };

    toggleBtn?.addEventListener('click', toggleChat);
    closeBtn?.addEventListener('click', toggleChat);

    
    clearBtn?.addEventListener('click', () => {
      this.chatHistory = [];
      localStorage.removeItem('furever_chat_history');
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      const messagesContainer = document.getElementById('chatMessages');
      if (messagesContainer) {
        messagesContainer.innerHTML = `
          <div class="chat-msg bot-msg">
            <div class="msg-avatar">🩺</div>
            <div class="msg-bubble">
              <p class="mb-0">Chat history cleared. How can I help your companion today? 🐶🐱🦜🐰</p>
            </div>
          </div>
        `;
      }
      App.toast('Chat history cleared.', 'Chat Reset', 'info');
    });

    
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        if (query && input) {
          input.value = query;
          form.dispatchEvent(new Event('submit'));
        }
      });
    });

    
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || this.isTyping) return;

      input.value = '';
      this.appendMessage('user', text);
      this.chatHistory.push({ sender: 'user', text });
      this.saveHistory();

      this.showTyping(true);

      try {
        const response = await this.generateResponse(text);
        this.showTyping(false);
        this.appendMessage('bot', response);
        this.chatHistory.push({ sender: 'bot', text: response });
        this.saveHistory();
      } catch (err) {
        this.showTyping(false);
        const fallback = this.generateFallbackResponse(text);
        this.appendMessage('bot', fallback);
        this.chatHistory.push({ sender: 'bot', text: fallback });
        this.saveHistory();
      }
    });

    
    settingsBtn?.addEventListener('click', () => {
      const modalEl = document.getElementById('aiSettingsModal');
      const keyInput = document.getElementById('aiApiKeyInput');
      const epInput = document.getElementById('aiApiEndpointInput');

      if (keyInput) keyInput.value = this.apiKey;
      if (epInput) epInput.value = this.apiEndpoint;

      if (modalEl) new bootstrap.Modal(modalEl).show();
    });

    document.getElementById('btnSaveAiSettings')?.addEventListener('click', () => {
      const keyInput = document.getElementById('aiApiKeyInput');
      const epInput = document.getElementById('aiApiEndpointInput');
      this.apiKey = keyInput?.value.trim() || '';
      this.apiEndpoint = epInput?.value.trim() || '';

      localStorage.setItem('furever_ai_key', this.apiKey);
      localStorage.setItem('furever_ai_endpoint', this.apiEndpoint);

      const modalEl = document.getElementById('aiSettingsModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

      App.toast('AI Assistant settings updated!', 'Settings Saved', 'success');
    });

    
    document.addEventListener('click', (e) => {
      
      if (e.target && e.target.closest('.btn-speak-msg')) {
        const btn = e.target.closest('.btn-speak-msg');
        const bubble = btn.closest('.msg-bubble');
        if (bubble) {
          const textToSpeak = bubble.innerText.replace(/🔊.*|📋.*/g, '').trim();
          this.toggleSpeech(textToSpeak, btn);
        }
      }

      
      if (e.target && e.target.closest('.btn-copy-msg')) {
        const btn = e.target.closest('.btn-copy-msg');
        const bubble = btn.closest('.msg-bubble');
        if (bubble) {
          const cleanText = bubble.innerText.replace(/🔊.*|📋.*/g, '').trim();
          navigator.clipboard.writeText(cleanText).then(() => {
            App.toast('Medical advice copied to clipboard!', 'Copied', 'info');
          });
        }
      }

      
      if (e.target && e.target.classList.contains('btn-ai-buy')) {
        const item = {
          id: e.target.dataset.id,
          name: e.target.dataset.name,
          price: parseFloat(e.target.dataset.price)
        };
        App.addToCart(item);
      }
    });
  },

  initSpeechRecognition() {
    const micBtn = document.getElementById('chatMicBtn');
    const input = document.getElementById('chatInputText');
    if (!micBtn || !input) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      micBtn.style.display = 'none';
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      micBtn.classList.add('recording');
      input.placeholder = 'Listening... Speak now 🎙️';
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
      document.getElementById('chatInputForm')?.dispatchEvent(new Event('submit'));
    };

    this.recognition.onerror = () => {
      this.isListening = false;
      micBtn.classList.remove('recording');
      input.placeholder = 'Ask about any pet, disease, medicine dose, or diet...';
    };

    this.recognition.onend = () => {
      this.isListening = false;
      micBtn.classList.remove('recording');
      input.placeholder = 'Ask about any pet, disease, medicine dose, or diet...';
    };

    micBtn.addEventListener('click', () => {
      if (this.isListening) {
        this.recognition.stop();
      } else {
        try {
          this.recognition.start();
        } catch (e) {}
      }
    });
  },

  toggleSpeech(text, btn) {
    if (!('speechSynthesis' in window)) {
      App.toast('Speech synthesis is not supported in this browser.', 'Audio Unavailable', 'warning');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      btn.innerHTML = `<i class="bi bi-volume-up"></i> Listen`;
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      btn.innerHTML = `<i class="bi bi-volume-up"></i> Listen`;
    };
    utterance.onerror = () => {
      btn.innerHTML = `<i class="bi bi-volume-up"></i> Listen`;
    };

    btn.innerHTML = `<i class="bi bi-stop-fill text-danger"></i> Stop`;
    window.speechSynthesis.speak(utterance);
  },

  showTyping(show) {
    this.isTyping = show;
    const indicator = document.getElementById('chatTypingIndicator');
    if (indicator) {
      indicator.style.display = show ? 'flex' : 'none';
      this.scrollToBottom();
    }
  },

  appendMessage(sender, htmlText) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'bot-msg'} reveal visible`;

    if (sender === 'user') {
      msgEl.innerHTML = `
        <div class="msg-bubble">${App.escape(htmlText)}</div>
        <div class="msg-avatar">👤</div>
      `;
    } else {
      msgEl.innerHTML = `
        <div class="msg-avatar">🩺</div>
        <div class="msg-bubble">
          ${htmlText}
          <div class="d-flex align-items-center justify-content-end gap-2 mt-2 pt-2 border-top" style="border-color: rgba(0,0,0,0.06)!important;">
            <button class="btn btn-sm btn-link p-0 text-decoration-none text-muted btn-speak-msg" style="font-size: 0.72rem;">
              <i class="bi bi-volume-up"></i> Listen
            </button>
            <button class="btn btn-sm btn-link p-0 text-decoration-none text-muted btn-copy-msg" style="font-size: 0.72rem;">
              <i class="bi bi-clipboard"></i> Copy
            </button>
          </div>
        </div>
      `;
    }

    container.appendChild(msgEl);
    this.scrollToBottom();
  },

  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  },

  saveHistory() {
    try {
      localStorage.setItem('furever_chat_history', JSON.stringify(this.chatHistory.slice(-25)));
    } catch (e) {}
  },

  renderChatHistory() {
    if (!this.chatHistory || !this.chatHistory.length) return;
    this.chatHistory.forEach(m => {
      this.appendMessage(m.sender, m.text);
    });
  },

  
  
  
  async generateResponse(query) {
    const q = query.trim();

    
    if (this.apiKey && this.apiEndpoint) {
      try {
        const customRes = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are Dr. Paws, a world-class veterinary clinical specialist and pet care AI. Provide comprehensive, structured medical answers with clinical dosages (mg/kg), symptoms, emergency triage, and diet. Answer in user language (English or Roman Urdu).'
              },
              { role: 'user', content: q }
            ]
          })
        });
        if (customRes.ok) {
          const json = await customRes.json();
          const reply = json.choices?.[0]?.message?.content;
          if (reply) return this.formatMarkdown(reply);
        }
      } catch (e) {
        console.warn('Custom API failed, moving to next tier:', e);
      }
    }

    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are Dr. Paws, chief veterinary clinical expert for FurEver Care. Provide direct, highly detailed, compassionate medical, dietary, breed, medicine dosage, and care advice for any pet species (dogs, cats, birds, parrots, rabbits, fish, turtles, hamsters). Answer in the user\'s language (English or Roman Urdu). Structure with clean sections: Overview, Symptoms/Details, Clinical Protocol & Safe Dosages, Home Care, and Important Warnings.'
            },
            { role: 'user', content: q }
          ],
          model: 'openai'
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 30) {
          return this.formatMarkdown(text.trim());
        }
      }
    } catch (e) {
      console.info('[Dr. Paws AI] Cloud API busy; generating from internal multi-species clinical neural matrix.');
    }

    
    return this.generateFallbackResponse(q);
  },

  
  generateFallbackResponse(query) {
    const q = query.toLowerCase().trim();

    
    const isUrdu = /kutta|billi|tota|khargosh|machli|ulti|dast|khoon|bukhar|zukam|khana|dawa|ilaj|dard|peshab|kachwa|tote|pait|billiya/.test(q);

    
    for (const d of this.encyclopedia.dog.diseases) {
      if (d.keys.some(k => q.includes(k))) {
        return `
          <div class="ai-card">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-brown mb-0">🐶 ${d.title}</h6>
              <span class="badge bg-danger">${d.severity}</span>
            </div>
            <p class="small mb-2"><strong>Pathology & Overview:</strong> ${d.overview}</p>
            <p class="small mb-2"><strong>Diagnostic Symptoms:</strong> ${d.symptoms}</p>
            <div class="p-2 bg-light rounded-3 border mb-2 small">
              <strong class="text-brown d-block mb-1">💊 Clinical Veterinary Protocol & Medications:</strong>
              ${this.formatMarkdown(d.protocol)}
            </div>
            ${d.homeCare ? `<p class="small mb-2"><strong>Supportive Nursing Care:</strong> ${d.homeCare}</p>` : ''}
            <div class="p-2 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3 text-danger small mt-2">
              ${d.warning}
            </div>
          </div>
        `;
      }
    }

    
    for (const d of this.encyclopedia.cat.diseases) {
      if (d.keys.some(k => q.includes(k))) {
        return `
          <div class="ai-card">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-brown mb-0">🐱 ${d.title}</h6>
              <span class="badge bg-danger">${d.severity}</span>
            </div>
            <p class="small mb-2"><strong>Clinical Overview:</strong> ${d.overview}</p>
            <p class="small mb-2"><strong>Symptoms & Red Flags:</strong> ${d.symptoms}</p>
            <div class="p-2 bg-light rounded-3 border mb-2 small">
              <strong class="text-brown d-block mb-1">💊 Medical & Surgical Protocol:</strong>
              ${this.formatMarkdown(d.protocol)}
            </div>
            ${d.homeCare ? `<p class="small mb-2"><strong>Supportive Home Care:</strong> ${d.homeCare}</p>` : ''}
            ${d.warning ? `<div class="p-2 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3 text-danger small mt-2">${d.warning}</div>` : ''}
          </div>
        `;
      }
    }

    
    for (const b of this.encyclopedia.bird.diseases) {
      if (b.keys.some(k => q.includes(k))) {
        return `
          <div class="ai-card">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-brown mb-0">🦜 ${b.title}</h6>
              <span class="badge badge-soft">${b.severity}</span>
            </div>
            <p class="small mb-2"><strong>Overview:</strong> ${b.overview}</p>
            <div class="p-2 bg-light rounded-3 border mb-2 small">
              <strong class="text-brown d-block mb-1">🥗 Complete Nutritional Diet:</strong>
              ${this.formatMarkdown(b.diet)}
            </div>
            <div class="small mb-2">${this.formatMarkdown(b.emergencyTopics)}</div>
            <div class="p-2 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3 text-danger small mt-2">
              ${b.warning}
            </div>
          </div>
        `;
      }
    }

    
    for (const r of this.encyclopedia.rabbit.diseases) {
      if (r.keys.some(k => q.includes(k))) {
        return `
          <div class="ai-card">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-brown mb-0">🐰 ${r.title}</h6>
              <span class="badge badge-soft">${r.severity}</span>
            </div>
            <p class="small mb-2"><strong>Digestive Overview:</strong> ${r.overview}</p>
            <div class="p-2 bg-light rounded-3 border mb-2 small">
              <strong class="text-brown d-block mb-1">🚨 Emergency GI Stasis Protocol:</strong>
              ${this.formatMarkdown(r.stasisProtocol)}
            </div>
            <p class="small mb-2"><strong>85% Hay Nutrition Rule:</strong> ${r.diet}</p>
            <div class="p-2 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3 text-danger small mt-2">
              ${r.warning}
            </div>
          </div>
        `;
      }
    }

    
    for (const e of this.encyclopedia.exotic.diseases) {
      if (e.keys.some(k => q.includes(k))) {
        return `
          <div class="ai-card">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-brown mb-0">🐠 ${e.title}</h6>
              <span class="badge badge-soft">${e.severity}</span>
            </div>
            <p class="small mb-2"><strong>Overview:</strong> ${e.overview}</p>
            <div class="small mb-2"><strong>Aquarium Water Care & Disease:</strong><br>${this.formatMarkdown(e.fishCare)}</div>
            <div class="small mb-2"><strong>Turtle Shell & UVB Care:</strong><br>${this.formatMarkdown(e.turtleCare)}</div>
            <div class="p-2 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3 text-dark small mt-2">
              ${e.warning}
            </div>
          </div>
        `;
      }
    }

    
    for (const m of this.formulary) {
      const drugLower = m.drug.toLowerCase();
      if (q.includes(drugLower) || (drugLower.includes('amoxicillin') && q.includes('clavamox')) || (drugLower.includes('meloxicam') && q.includes('metacam')) || (drugLower.includes('metronidazole') && q.includes('flagyl')) || (drugLower.includes('maropitant') && q.includes('cerenia')) || (drugLower.includes('doxycycline') && q.includes('doxy'))) {
        return `
          <div class="ai-card">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-brown mb-0">💊 ${m.drug}</h6>
              <span class="badge badge-soft">${m.class}</span>
            </div>
            <div class="p-2 bg-light rounded-3 border mb-2 small">
              <strong class="text-brown d-block mb-1">Standard Safe Veterinary Dosage:</strong>
              <code class="text-brown fw-bold" style="font-size: 0.85rem;">${m.dosage}</code>
            </div>
            <p class="small mb-2"><strong>Clinical Indications:</strong> ${m.indications}</p>
            <div class="p-2 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3 text-dark small mt-2">
              ${m.precautions}
            </div>
          </div>
        `;
      }
    }

    
    if (q.includes('medicine') || q.includes('dosage') || q.includes('dose') || q.includes('antibiotic') || q.includes('painkiller') || q.includes('dawa') || q.includes('deworm')) {
      return `
        <div class="ai-card">
          <h6 class="fw-bold text-brown mb-2">💊 Safe Veterinary Medication Reference & Dosages (Mg/Kg)</h6>
          <div class="table-responsive">
            <table class="table table-sm table-bordered small bg-white mb-2">
              <thead class="table-light">
                <tr><th>Medication</th><th>Standard Safe Dosage</th><th>Primary Indication</th></tr>
              </thead>
              <tbody>
                ${this.formulary.map(m => `
                  <tr>
                    <td><strong>${m.drug}</strong></td>
                    <td><code class="text-brown">${m.dosage.split('\n')[0]}</code></td>
                    <td>${m.indications}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="p-2 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3 text-danger small">
            ⚠️ <strong>FATAL WARNING:</strong> NEVER administer Paracetamol (Panadol), Tylenol, or Ibuprofen to cats or dogs. Even half a tablet causes irreversible liver necrosis and red blood cell lysis.
          </div>
        </div>
      `;
    }

    
    for (const b of this.breedProfiles) {
      if (q.includes(b.name.toLowerCase()) || (b.name.includes('Husky') && q.includes('husky')) || (b.name.includes('Labrador') && q.includes('labrador')) || (b.name.includes('German') && q.includes('shepherd')) || (b.name.includes('Golden') && q.includes('golden'))) {
        return `
          <div class="ai-card">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-brown mb-0">🐾 ${b.name} (${b.species}) Comprehensive Profile</h6>
              <span class="badge badge-soft">${b.weight}</span>
            </div>
            <p class="small mb-2"><strong>Daily Nutrition & Energy:</strong> ${b.calories}</p>
            <p class="small mb-2"><strong>Grooming Protocol:</strong> ${b.grooming}</p>
            <p class="small mb-2"><strong>Daily Exercise & Enrichment:</strong> ${b.exercise}</p>
            <p class="small mb-2"><strong>Genetic Health Risks:</strong> ${b.healthRisks}</p>
            <div class="p-2 bg-light rounded-3 small mt-2">
              💡 Calculate exact kibble portions for your ${b.name} on our <a href="pet-care.html" class="fw-bold text-peach">Daily Nutrition Calculator</a>.
            </div>
          </div>
        `;
      }
    }

    
    if (q.includes('food') || q.includes('diet') || q.includes('product') || q.includes('suppl') || q.includes('kibble') || q.includes('toy') || q.includes('brush') || q.includes('buy') || q.includes('shampoo')) {
      const sampleProds = (window.DEFAULT_DATA?.products || []).slice(0, 4);
      return `
        <div class="ai-card">
          <h6 class="fw-bold text-brown mb-2">🛍️ Top Veterinary-Approved Pet Essentials & Diet</h6>
          <p class="small text-muted mb-2">Recommended premium supplies from our care catalog:</p>
          ${sampleProds.map(p => `
            <div class="d-flex align-items-center gap-2 p-2 bg-white rounded-3 mb-2 border shadow-sm">
              <img src="${p.image}" alt="${p.name}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 8px;">
              <div class="flex-grow-1">
                <strong class="d-block text-brown small">${p.name}</strong>
                <span class="badge badge-soft" style="font-size: 0.68rem;">${p.category}</span>
                <span class="text-peach fw-bold small ms-2">$${p.price.toFixed(2)}</span>
              </div>
              <button class="btn btn-peach btn-sm py-1 px-2 btn-ai-buy" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" style="font-size: 0.72rem;">
                + Add
              </button>
            </div>
          `).join('')}
          <a href="products.html" class="btn btn-outline-peach btn-sm w-100 mt-1" style="font-size: 0.78rem;">
            Explore Full Products Catalog <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      `;
    }

    
    if (isUrdu) {
      return `
        <div class="ai-card">
          <h6 class="fw-bold text-brown mb-2">🩺 Dr. Paws Urdu & Hindi Clinical Guidance</h6>
          <p class="small mb-2">Aapke sawal <strong>"${App.escape(query)}"</strong> ke mutabiq complete veterinary advice:</p>
          <div class="p-3 bg-light rounded-3 border mb-2 small">
            <ul class="mb-0 ps-3">
              <li><strong>Ulti ya Dast (Vomiting / Diarrhea):</strong> Agar pet ulti kar raha hai toh foran 6-8 ghante ke liye solid khana rokein. ORS ya thoda sa ubla hua pani dein. Dast ke liye Flagyl (Metronidazole) 10-15 mg/kg khane ke sath di jati hai.</li>
              <li><strong>Zukam aur Khansi (Flu & Cough):</strong> Bathroom me garam pani chala kar pet ko 10-15 minute steam dein. Khana garam karke khilayein.</li>
              <li><strong>Billi Peshab Band (Urinary Block):</strong> Agar male cat bar bar litter box ja kar dard se ro rahi hai toh ye emergency urinary blockage hai, foran hospital le jayein.</li>
              <li><strong>Zehar aur Insani Dawaiyan:</strong> Kutton aur billiyon ko kabhi bhi Panadol, Paracetamol, Disprin ya Brufen mat dein—ye unke liver aur blood ko khatam kar deti hain.</li>
              <li><strong>Khurak & Calories:</strong> Pet ki exact calories aur dry food portion janne ke liye hamara <a href="pet-care.html" class="fw-bold text-peach">Feeding Portion Calculator</a> open karein.</li>
            </ul>
          </div>
          <small class="text-muted d-block" style="font-size: 0.72rem;">🚨 Emergency ke waqt foran hamare 24/7 helpline <strong>+1 (800) 555-PET911</strong> par call karein.</small>
        </div>
      `;
    }

    
    return `
      <div class="ai-card">
        <h6 class="fw-bold text-brown mb-2">🐾 Dr. Paws Veterinary Comprehensive Guidance</h6>
        <p class="small text-muted mb-2">Regarding your query: <strong>"${App.escape(query)}"</strong></p>
        <div class="row g-2 small mb-2">
          <div class="col-12 p-2 bg-light rounded-3 border">
            <strong class="text-brown d-block mb-1">📋 Diagnostic & Care Checklist:</strong>
            <ul class="mb-0 ps-3">
              <li><strong>Hydration Status:</strong> Gently tent skin over the shoulders (skin snap back should be instant; delay indicates dehydration).</li>
              <li><strong>Mucous Membrane Color:</strong> Check pet gums (normal gums are healthy salmon pink; pale white indicates shock/anemia; bright red indicates sepsis/heatstroke).</li>
              <li><strong>Body Temperature:</strong> Normal range is 101.0°F - 102.5°F (38.3°C - 39.2°C). Temperature > 104°F requires active cooling.</li>
              <li><strong>Diet & Portion Balance:</strong> Use the <a href="pet-care.html" class="fw-bold text-peach">Diet & Calorie Calculator</a> to verify daily portion requirements.</li>
            </ul>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
          <a href="veterinarian.html" class="btn btn-peach btn-sm py-1 px-3" style="font-size: 0.78rem;">
            <i class="bi bi-calendar-check me-1"></i> Book Consultation with Dr. Emily
          </a>
          <span class="badge badge-soft">24/7 AI Triage Active</span>
        </div>
      </div>
    `;
  },

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/### (.*?)\n/g, '<h6 class="fw-bold text-brown mt-2 mb-1">$1</h6>')
      .replace(/## (.*?)\n/g, '<h5 class="fw-bold text-brown mt-2 mb-1">$1</h5>')
      .replace(/# (.*?)\n/g, '<h4 class="fw-bold text-brown mt-2 mb-1">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="text-brown bg-light px-1 rounded">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n- (.*?)/g, '<br>• $1')
      .replace(/\n\d+\.\s(.*?)/g, '<br><strong>$&</strong>')
      .replace(/\n/g, '<br>');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.FurEverAI.init();
});
