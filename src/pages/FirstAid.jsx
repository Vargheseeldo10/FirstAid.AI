import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

function FirstAid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const firstAidGuides = {
    'Cuts and Wounds': [
      {
        title: 'Minor Cuts',
        steps: [
          'Clean your hands thoroughly with soap and water',
          'Clean the cut with mild soap and water',
          'Apply antibiotic ointment',
          'Cover with a sterile bandage'
        ],
        warning: 'Seek medical attention if the wound is deep, gaping, or shows signs of infection'
      },
      {
        title: 'Severe Bleeding',
        steps: [
          'Apply direct pressure with a clean cloth',
          'Keep the injured area elevated',
          'Apply a pressure bandage',
          'Call emergency services immediately'
        ],
        warning: 'This is a medical emergency - call for help right away'
      }
    ],
    'Burns': [
      {
        title: 'First-Degree Burns',
        steps: [
          'Cool the burn under cool (not cold) running water for 10-20 minutes',
          'Apply aloe vera gel or moisturizer',
          'Take pain reliever if needed',
          'Cover with a sterile gauze bandage'
        ],
        warning: 'Do not apply ice directly to a burn'
      },
      {
        title: 'Second-Degree Burns',
        steps: [
          'Run under cool water for 15-20 minutes',
          'Do not break blisters',
          'Cover loosely with sterile gauze',
          'Seek medical attention'
        ],
        warning: 'Never apply butter or oil to burns'
      }
    ],
    'CPR and Breathing': [
      {
        title: 'Adult CPR',
        steps: [
          'Check the scene is safe and call for emergency help',
          'Check for responsiveness and breathing',
          'Begin chest compressions (30 compressions at 100-120 bpm)',
          'Give 2 rescue breaths',
          'Continue cycles of 30 compressions and 2 breaths'
        ],
        warning: 'Proper CPR training is strongly recommended. This is only a basic guide.'
      },
      {
        title: 'Recovery Position',
        steps: [
          'Kneel beside the person and straighten their legs',
          'Place the arm nearest to you at a right angle to their body',
          'Place their other arm across their chest',
          'Roll them onto their side',
          'Tilt their head back to keep airway open'
        ],
        warning: 'Only use recovery position if the person is breathing normally'
      }
    ],
    'Choking': [
      {
        title: 'Conscious Adult/Child',
        steps: [
          'Give 5 back blows between shoulder blades',
          'Perform abdominal thrusts (Heimlich maneuver)',
          'Alternate between back blows and abdominal thrusts',
          'Continue until object is expelled or person becomes unconscious'
        ],
        warning: 'If person becomes unconscious, start CPR immediately and call emergency services'
      },
      {
        title: 'Infant Choking',
        steps: [
          'Support infant face down on your forearm',
          'Give 5 back blows between shoulder blades',
          'Turn infant face up and give 5 chest thrusts',
          'Continue alternating until object is expelled'
        ],
        warning: 'Seek immediate medical attention after any choking incident'
      }
    ],
    'Fractures and Sprains': [
      {
        title: 'Suspected Fracture',
        steps: [
          'Keep the injured area still',
          'Apply ice wrapped in cloth to reduce swelling',
          'Immobilize the area if possible',
          'Seek immediate medical attention'
        ],
        warning: 'Do not attempt to realign broken bones'
      },
      {
        title: 'Sprain Treatment',
        steps: [
          'Remember RICE: Rest, Ice, Compression, Elevation',
          'Apply ice for 20 minutes every 2-3 hours',
          'Use an elastic bandage for compression',
          'Keep the injured area elevated above heart level'
        ],
        warning: 'Seek medical attention if unable to bear weight or severe pain persists'
      }
    ],
    'Head Injuries': [
      {
        title: 'Concussion',
        steps: [
          'Stop any activity immediately',
          'Rest in a quiet, dark place',
          'Apply cold pack to swelling',
          'Monitor for worsening symptoms'
        ],
        warning: 'Seek immediate medical attention if unconscious or vomiting'
      },
      {
        title: 'Severe Head Trauma',
        steps: [
          'Call emergency services immediately',
          'Keep person still - do not move them',
          'Monitor breathing and consciousness',
          'Stop any bleeding with gentle pressure'
        ],
        warning: 'Do not remove any object penetrating the head'
      }
    ],
    'Poisoning': [
      {
        title: 'Swallowed Poison',
        steps: [
          'Call poison control center immediately',
          'Do not induce vomiting unless told to do so',
          'Save the container or substance',
          'Follow professional guidance exactly'
        ],
        warning: 'Never give anything by mouth unless instructed by professionals'
      },
      {
        title: 'Inhaled Poison',
        steps: [
          'Get to fresh air immediately',
          'Open windows and doors if inside',
          'Call emergency services',
          'Begin CPR if needed and you are trained'
        ],
        warning: 'Do not enter a contaminated area without proper protection'
      }
    ],
    'Heat-Related': [
      {
        title: 'Heat Exhaustion',
        steps: [
          'Move to a cool place',
          'Lie down and elevate feet slightly',
          'Remove excess clothing',
          'Sip cool water',
          'Apply cool, wet cloths to body'
        ],
        warning: 'If symptoms worsen, seek immediate medical attention'
      },
      {
        title: 'Heat Stroke',
        steps: [
          'Call emergency services immediately',
          'Move to a cool area',
          'Remove excess clothing',
          'Cool body with water or ice packs',
          'Monitor breathing and consciousness'
        ],
        warning: 'This is a life-threatening emergency requiring immediate medical attention'
      }
    ],
    'Cold-Related': [
      {
        title: 'Frostbite',
        steps: [
          'Get to a warm area',
          'Remove wet clothing',
          'Gradually warm affected areas',
          'Do not rub or massage frozen areas'
        ],
        warning: 'Do not use direct heat (fire, heating pad) on frostbitten areas'
      },
      {
        title: 'Hypothermia',
        steps: [
          'Call emergency services',
          'Move to warm area',
          'Remove wet clothing',
          'Warm core body first',
          'Give warm beverages if conscious'
        ],
        warning: 'Severe hypothermia requires immediate professional medical care'
      }
    ],
    'Allergic Reactions': [
      {
        title: 'Mild Allergic Reaction',
        steps: [
          'Remove exposure to allergen if possible',
          'Take antihistamine if available',
          'Apply cool compress to itchy areas',
          'Monitor for worsening symptoms'
        ],
        warning: 'Watch for signs of severe reaction (difficulty breathing, swelling)'
      },
      {
        title: 'Severe Allergic Reaction',
        steps: [
          'Use epinephrine auto-injector if available',
          'Call emergency services immediately',
          'Help person lie flat',
          'Monitor breathing and pulse'
        ],
        warning: 'Anaphylaxis is life-threatening - seek immediate medical care'
      }
    ],
    'Eye Injuries': [
      {
        title: 'Foreign Object',
        steps: [
          'Do not rub the eye',
          'Blink repeatedly to remove loose object',
          'Flush with clean water if needed',
          'Seek medical attention if object persists'
        ],
        warning: 'Do not attempt to remove embedded objects'
      },
      {
        title: 'Chemical Splash',
        steps: [
          'Flush eye immediately with clean water',
          'Continue flushing for 15-20 minutes',
          'Remove contact lenses if present',
          'Seek immediate medical attention'
        ],
        warning: 'Chemical eye injuries require immediate professional care'
      }
    ],
    'Seizures': [
      {
        title: 'During a Seizure',
        steps: [
          'Clear the area of harmful objects',
          'Protect head with something soft',
          'Turn person on their side if possible',
          'Time the seizure',
          'Never put anything in their mouth'
        ],
        warning: 'Call emergency services if seizure lasts more than 5 minutes'
      }
    ],
    'Dental Emergencies': [
      {
        title: 'Knocked Out Tooth',
        steps: [
          'Handle tooth by crown, not root',
          'Rinse tooth gently if dirty',
          'Try to reinsert in socket if possible',
          'If not possible, keep tooth in milk',
          'See dentist immediately'
        ],
        warning: 'Time is critical - seek dental care within 30 minutes if possible'
      }
    ],
    'Stings and Bites': [
      {
        title: 'Insect Stings',
        steps: [
          'Remove stinger if present',
          'Clean area with soap and water',
          'Apply cold compress',
          'Take antihistamine if needed'
        ],
        warning: 'Watch for signs of severe allergic reaction'
      },
      {
        title: 'Snake Bite',
        steps: [
          'Keep victim calm and still',
          'Remove constricting items',
          'Mark time of bite and symptoms',
          'Seek immediate medical attention'
        ],
        warning: 'Do not attempt to suck out venom or apply tourniquet'
      }
    ],
    'Drowning': [
      {
        title: 'Near-Drowning',
        steps: [
          'Remove from water if safe to do so',
          'Check breathing and circulation',
          'Begin CPR if necessary',
          'Call emergency services'
        ],
        warning: 'All near-drowning victims need medical evaluation'
      }
    ],
    'Electrical Injuries': [
      {
        title: 'Electrical Shock',
        steps: [
          'Do not touch person until power source is off',
          'Check breathing and pulse',
          'Cover burns with sterile dressing',
          'Seek immediate medical attention'
        ],
        warning: 'Always assume power lines are live'
      }
    ]
  };

  const filteredGuides = Object.entries(firstAidGuides).reduce((acc, [category, guides]) => {
    const matchingGuides = guides.filter(guide =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matchingGuides.length > 0) {
      acc[category] = matchingGuides;
    }
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">First Aid Guide</h1>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-red-700">Emergency Warning</p>
              <p className="text-red-600">
                This guide is for informational purposes only. In case of a medical emergency,
                immediately call your local emergency services or visit the nearest hospital.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search first aid guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>

        <div className="space-y-4">
          {Object.entries(filteredGuides).map(([category, guides]) => (
            <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h2 className="text-xl font-semibold text-gray-800">{category}</h2>
                {expandedCategory === category ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </button>
              
              {expandedCategory === category && (
                <div className="p-6 space-y-6">
                  {guides.map((guide, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">{guide.title}</h3>
                      <ol className="list-decimal pl-6 space-y-2 mb-4">
                        {guide.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-gray-700">{step}</li>
                        ))}
                      </ol>
                      {guide.warning && (
                        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <div className="flex">
                            <AlertCircle className="text-yellow-400 mr-2 flex-shrink-0" />
                            <p className="text-sm text-yellow-700">{guide.warning}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FirstAid;