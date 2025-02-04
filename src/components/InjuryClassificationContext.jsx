import React, { createContext, useContext } from 'react';

export const InjuryClassificationContext = createContext();

export const INJURY_CLASSIFICATIONS = {
  0: {
    id: 0,
    label: 'No Injury',
    severity: 'low',
    color: 'green',
    precautions: [
      'No immediate action required',
      'Monitor for any changes'
    ],
    description: 'No visible signs of injury detected.'
  },
  1: {
    id: 1,
    label: 'Minor Wound',
    severity: 'low',
    color: 'yellow',
    precautions: [
      'Clean wound with mild antiseptic',
      'Apply sterile bandage',
      'Keep wound dry',
      'Change bandage daily'
    ],
    description: 'Small superficial injury requiring basic first aid.'
  },
  2: {
    id: 2,
    label: 'Moderate Injury',
    severity: 'medium',
    color: 'orange',
    precautions: [
      'Clean thoroughly with antiseptic',
      'Control bleeding',
      'Apply pressure bandage',
      'Seek medical consultation',
      'Consider tetanus shot'
    ],
    description: 'Significant wound that may require professional medical assessment.'
  },
  3: {
    id: 3,
    label: 'Severe Injury',
    severity: 'high',
    color: 'red',
    precautions: [
      'Call emergency services immediately',
      'Do not move if serious injury suspected',
      'Apply direct pressure to wound',
      'Prevent patient from going into shock',
      'Keep patient warm and still'
    ],
    description: 'Critical injury requiring immediate professional medical intervention.'
  }
};

export const InjuryClassificationProvider = ({ children }) => {
  const getInjuryClassification = (predictionIndex) => {
    return INJURY_CLASSIFICATIONS[predictionIndex] || INJURY_CLASSIFICATIONS[0];
  };

  return (
    <InjuryClassificationContext.Provider 
      value={{ 
        getInjuryClassification, 
        INJURY_CLASSIFICATIONS 
      }}
    >
      {children}
    </InjuryClassificationContext.Provider>
  );
};

export const useInjuryClassification = () => {
  const context = useContext(InjuryClassificationContext);
  if (!context) {
    throw new Error('useInjuryClassification must be used within an InjuryClassificationProvider');
  }
  return context;
};