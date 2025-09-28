import React from 'react';

const PopupConfirmacao = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmação', 
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'default' // default, warning, danger, success
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch(type) {
      case 'warning':
        return {
          icon: '⚠️',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600'
        };
      case 'danger':
        return {
          icon: '🗑️',
          confirmButton: 'bg-red-600 hover:bg-red-700',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600'
        };
      case 'success':
        return {
          icon: '✅',
          confirmButton: 'bg-green-600 hover:bg-green-700',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        };
      default:
        return {
          icon: '❓',
          confirmButton: 'bg-blue-600 hover:bg-blue-700',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
    }
  };

  const styles = getTypeStyles();

  const handleConfirm = () => {
    // toca som baseado no tipo
    if (window.shouldPlaySounds && window.shouldPlaySounds()) {
      switch(type) {
        case 'danger':
          window.playErrorSound && window.playErrorSound();
          break;
        case 'success':
          window.playSuccessSound && window.playSuccessSound();
          break;
        default:
          window.playNotificationSound && window.playNotificationSound();
      }
    }
    
    onConfirm();
  };

  const handleCancel = () => {
    // toca som de notificação para cancelamento
    if (window.shouldPlaySounds && window.shouldPlaySounds()) {
      window.playNotificationSound && window.playNotificationSound();
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-200">
        <div className="p-6">
          {/* header com ícone */}
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-full ${styles.iconBg} mr-4`}>
              <span className="text-2xl">{styles.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>

          {/* mensagem */}
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

          {/* botões */}
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupConfirmacao;
