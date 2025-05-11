export class AudioManager {
    constructor() {
        this.backgroundMusic = null;
        this.transitionSound = null;
        this.audioEnabled = false;
        try {
            this.backgroundMusic = new Audio('/asset/background.mp3');
           // this.transitionSound = new Audio('/asset/transition.mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = 0.0;
            this.transitionSound.volume = 0.5;
            this.audioEnabled = true;
        } catch (error) {
            console.warn('Audio non disponibile:', error);
            this.audioEnabled = false;
        }
    }

    async playBackgroundMusicWithFadeIn(targetVol = 0.5, fadeMs = 1200) {
        if (!this.audioEnabled) return;
        try {
            await this.backgroundMusic.play();
            this.fadeIn(targetVol, fadeMs);
        } catch (error) {
            // Most browsers require a user gesture for first sound,
            // so you might still see this warning unless the user has interacted
            console.warn('Errore nella riproduzione della musica:', error);
        }
    }

    fadeIn(targetVol = 0.5, duration = 1000) {
        if (!this.audioEnabled) return;
        const steps = 25;
        const stepTime = duration / steps;
        let currentStep = 0;
        const startVol = this.backgroundMusic.volume;
        const volDiff = targetVol - startVol;
        const fade = () => {
            currentStep++;
            const prog = currentStep / steps;
            this.backgroundMusic.volume = startVol + volDiff * prog;
            if (currentStep < steps) {
                setTimeout(fade, stepTime);
            } else {
                this.backgroundMusic.volume = targetVol;
            }
        };
        fade();
    }

    playTransitionSound() {
        if (!this.audioEnabled) return;
        this.transitionSound.currentTime = 0;
        this.transitionSound.play().catch(error => {
            console.warn('Errore nella riproduzione dell\'effetto sonoro:', error);
        });
    }

    stopBackgroundMusic() {
        if (!this.audioEnabled) return;
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }
}
