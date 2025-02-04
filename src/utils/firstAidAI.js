const firstAidKnowledge = {
  bleeding: {
    steps: [
      "Apply direct pressure to the wound with a clean cloth",
      "Keep the injured area elevated above the heart if possible",
      "Apply a sterile bandage",
      "Seek medical attention if bleeding is severe or doesn't stop"
    ],
    warning: "For severe bleeding, call emergency services immediately"
  },
  burn: {
    steps: [
      "Cool the burn under cool (not cold) running water for 10-20 minutes",
      "Remove any jewelry or tight items from the burned area",
      "Cover with a sterile gauze bandage",
      "Do not apply ice, butter, or oils to the burn"
    ],
    warning: "Seek medical attention for severe or chemical burns"
  },
  choking: {
    steps: [
      "Encourage coughing if the person can breathe",
      "Perform back blows if coughing doesn't help",
      "Perform abdominal thrusts (Heimlich maneuver) if back blows don't work",
      "Call emergency services if the person loses consciousness"
    ],
    warning: "This is a medical emergency - call for help if the person cannot breathe"
  },
  fracture: {
    steps: [
      "Keep the injured area still and immobilized",
      "Apply a cold compress to reduce swelling",
      "Do not attempt to realign the bone or joint",
      "Seek immediate medical attention",
      "If possible, support the injured area during transport"
    ],
    warning: "Do not move the person if you suspect a serious injury to the head, neck, or spine"
  },
  heatExhaustion: {
    steps: [
      "Move the person to a cool, shaded area",
      "Loosen tight clothing",
      "Apply cool, wet cloths to the skin",
      "Provide small sips of cool water if the person is conscious",
      "Use fans to help lower body temperature"
    ],
    warning: "If symptoms worsen or the person becomes unresponsive, call emergency services immediately"
  },
  anaphylaxis: {
    steps: [
      "Call emergency services immediately",
      "Help the person use their epinephrine auto-injector if available",
      "Have the person lie down with legs elevated",
      "Loosen tight clothing",
      "Monitor breathing and perform CPR if necessary"
    ],
    warning: "Anaphylaxis is a life-threatening emergency that requires immediate medical attention"
  },
  shock: {
    steps: [
      "Call emergency services immediately",
      "Lay the person down on their back",
      "Elevate legs about 12 inches if no head, neck, or back injuries are suspected",
      "Keep the person warm with a blanket",
      "Do not give anything to drink"
    ],
    warning: "Shock can be life-threatening - professional medical help is crucial"
  },
  noseBleed: {
    steps: [
      "Sit upright and lean slightly forward",
      "Pinch the soft part of the nose just below the bony bridge",
      "Breathe through the mouth and hold pressure for 10-15 minutes",
      "Apply a cold compress to the bridge of the nose",
      "Avoid lying down or tilting the head back"
    ],
    warning: "Seek medical attention if bleeding is severe or doesn't stop after 30 minutes"
  },
  poisoning: {
    steps: [
      "Call poison control or emergency services immediately",
      "Do not induce vomiting unless instructed by a professional",
      "If the person is unconscious, check for breathing and prepare to perform CPR",
      "Collect information about the poison for medical professionals"
    ],
    warning: "Poisoning can be extremely dangerous - always seek professional medical advice"
  },
  seizure: {
    steps: [
      "Keep the person safe from further injury",
      "Do not restrain the person",
      "Remove any nearby objects that could cause harm",
      "Place the person on their side if possible",
      "Time the seizure if you can"
    ],
    warning: "Call emergency services if the seizure lasts longer than 5 minutes or the person doesn't regain consciousness"
  },
  heartAttack: {
    steps: [
      "Call emergency services immediately",
      "Help the person sit in a comfortable position",
      "Loosen any tight clothing",
      "If the person is not allergic and emergency services agree, give one adult aspirin",
      "Prepare to perform CPR if the person becomes unresponsive"
    ],
    warning: "Every minute counts during a heart attack - immediate medical attention is critical"
  },
  stroke: {
    steps: [
      "Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services",
      "Note the time symptoms started",
      "Help the person sit or lie down",
      "Do not give them anything to eat or drink",
      "Monitor breathing and consciousness"
    ],
    warning: "Stroke is a medical emergency - rapid response can minimize brain damage"
  },
  hypothermia: {
    steps: [
      "Move the person to a warm area",
      "Remove wet clothing",
      "Warm the core of the body first (chest, neck, head)",
      "Use warm blankets or body heat",
      "Provide warm (not hot) beverages if the person is conscious"
    ],
    warning: "Severe hypothermia is life-threatening - seek immediate medical attention"
  },
  heatStroke: {
    steps: [
      "Call emergency services immediately",
      "Move the person to a cool area",
      "Remove excess clothing",
      "Apply cool, wet cloths or ice packs to skin",
      "Do not give liquids if the person is not fully conscious"
    ],
    warning: "Heat stroke can cause permanent organ damage or death if not treated quickly"
  },
  snakeBite: {
    steps: [
      "Keep the person calm and still",
      "Remove any tight clothing or jewelry near the bite",
      "Position the bite below the level of the heart",
      "Clean the wound gently",
      "Do not attempt to suck out venom or apply a tourniquet"
    ],
    warning: "Identify the snake if possible without risking further injury - seek immediate medical help"
  },
  concussion: {
    steps: [
      "Remove the person from activity",
      "Check for signs of serious brain injury",
      "Apply a cold compress to reduce swelling",
      "Monitor for confusion, dizziness, or memory problems",
      "Avoid sleep for the first few hours if possible"
    ],
    warning: "Some concussion symptoms may not appear immediately - medical evaluation is crucial"
  },
  electricShock: {
    steps: [
      "Ensure personal safety first - do not touch the person if they are still in contact with electrical source",
      "Turn off power source if possible",
      "Call emergency services",
      "Check for breathing and pulse",
      "Treat for burns and prepare to perform CPR if necessary"
    ],
    warning: "Electrical injuries can cause internal damage not visible externally"
  },
  diabeticEmergency: {
    steps: [
      "If the person is conscious and can swallow, give them sugary food or drink",
      "If they are unconscious, do not try to give anything by mouth",
      "Place the person on their side",
      "Call emergency services",
      "Monitor breathing and be prepared to perform CPR"
    ],
    warning: "Diabetic emergencies can quickly become life-threatening"
  },
  waterRescue: {
    steps: [
      "Do not enter the water unless you are trained in water rescue",
      "Call emergency services",
      "Try to reach the person with a long object",
      "If possible, throw a flotation device",
      "Keep visual contact with the person"
    ],
    warning: "Drowning can occur quickly and silently - immediate professional help is critical"
  },
  severeAllergicReaction: {
    steps: [
      "Identify and remove the allergen if possible",
      "Help the person use their epinephrine auto-injector",
      "Lay the person flat with legs elevated",
      "Loosen tight clothing",
      "Monitor breathing and be prepared to perform CPR"
    ],
    warning: "Severe allergic reactions can rapidly lead to anaphylactic shock"
  }
};

