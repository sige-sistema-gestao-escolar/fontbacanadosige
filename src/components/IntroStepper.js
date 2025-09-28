import React, { useState } from 'react';
import Stepper, { Step } from './Stepper';

export default function IntroStepper({ onComplete }) {
  const [showStepper, setShowStepper] = useState(true);

  const handleComplete = () => {
    setShowStepper(false);
    onComplete();
  };

  if (!showStepper) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <Stepper
        initialStep={1}
        onFinalStepCompleted={handleComplete}
        nextButtonText="Continuar"
      >
          <Step>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Seja bem-vindo ao SIGE
              </h2>
              <p className="text-slate-300">
                Sistema de Gestão Educacional
              </p>
            </div>
          </Step>

          <Step>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Como acessar o sistema
              </h2>
              <p className="text-slate-300">
                Para acessar o site, peça suas credenciais de login ao administrador
              </p>
            </div>
          </Step>

          <Step>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Acessibilidade
              </h2>
              <div className="flex items-center justify-center mb-4">
                <span className="text-slate-300 mr-2">Ao lado temos a opção de acessibilidade</span>
                <span className="text-2xl">👉</span>
              </div>
              <p className="text-slate-300">
                Caso tenha alguma deficiência, basta clicar nela para ter mais opções
              </p>
            </div>
           </Step>
         </Stepper>
     </div>
   );
}
