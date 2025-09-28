// gerenciador de sons do sistema
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true; // habilitado por padrão
    this.initAudioContext();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
    }
  }

  // cria som sintético de sucesso (tom agradável)
  createSuccessSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // frequências agradáveis para sucesso
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // cria som sintético de erro (tom grave)
  createErrorSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // frequência grave para erro
    oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
    oscillator.frequency.setValueAtTime(196, this.audioContext.currentTime + 0.15); // G3

    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01);
    gainNode.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.4);
  }

  // cria som sintético de notificação (tom neutro)
  createNotificationSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // tom neutro para notificação
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime + 0.1); // C5

    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.01);
    gainNode.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.25);
  }

  // função principal para tocar sons
  playSound(type) {
    // verifica se sons estão habilitados
    if (!this.enabled) return;

    // resume audio context se necessário
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    switch(type) {
      case 'success':
        this.createSuccessSound();
        break;
      case 'error':
        this.createErrorSound();
        break;
      case 'notification':
        this.createNotificationSound();
        break;
      default:
    }
  }
}

// instância global
const soundManager = new SoundManager();

// funções globais para uso em outros componentes
window.playSuccessSound = () => soundManager.playSound('success');
window.playErrorSound = () => soundManager.playSound('error');
window.playNotificationSound = () => soundManager.playSound('notification');

export default soundManager;