export function analyzeMessage(message) {
  message = message.toLowerCase();

  // Check for emergency keywords
  if (message.includes('emergency') || message.includes('dying') ||
      message.includes('unconscious') || message.includes('not breathing')) {
    return "🚨 EMERGENCY: Call emergency services immediately (911 or your local emergency number). " +
           "This situation requires immediate professional medical attention.";
  }

  // Analyze message for first aid topics
  const topics = [
    { keywords: ['bleeding', 'blood', 'cut'], topic: 'bleeding' },
    { keywords: ['burn', 'scalded', 'hot'], topic: 'burn' },
    { keywords: ['choking', "can't breathe", 'heimlich'], topic: 'choking' },
    { keywords: ['fracture', 'broken', 'bone'], topic: 'fracture' },
    { keywords: ['heat', 'exhaustion', 'overheated'], topic: 'heatExhaustion' },
    { keywords: ['allergic', 'reaction', 'swelling', 'breathing'], topic: 'anaphylaxis' },
    { keywords: ['shock', 'pale', 'weak'], topic: 'shock' },
    { keywords: ['nosebleed', 'nose bleed'], topic: 'noseBleed' },
    { keywords: ['poison', 'ingested'], topic: 'poisoning' },
    { keywords: ['seizure', 'convulsing'], topic: 'seizure' },
    { keywords: ['heart attack', 'chest pain', 'heart pain'], topic: 'heartAttack' },
    { keywords: ['stroke', 'drooping', 'speech'], topic: 'stroke' },
    { keywords: ['cold', 'freezing', 'hypothermia'], topic: 'hypothermia' },
    { keywords: ['heat stroke', 'overheating'], topic: 'heatStroke' },
    { keywords: ['snake bite', 'snake'], topic: 'snakeBite' },
    { keywords: ['concussion', 'head injury'], topic: 'concussion' },
    { keywords: ['electric shock', 'electrocution'], topic: 'electricShock' },
    { keywords: ['diabetes', 'sugar', 'diabetic'], topic: 'diabeticEmergency' },
    { keywords: ['drowning', 'water rescue'], topic: 'waterRescue' },
    { keywords: ['severe allergy', 'anaphylaxis'], topic: 'severeAllergicReaction' }
  ];

  for (const topicInfo of topics) {
    if (topicInfo.keywords.some(keyword => message.includes(keyword))) {
      return formatResponse(firstAidKnowledge[topicInfo.topic]);
    }
  }

  if (message.includes('help') || message.includes('hi') || message.includes('hello')) {
    return "Hello! I'm FirstAid.AI, your first aid assistant. " +
           "I can provide guidance for common first aid situations. " +
           "What kind of help do you need?";
  }

  return "I'm not sure about that specific situation. " +
         "Please try to describe the emergency or injury more specifically, " +
         "or in case of serious emergency, contact professional medical services immediately.";
}

function formatResponse(knowledge) {
  let response = "Here's what you should do:\n\n";
  knowledge.steps.forEach((step, index) => {
    response += `${index + 1}. ${step}\n`;
  });
  response += `\n⚠️ IMPORTANT: ${knowledge.warning}`;
  return response;
}

export default firstAidKnowledge;