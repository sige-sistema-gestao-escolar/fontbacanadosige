import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';

const ConfiguracoesGlobais = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // configurações padrão do sistema
  const defaultSettings = {
    sounds: true, // sons habilitados por padrão
    popups: true, // pop-ups de confirmação habilitados
    notifications: true // notificações habilitadas
  };
  
  // carrega configurações do localStorage
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('sige-global-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
    }
    return defaultSettings;
  };

  const [settings, setSettings] = useState(loadSettings);

  // salva configurações no localStorage
  const saveSettings = (newSettings) => {
    try {
      localStorage.setItem('sige-global-settings', JSON.stringify(newSettings));
    } catch (error) {
    }
  };

  // atualiza uma configuração específica
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
    applyGlobalSettings(newSettings);
  };

  // aplica configurações globalmente
  const applyGlobalSettings = (currentSettings) => {
    // atualiza funções globais baseadas nas configurações
    window.SIGE_SETTINGS = currentSettings;
    
    // atualiza sound manager
    soundManager.setEnabled(currentSettings.sounds);
    
  };

  // reseta configurações
  const resetSettings = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    applyGlobalSettings(defaultSettings);
  };

  // aplica configurações quando componente monta
  useEffect(() => {
    applyGlobalSettings(settings);
    
    // inicializa funções globais
    window.playSuccessSound = () => soundManager.playSound('success');
    window.playErrorSound = () => soundManager.playSound('error');
    window.playNotificationSound = () => soundManager.playSound('notification');
    
    // função para verificar se deve mostrar pop-ups
    window.shouldShowPopups = () => window.SIGE_SETTINGS?.popups ?? true;
    window.shouldPlaySounds = () => window.SIGE_SETTINGS?.sounds ?? true;
    window.shouldShowNotifications = () => window.SIGE_SETTINGS?.notifications ?? true;
  }, [settings]);

  return (
    <>
      {/* botão simples de configurações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Configurações do Sistema"
        title="Configurações do Sistema"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* painel moderno e simples */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-50 bg-white rounded-xl shadow-2xl p-6 w-80 border border-gray-100">
          <div className="space-y-6">
            {/* header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Configurações</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* opções */}
            <div className="space-y-4">
              {/* sons */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 6.75v10.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Sons</p>
                    <p className="text-sm text-gray-500">Feedback sonoro</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {settings.sounds && (
                    <button
                      onClick={() => soundManager.playSound('success')}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
                      title="Testar"
                    >
                      ▶
                    </button>
                  )}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.sounds}
                      onChange={(e) => updateSetting('sounds', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* confirmações */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Confirmações</p>
                    <p className="text-sm text-gray-500">Pop-ups antes de ações</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.popups}
                    onChange={(e) => updateSetting('popups', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* notificações */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19l5-5 5 5H4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Notificações</p>
                    <p className="text-sm text-gray-500">Mensagens na tela</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => updateSetting('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>

            {/* botão de reset */}
            <button
              onClick={resetSettings}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              Restaurar Padrões
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfiguracoesGlobais;
