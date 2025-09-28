import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';

const Acessibilidade = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [voices, setVoices] = useState([]);
  const [hoverReadEnabled, setHoverReadEnabled] = useState(() => {
    return localStorage.getItem("hoverRead") === "true";
  });
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      fontSize: 'normal',
      contrast: 'normal',
      colorBlind: 'normal',
      animations: true
    };

    try {
      const savedSettings = localStorage.getItem('sige-accessibility-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
    }
    return defaultSettings;
  });

  const updateSetting = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('sige-accessibility-settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const toggleHoverRead = () => {
    const newVal = !hoverReadEnabled;
    setHoverReadEnabled(newVal);
    localStorage.setItem("hoverRead", newVal.toString());
    if (!newVal) {
      window.speechSynthesis.cancel();
    }
  };

  const resetSettings = () => {
    localStorage.removeItem('sige-accessibility-settings');
    localStorage.removeItem('hoverRead');
    setSettings({
      fontSize: 'normal',
      contrast: 'normal',
      colorBlind: 'normal',
      animations: true
    });
    setHoverReadEnabled(false);
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    function loadVoices() {
      setVoices(window.speechSynthesis.getVoices());
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    if (!hoverReadEnabled) return;

    const handleMouseOver = (e) => {
      if (e.target && e.target.innerText && e.target.innerText.trim()) {
        const text = e.target.innerText.trim();
        if (text.length > 200) {
          return; // Limita a 200 caracteres
        }

        // Verifica se é um elemento de texto válido
        const validElements = ['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LABEL', 'BUTTON', 'A', 'TD', 'TH', 'LI'];
        if (!validElements.includes(e.target.tagName)) {
          return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        const ptBRVoice = voices.find((v) => v.lang === "pt-BR");
        if (ptBRVoice) {
          utterance.voice = ptBRVoice;
        } else {
          const ptVoice = voices.find((v) => v.lang.startsWith("pt"));
          if (ptVoice) {
            utterance.voice = ptVoice;
          }
        }
        
        utterance.lang = "pt-BR";
        window.speechSynthesis.speak(utterance);
      }
    };

    const handleMouseOut = () => {
      window.speechSynthesis.cancel();
    };

    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
      window.speechSynthesis.cancel();
    };
  }, [hoverReadEnabled, voices]);

  const applyAccessibilitySettings = () => {
    // aplicar configurações de fonte
    document.body.classList.remove('font-normal', 'font-large', 'font-larger', 'font-largest');
    document.body.classList.add(`font-${settings.fontSize}`);

    // aplicar configurações de contraste
    document.body.classList.remove('contrast-normal', 'contrast-high');
    document.body.classList.add(`contrast-${settings.contrast}`);

    // aplicar configurações de daltonismo
    document.body.classList.remove('colorblind-normal', 'colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia');
    document.body.classList.add(`colorblind-${settings.colorBlind}`);

    // aplicar configurações de animação
    if (settings.animations) {
      document.body.classList.remove('no-animations');
    } else {
      document.body.classList.add('no-animations');
    }
  };

  useEffect(() => {
    applyAccessibilitySettings();
  }, [settings]);

  useEffect(() => {
    // expor funções de som globalmente para uso em outros componentes
    window.playSuccessSound = () => soundManager.playSound('success');
    window.playErrorSound = () => soundManager.playSound('error');
    window.playNotificationSound = () => soundManager.playSound('notification');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.accessibility-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="accessibility-container fixed right-0 top-[15vh] z-[9998]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-l-lg shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Abrir menu de acessibilidade"
          title="Acessibilidade"
        >
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-0 h-[85vh] max-h-[600px] w-96 bg-white shadow-2xl border-l border-gray-200 z-[9997] transform transition-all duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex-shrink-0 p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Acessibilidade</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                    aria-label="Fechar menu de acessibilidade"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                <div className="p-6">
                  <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <label className="font-medium text-gray-800">Tamanho do Texto</label>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'normal', label: 'A', desc: 'Normal' },
                      { value: 'large', label: 'A+', desc: 'Grande' },
                      { value: 'larger', label: 'A++', desc: 'Maior' },
                      { value: 'largest', label: 'A+++', desc: 'Gigante' }
                    ].map((size) => (
                      <button
                        key={size.value}
                        onClick={() => updateSetting('fontSize', size.value)}
                        className={`py-3 px-2 rounded-lg text-sm font-bold transition-colors ${
                          settings.fontSize === size.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        title={size.desc}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    <label className="font-medium text-gray-800">Contraste</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'normal', label: 'Normal' },
                      { value: 'high', label: 'Alto' }
                    ].map((contrast) => (
                      <button
                        key={contrast.value}
                        onClick={() => updateSetting('contrast', contrast.value)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                          settings.contrast === contrast.value
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {contrast.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <label className="font-medium text-gray-800">Visão de Cores</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'normal', label: 'Normal' },
                      { value: 'protanopia', label: 'Protanopia' },
                      { value: 'deuteranopia', label: 'Deuteranopia' },
                      { value: 'tritanopia', label: 'Tritanopia' }
                    ].map((colorBlind) => (
                      <button
                        key={colorBlind.value}
                        onClick={() => updateSetting('colorBlind', colorBlind.value)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                          settings.colorBlind === colorBlind.value
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {colorBlind.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Leitura ao Passar o Mouse</p>
                      <p className="text-sm text-gray-500">Lê texto ao passar o mouse</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hoverReadEnabled}
                      onChange={toggleHoverRead}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Animações</p>
                      <p className="text-sm text-gray-500">Efeitos visuais</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.animations}
                      onChange={(e) => updateSetting('animations', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                    <button
                      onClick={resetSettings}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
                    >
                      Restaurar Padrões
                    </button>
                    
                    <div className="pb-6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Acessibilidade;
