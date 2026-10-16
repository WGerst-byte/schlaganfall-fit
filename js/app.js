/**
 * SchlaganfallFit - Hauptanwendung (Application Controller)
 * 
 * Barrierefreier Begleiter nach dem Schlaganfall.
 * Beinhaltet:
 * - Onboarding (Ersteinrichtung mit 4 einfachen Bildkarten)
 * - Personalisierter Tagesplan & adaptive Textanpassung ({BETROFFENE_SEITE})
 * - Geführter Vollbild-Übungsplayer mit Countdown, Signalton & Sprachausgabe
 * - Angehörigen-Modus mit Sicherheits- und Griffhinweisen
 * - Kopf-Training (Gedächtnis- & Konzentrationsspiele ohne Zeitdruck)
 * - Schmerztagebuch mit Verlauf & Druckansicht
 * - Vollständige Offline-Fähigkeit via localStorage
 */

class SchlaganfallApp {
    constructor() {
        this.currentTab = 'start';
        this.profile = this.loadProfile();
        this.diary = this.loadDiary();
        this.ratings = this.loadRatings();

        // Aktives Training
        this.workout = {
            playlist: [],
            currentIndex: 0,
            stepIndex: 0,
            timer: null,
            secondsLeft: 0,
            totalSeconds: 0,
            isPaused: false,
            phase: 'idle' // 'exercise', 'hold', 'pause', 'feedback', 'summary'
        };

        // Kopf-Training Zustand
        this.brainGameState = {
            activeGame: 'numbers', // 'numbers', 'shapes', 'memory'
            numbersCurrentTarget: 1,
            numbersList: [1, 2, 3, 4],
            shapeTarget: null,
            memoryCards: [],
            memoryFlipped: [],
            memoryMatched: []
        };

        this.init();
    }

    // =========================================================================
    // INITIALISIERUNG
    // =========================================================================
    init() {
        // Barrierefreiheit-Einstellungen anwenden
        this.applyAccessibilitySettings();

        // Prüfen, ob Ersteinrichtung abgeschlossen ist
        if (!this.profile || !this.profile.side) {
            this.openOnboardingModal();
        } else {
            this.renderAll();
        }

        this.setupEventListeners();
    }

    /**
     * Lädt das Benutzerprofil aus dem localStorage
     */
    loadProfile() {
        try {
            const data = localStorage.getItem('schlaganfall_profile');
            return data ? JSON.parse(data) : {
                side: null, // 'links', 'rechts', 'beide', 'unbekannt'
                standing: 0, // 0 = gar nicht, 1 = mit Hilfe, 2 = sicher
                arm: 1, // 0 = gar nicht, 1 = ein wenig, 2 = gut
                caregiver: 'allein',
                caregiverMode: false,
                fontSize: 'normal',
                highContrast: false,
                ttsSpeed: 0.8
            };
        } catch (e) {
            return { side: null, standing: 0, arm: 1, caregiver: 'allein', caregiverMode: false, fontSize: 'normal', highContrast: false, ttsSpeed: 0.8 };
        }
    }

    /**
     * Speichert das Profil
     */
    saveProfile() {
        localStorage.setItem('schlaganfall_profile', JSON.stringify(this.profile));
    }

    /**
     * Lädt das Tagebuch
     */
    loadDiary() {
        try {
            const data = localStorage.getItem('schlaganfall_diary');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Speichert das Tagebuch
     */
    saveDiary() {
        localStorage.setItem('schlaganfall_diary', JSON.stringify(this.diary));
    }

    /**
     * Lädt Bewertungen der Übungen
     */
    loadRatings() {
        try {
            const data = localStorage.getItem('schlaganfall_ratings');
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }

    /**
     * Speichert Bewertungen
     */
    saveRatings() {
        localStorage.setItem('schlaganfall_ratings', JSON.stringify(this.ratings));
    }

    // =========================================================================
    // BARRIEREFREIHEIT & EINSTELLUNGEN
    // =========================================================================
    applyAccessibilitySettings() {
        // Schriftgröße
        const root = document.documentElement;
        root.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
        root.classList.add(`font-size-${this.profile.fontSize || 'normal'}`);

        // Hoher Kontrast
        document.body.classList.toggle('high-contrast', !!this.profile.highContrast);

        // Angehörigen-Modus Klasse
        document.body.classList.toggle('caregiver-active', !!this.profile.caregiverMode);

        // TTS Geschwindigkeit
        if (window.appAudio) {
            appAudio.setSpeechRate(this.profile.ttsSpeed || 0.8);
        }

        // Tasten-Zustände im UI aktualisieren
        this.updateHeaderToolbarUI();
    }

    setFontSize(size) {
        this.profile.fontSize = size;
        this.saveProfile();
        this.applyAccessibilitySettings();
    }

    toggleHighContrast() {
        this.profile.highContrast = !this.profile.highContrast;
        this.saveProfile();
        this.applyAccessibilitySettings();
    }

    toggleCaregiverMode() {
        this.profile.caregiverMode = !this.profile.caregiverMode;
        this.saveProfile();
        this.applyAccessibilitySettings();
        this.renderAll();
    }

    setTtsSpeed(speed) {
        this.profile.ttsSpeed = speed;
        this.saveProfile();
        this.applyAccessibilitySettings();
    }

    updateHeaderToolbarUI() {
        // Schriftgrößen-Buttons markieren
        ['normal', 'large', 'xlarge'].forEach(s => {
            const btn = document.getElementById(`btn-font-${s}`);
            if (btn) {
                const isActive = (this.profile.fontSize || 'normal') === s;
                btn.classList.toggle('bg-blue-600', isActive);
                btn.classList.toggle('text-white', isActive);
                btn.classList.toggle('bg-slate-100', !isActive);
                btn.classList.toggle('text-slate-700', !isActive);
            }
        });

        // Kontrast-Button
        const contrastBtn = document.getElementById('contrast-toggle-btn');
        if (contrastBtn) {
            contrastBtn.classList.toggle('bg-yellow-400', !!this.profile.highContrast);
            contrastBtn.classList.toggle('text-black', !!this.profile.highContrast);
        }

        // Angehörigen-Schalter
        const careSwitch = document.getElementById('caregiver-mode-toggle');
        if (careSwitch) {
            careSwitch.checked = !!this.profile.caregiverMode;
        }
    }

    // =========================================================================
    // TEXT-ANPASSUNG NACH BETROFFENER SEITE
    // =========================================================================
    formatExerciseText(text) {
        if (!text) return '';
        let sideReplacement = 'betroffene';
        if (this.profile.side === 'links') sideReplacement = 'linke';
        else if (this.profile.side === 'rechts') sideReplacement = 'rechte';
        else if (this.profile.side === 'beide') sideReplacement = 'beide';

        return text.replace(/{BETROFFENE_SEITE}/g, sideReplacement);
    }

    // =========================================================================
    // NAVIGATION / TABS
    // =========================================================================
    switchTab(tabId) {
        this.currentTab = tabId;

        // Sprachausgabe bei Reiterwechsel stoppen
        if (window.appAudio) {
            appAudio.stopSpeaking();
        }

        // Tab-Inhalte umschalten
        document.querySelectorAll('.tab-content').forEach(el => {
            el.classList.toggle('hidden', el.id !== `tab-${tabId}`);
        });

        // Desktop & Mobile Navigation Buttons stylen
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            const isActive = btn.dataset.tab === tabId;
            btn.classList.toggle('active', isActive);
            btn.classList.toggle('bg-blue-600', isActive);
            btn.classList.toggle('text-white', isActive);
            btn.classList.toggle('text-slate-700', !isActive);
            btn.classList.toggle('bg-slate-100', !isActive && !btn.classList.contains('mobile-nav-btn'));
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Spezifische Tabs bei Aufruf frisch rendern
        if (tabId === 'diary') {
            this.renderDiary();
        } else if (tabId === 'brain') {
            this.initBrainGame();
        }
    }

    // =========================================================================
    // GESAMT-RENDERING
    // =========================================================================
    renderAll() {
        this.renderStartTab();
        this.renderExerciseTabs();
        this.renderFaq();
        this.renderDiary();
    }

    // =========================================================================
    // TAB 1: STARTSEITE
    // =========================================================================
    renderStartTab() {
        // Begrüßung & Profil-Zusammenfassung
        const sideText = this.profile.side === 'links' ? 'Linke Körperseite' :
                         this.profile.side === 'rechts' ? 'Rechte Körperseite' :
                         this.profile.side === 'beide' ? 'Beide Körperseiten' : 'Allgemeines Training';
        
        const sideEl = document.getElementById('user-profile-badge');
        if (sideEl) {
            sideEl.textContent = sideText;
        }

        // Personalisierter Tagesplan generieren
        const dailyExercises = this.getPersonalizedDailyPlan();
        const planContainer = document.getElementById('daily-plan-list');
        if (planContainer) {
            planContainer.innerHTML = dailyExercises.map((ex, idx) => `
                <div class="flex items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border-2 border-slate-200/80 hover:border-blue-300 transition-all shadow-xs">
                    <div class="flex items-center gap-4">
                        <span class="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-lg">
                            ${idx + 1}
                        </span>
                        <div>
                            <span class="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                                ${ex.bereichLabel}
                            </span>
                            <h3 class="text-lg font-bold text-slate-900 leading-tight">
                                ${this.formatExerciseText(ex.titel)}
                            </h3>
                            <p class="text-sm text-slate-500 mt-0.5">
                                Position: ${ex.position === 'sitzen' ? '🪑 Im Sitzen' : '🧍 Im Stehen mit Halt'} | ${ex.wiederholungen} Wdh.
                            </p>
                        </div>
                    </div>
                    <button onclick="app.startWorkout([EXERCISES.find(e => e.id === '${ex.id}')])" class="btn-touch px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-base font-bold transition-colors">
                        ▶ Starten
                    </button>
                </div>
            `).join('');
        }

        // Wochenfortschritt berechnen
        this.renderWeeklyStreak();
    }

    /**
     * Erstellt einen sicheren, auf das Onboarding zugeschnittenen Tagesplan
     */
    getPersonalizedDailyPlan() {
        // Arm-Übung passend zur Mobilität wählen
        const armExercises = EXERCISES.filter(ex => ex.bereich === 'arm-hand' && ex.minArmMobility <= this.profile.arm);
        const armEx = armExercises[0] || EXERCISES[0];

        // Bein-Übung: Wenn Stehen unsicher -> nur Übungen im Sitzen!
        const legExercises = EXERCISES.filter(ex => ex.bereich === 'legs-balance' && ex.minStanding <= this.profile.standing);
        const legEx = legExercises[0] || EXERCISES[6];

        // Gesicht / Sprechen: Immer machbar und enorm wichtig
        const faceExercises = EXERCISES.filter(ex => ex.bereich === 'face-speech');
        const faceEx = faceExercises[0] || EXERCISES[12];

        return [armEx, legEx, faceEx];
    }

    renderWeeklyStreak() {
        const streakContainer = document.getElementById('weekly-streak-container');
        if (!streakContainer) return;

        // Wochentage Mo-So
        const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        const todayIdx = (new Date().getDay() + 6) % 7; // Montag = 0

        // Prüfen, welche Tage im Tagebuch Einträge haben
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - todayIdx);
        startOfWeek.setHours(0, 0, 0, 0);

        streakContainer.innerHTML = days.map((day, idx) => {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + idx);
            const dateStr = dayDate.toISOString().slice(0, 10);
            const hasTrained = this.diary.some(d => d.date === dateStr);
            const isToday = idx === todayIdx;

            return `
                <div class="flex flex-col items-center gap-1.5 p-3 rounded-2xl ${isToday ? 'bg-blue-50 border-2 border-blue-400' : 'bg-slate-50 border border-slate-200'}">
                    <span class="text-xs font-bold ${isToday ? 'text-blue-700 font-extrabold' : 'text-slate-600'}">${day}</span>
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl ${hasTrained ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-400'}">
                        ${hasTrained ? '★' : '○'}
                    </div>
                </div>
            `;
        }).join('');
    }

    // =========================================================================
    // ÜBUNGS-KARTEN RENDERN (REITER 2, 3, 4)
    // =========================================================================
    renderExerciseTabs() {
        const armContainer = document.getElementById('arm-exercises-grid');
        const legsContainer = document.getElementById('legs-exercises-grid');
        const faceContainer = document.getElementById('face-exercises-grid');

        if (armContainer) {
            armContainer.innerHTML = EXERCISES.filter(e => e.bereich === 'arm-hand')
                .map(ex => this.createExerciseCardHtml(ex)).join('');
        }
        if (legsContainer) {
            legsContainer.innerHTML = EXERCISES.filter(e => e.bereich === 'legs-balance')
                .map(ex => this.createExerciseCardHtml(ex)).join('');
        }
        if (faceContainer) {
            faceContainer.innerHTML = EXERCISES.filter(e => e.bereich === 'face-speech')
                .map(ex => this.createExerciseCardHtml(ex)).join('');
        }
    }

    createExerciseCardHtml(ex) {
        // Barriere-Prüfung: Ist Übung für das Profil zu schwierig?
        const isTooDifficult = (ex.minStanding > this.profile.standing) || (ex.minArmMobility > this.profile.arm);
        const rating = this.ratings[ex.id];

        return `
            <div class="bg-white rounded-3xl p-6 border-2 ${isTooDifficult ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200/80'} shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all">
                <div>
                    <!-- Badges -->
                    <div class="flex items-center justify-between gap-2 mb-4">
                        <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            ${ex.position === 'sitzen' ? '🪑 Im Sitzen' : '🧍 Im Stehen mit Halt'}
                        </span>
                        <div class="flex items-center gap-1.5">
                            ${rating ? `<span class="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">Feedback: ${rating === 'easy' ? '😊 Leicht' : rating === 'good' ? '😐 Passt' : '😣 Schwer'}</span>` : ''}
                            <span class="text-xs font-bold px-2.5 py-1 rounded-md ${ex.schwierigkeit === 1 ? 'bg-emerald-100 text-emerald-800' : ex.schwierigkeit === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}">
                                ${ex.schwierigkeit === 1 ? 'Leicht' : ex.schwierigkeit === 2 ? 'Mittel' : 'Anspruchsvoll'}
                            </span>
                        </div>
                    </div>

                    <!-- Piktogramm -->
                    <div class="pictogram-box mb-4">
                        ${ex.svg_piktogramm}
                    </div>

                    <h3 class="text-xl font-extrabold text-slate-900 mb-2 leading-snug">
                        ${this.formatExerciseText(ex.titel)}
                    </h3>

                    <p class="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                        ${this.formatExerciseText(ex.kurzbeschreibung)}
                    </p>

                    <!-- Angehörigen-Tipp (wird durch Angehörigen-Modus hervorgehoben) -->
                    <div class="caregiver-info p-3.5 rounded-2xl mb-4 text-xs sm:text-sm text-purple-900 leading-relaxed ${this.profile.caregiverMode ? 'block ring-2 ring-purple-400' : 'hidden'}">
                        <strong>💡 Angehörigen-Tipp:</strong> ${ex.tipp_fuer_angehoerige}
                    </div>
                </div>

                <!-- Tastenleiste -->
                <div class="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <button onclick="app.startWorkout([EXERCISES.find(e => e.id === '${ex.id}')])" class="flex-1 btn-touch bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-base font-bold shadow-md shadow-blue-600/20">
                        ▶ Jetzt üben
                    </button>
                    <button onclick="appAudio.speak('${this.formatExerciseText(ex.titel)}. ${this.formatExerciseText(ex.kurzbeschreibung)}')" class="btn-touch p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl" title="Vorlesen">
                        🔊
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Startet alle Übungen eines Bereichs nacheinander
     */
    startCategoryWorkout(categoryId) {
        const list = EXERCISES.filter(e => e.bereich === categoryId);
        if (list.length > 0) {
            this.startWorkout(list);
        }
    }

    // =========================================================================
    // GEFÜHRTER ÜBUNGS-PLAYER (VOLLBILD-MODAL)
    // =========================================================================
    startWorkout(exercises) {
        if (!exercises || exercises.length === 0) return;

        this.workout.playlist = exercises;
        this.workout.currentIndex = 0;
        this.workout.stepIndex = 0;
        this.workout.isPaused = false;
        this.workout.phase = 'exercise';

        const modal = document.getElementById('exercise-player-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        this.loadCurrentWorkoutStep();
    }

    closeWorkout() {
        this.clearWorkoutTimer();
        if (window.appAudio) {
            appAudio.stopSpeaking();
        }

        const modal = document.getElementById('exercise-player-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    clearWorkoutTimer() {
        if (this.workout.timer) {
            clearInterval(this.workout.timer);
            this.workout.timer = null;
        }
    }

    loadCurrentWorkoutStep() {
        this.clearWorkoutTimer();

        const currentEx = this.workout.playlist[this.workout.currentIndex];
        if (!currentEx) {
            this.showWorkoutSummary();
            return;
        }

        const steps = currentEx.schritte;
        const totalSteps = steps.length;
        const currentStepText = this.formatExerciseText(steps[this.workout.stepIndex]);

        // Titel & Meta
        document.getElementById('player-exercise-title').textContent = this.formatExerciseText(currentEx.titel);
        document.getElementById('player-counter').textContent = `Übung ${this.workout.currentIndex + 1} von ${this.workout.playlist.length}`;
        document.getElementById('player-step-counter').textContent = `Schritt ${this.workout.stepIndex + 1} von ${totalSteps}`;

        // Piktogramm aktualisieren
        document.getElementById('player-pictogram').innerHTML = currentEx.svg_piktogramm;

        // Schritt-Text
        const stepTextEl = document.getElementById('player-instruction-text');
        stepTextEl.textContent = currentStepText;

        // Angehörigen-Tipp im Player
        const careBox = document.getElementById('player-caregiver-box');
        if (careBox) {
            if (this.profile.caregiverMode && currentEx.tipp_fuer_angehoerige) {
                careBox.classList.remove('hidden');
                document.getElementById('player-caregiver-text').textContent = currentEx.tipp_fuer_angehoerige;
            } else {
                careBox.classList.add('hidden');
            }
        }

        // Sicherheitshinweis anzeigen
        const safetyEl = document.getElementById('player-safety-text');
        if (safetyEl) {
            safetyEl.textContent = currentEx.sicherheitshinweis || '';
        }

        // Timer zurücksetzen & starten falls Haltezeit aktiv
        this.workout.secondsLeft = currentEx.haltezeit_sek || 5;
        this.workout.totalSeconds = this.workout.secondsLeft;
        this.updateTimerCircle(this.workout.secondsLeft, this.workout.totalSeconds);

        // Sanfter Schritt-Ton
        if (window.appAudio) {
            appAudio.playStepChime();
            // Automatische Vorlesefunktion für Seh-/Verständnisunterstützung
            appAudio.speak(currentStepText);
        }

        // Timer starten
        this.startStepCountdown();
    }

    startStepCountdown() {
        this.clearWorkoutTimer();
        this.workout.isPaused = false;
        this.updatePauseButtonUI();

        this.workout.timer = setInterval(() => {
            if (!this.workout.isPaused) {
                this.workout.secondsLeft--;
                this.updateTimerCircle(this.workout.secondsLeft, this.workout.totalSeconds);

                if (this.workout.secondsLeft <= 0) {
                    this.clearWorkoutTimer();
                    if (window.appAudio) {
                        appAudio.playTone(659.25, 0.2); // E5 Gong
                    }
                }
            }
        }, 1000);
    }

    updateTimerCircle(secondsLeft, total) {
        const timeEl = document.getElementById('player-timer-text');
        if (timeEl) {
            timeEl.textContent = Math.max(0, secondsLeft) + 's';
        }

        const circle = document.getElementById('player-timer-progress');
        if (circle) {
            const radius = 54;
            const circumference = 2 * Math.PI * radius; // ca. 339.29
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            const percent = total > 0 ? (secondsLeft / total) : 0;
            const offset = circumference - (percent * circumference);
            circle.style.strokeDashoffset = offset;
        }
    }

    toggleWorkoutPause() {
        this.workout.isPaused = !this.workout.isPaused;
        this.updatePauseButtonUI();
        if (this.workout.isPaused) {
            if (window.appAudio) appAudio.stopSpeaking();
        }
    }

    updatePauseButtonUI() {
        const btn = document.getElementById('player-pause-btn');
        if (btn) {
            if (this.workout.isPaused) {
                btn.innerHTML = '▶ Weiter';
                btn.classList.add('bg-amber-500', 'text-white');
                btn.classList.remove('bg-slate-100', 'text-slate-800');
            } else {
                btn.innerHTML = '⏸ Pause';
                btn.classList.remove('bg-amber-500', 'text-white');
                btn.classList.add('bg-slate-100', 'text-slate-800');
            }
        }
    }

    nextWorkoutStep() {
        const currentEx = this.workout.playlist[this.workout.currentIndex];
        const totalSteps = currentEx.schritte.length;

        if (this.workout.stepIndex < totalSteps - 1) {
            // Nächster Einzelschritt
            this.workout.stepIndex++;
            this.loadCurrentWorkoutStep();
        } else {
            // Übung ist komplett beendet -> Frage Feedback ab
            this.showFeedbackScreen(currentEx);
        }
    }

    showFeedbackScreen(exercise) {
        this.clearWorkoutTimer();
        if (window.appAudio) {
            appAudio.playSuccessChime();
            appAudio.speak('Sehr gut gemacht! Wie war diese Übung für Sie?');
        }

        document.getElementById('player-step-view').classList.add('hidden');
        document.getElementById('player-feedback-view').classList.remove('hidden');
    }

    submitExerciseFeedback(rating) { // 'easy', 'good', 'hard'
        const currentEx = this.workout.playlist[this.workout.currentIndex];
        if (currentEx) {
            this.ratings[currentEx.id] = rating;
            this.saveRatings();
        }

        // Ansicht zurückwechseln
        document.getElementById('player-feedback-view').classList.add('hidden');
        document.getElementById('player-step-view').classList.remove('hidden');

        // Nächste Übung in der Playlist
        this.workout.currentIndex++;
        this.workout.stepIndex = 0;

        if (this.workout.currentIndex < this.workout.playlist.length) {
            this.loadCurrentWorkoutStep();
        } else {
            // Gesamtes Workout beendet!
            this.showWorkoutSummary();
        }
    }

    showWorkoutSummary() {
        this.clearWorkoutTimer();
        if (window.appAudio) {
            appAudio.playSuccessChime();
            appAudio.speak('Herzlichen Glückwunsch! Sie haben alle Übungen erfolgreich gemeistert. Wir tragen Ihren Erfolg ins Tagebuch ein.');
        }

        // Automatischer Eintrag ins Tagebuch
        const todayStr = new Date().toISOString().slice(0, 10);
        const completedNames = this.workout.playlist.map(e => e.titel);

        const newEntry = {
            id: 'entry-' + Date.now(),
            date: todayStr,
            time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            mood: 4, // Gut
            fatigue: 'mittel',
            exercises: completedNames,
            notes: 'Erfolgreich geübt.'
        };

        this.diary.unshift(newEntry);
        this.saveDiary();

        // Zeige Abschlussbildschirm
        document.getElementById('player-step-view').classList.add('hidden');
        document.getElementById('player-feedback-view').classList.add('hidden');
        document.getElementById('player-summary-view').classList.remove('hidden');

        document.getElementById('summary-completed-count').textContent = `${this.workout.playlist.length} Übungen abgeschlossen`;
    }

    finishWorkoutSummary() {
        document.getElementById('player-summary-view').classList.add('hidden');
        document.getElementById('player-step-view').classList.remove('hidden');
        this.closeWorkout();
        this.renderAll();
    }

    // =========================================================================
    // TAB 5: KOPF-TRAINING (KOGNITIVE SPIELE)
    // =========================================================================
    initBrainGame(gameType = 'numbers') {
        this.brainGameState.activeGame = gameType;

        // Tasten umschalten
        ['numbers', 'shapes', 'memory'].forEach(t => {
            const btn = document.getElementById(`brain-game-tab-${t}`);
            if (btn) {
                const isActive = t === gameType;
                btn.classList.toggle('bg-blue-600', isActive);
                btn.classList.toggle('text-white', isActive);
                btn.classList.toggle('bg-slate-100', !isActive);
            }
        });

        const gameContainer = document.getElementById('brain-game-container');
        if (!gameContainer) return;

        if (gameType === 'numbers') {
            this.renderNumbersGame(gameContainer);
        } else if (gameType === 'shapes') {
            this.renderShapesGame(gameContainer);
        } else if (gameType === 'memory') {
            this.renderMemoryGame(gameContainer);
        }
    }

    // Spiel 1: Zahlen der Reihe nach antippen (1 -> 2 -> 3 -> 4)
    renderNumbersGame(container) {
        this.brainGameState.numbersCurrentTarget = 1;
        // Zahlen 1 bis 4 zufällig mischen
        const shuffled = [1, 2, 3, 4].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="text-center space-y-6">
                <div class="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                    <p class="text-lg font-bold text-blue-900" id="numbers-prompt">
                        Tippen Sie auf die Zahl: <span class="text-3xl font-extrabold text-blue-600">1</span>
                    </p>
                    <p class="text-sm text-slate-500 mt-1">Kein Zeitdruck. Schön der Reihe nach von 1 bis 4.</p>
                </div>

                <div class="grid grid-cols-2 gap-4 sm:gap-6 max-w-sm mx-auto" id="numbers-grid">
                    ${shuffled.map(num => `
                        <button onclick="app.handleNumberClick(${num}, this)" class="btn-touch w-full h-28 sm:h-32 text-4xl sm:text-5xl font-black rounded-3xl bg-white border-4 border-slate-300 text-slate-800 shadow-md hover:border-blue-500 active:scale-95 transition-all">
                            ${num}
                        </button>
                    `).join('')}
                </div>

                <div id="numbers-success-msg" class="hidden p-4 rounded-2xl bg-emerald-100 text-emerald-900 font-bold text-lg">
                    🎉 Wunderbar gelöst! Alle Zahlen der Reihe nach gefunden.
                    <div class="mt-3">
                        <button onclick="app.initBrainGame('numbers')" class="btn-touch px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold">
                            Nochmal spielen
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    handleNumberClick(num, btnElement) {
        if (num === this.brainGameState.numbersCurrentTarget) {
            // Treffer!
            btnElement.classList.remove('bg-white', 'text-slate-800', 'border-slate-300');
            btnElement.classList.add('bg-emerald-500', 'text-white', 'border-emerald-600');
            btnElement.disabled = true;

            if (window.appAudio) appAudio.playTone(523.25 + (num * 80), 0.15);

            this.brainGameState.numbersCurrentTarget++;

            if (this.brainGameState.numbersCurrentTarget <= 4) {
                document.getElementById('numbers-prompt').innerHTML = 
                    `Tippen Sie auf die Zahl: <span class="text-3xl font-extrabold text-blue-600">${this.brainGameState.numbersCurrentTarget}</span>`;
            } else {
                // Alle geschafft!
                document.getElementById('numbers-success-msg').classList.remove('hidden');
                if (window.appAudio) {
                    appAudio.playSuccessChime();
                    appAudio.speak('Hervorragend! Sie haben alle Zahlen in der richtigen Reihenfolge angetippt.');
                }
            }
        } else {
            // Fehlgriff - sanfte Rückmeldung ohne Bestrafung
            btnElement.classList.add('ring-4', 'ring-amber-400');
            setTimeout(() => btnElement.classList.remove('ring-4', 'ring-amber-400'), 400);
            if (window.appAudio) appAudio.playTone(300, 0.15, 0.05);
        }
    }

    // Spiel 2: Farben & Symbole zuordnen
    renderShapesGame(container) {
        const shapes = [
            { id: 'sun', label: 'Gelbe Sonne', icon: '☀️', color: 'bg-amber-100 text-amber-600 border-amber-300' },
            { id: 'heart', label: 'Rotes Herz', icon: '❤️', color: 'bg-rose-100 text-rose-600 border-rose-300' },
            { id: 'star', label: 'Blauer Stern', icon: '⭐', color: 'bg-blue-100 text-blue-600 border-blue-300' },
            { id: 'tree', label: 'Grüner Baum', icon: '🌲', color: 'bg-emerald-100 text-emerald-600 border-emerald-300' }
        ];

        // Zufälliges Ziel wählen
        const target = shapes[Math.floor(Math.random() * shapes.length)];
        this.brainGameState.shapeTarget = target;

        container.innerHTML = `
            <div class="text-center space-y-6">
                <div class="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                    <p class="text-lg font-bold text-blue-900">
                        Wo ist das Symbol: <span class="text-2xl font-black text-blue-700">${target.label}</span>?
                    </p>
                </div>

                <div class="grid grid-cols-2 gap-4 sm:gap-6 max-w-sm mx-auto">
                    ${shapes.map(item => `
                        <button onclick="app.handleShapeClick('${item.id}', this)" class="btn-touch w-full h-28 sm:h-32 rounded-3xl border-4 ${item.color} flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 transition-all">
                            <span class="text-4xl">${item.icon}</span>
                            <span class="text-xs font-bold">${item.label}</span>
                        </button>
                    `).join('')}
                </div>

                <div id="shape-feedback" class="min-h-[60px] flex items-center justify-center font-bold text-lg"></div>
            </div>
        `;
    }

    handleShapeClick(clickedId, btnElement) {
        const feedback = document.getElementById('shape-feedback');
        if (clickedId === this.brainGameState.shapeTarget.id) {
            feedback.innerHTML = `<span class="text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl">✓ Richtig! Sehr gut erkannt!</span>`;
            if (window.appAudio) {
                appAudio.playSuccessChime();
            }
            setTimeout(() => this.renderShapesGame(document.getElementById('brain-game-container')), 1500);
        } else {
            feedback.innerHTML = `<span class="text-amber-700 bg-amber-100 px-4 py-2 rounded-xl">Probieren Sie noch einmal in Ruhe.</span>`;
            if (window.appAudio) appAudio.playTone(350, 0.15, 0.05);
        }
    }

    // Spiel 3: Bildkarten-Merkspiel (6 Karten = 3 Paare)
    renderMemoryGame(container) {
        const icons = ['🍎', '🚗', '☕'];
        const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);

        this.brainGameState.memoryCards = deck;
        this.brainGameState.memoryFlipped = [];
        this.brainGameState.memoryMatched = [];

        container.innerHTML = `
            <div class="text-center space-y-6">
                <div class="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                    <p class="text-lg font-bold text-blue-900">
                        Finden Sie die 3 gleichen Bildpaare:
                    </p>
                    <p class="text-sm text-slate-500 mt-1">Decken Sie 2 Karten auf. Passen beide zusammen?</p>
                </div>

                <div class="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm mx-auto" id="memory-grid">
                    ${deck.map((icon, idx) => `
                        <button onclick="app.handleMemoryCard(${idx}, this)" data-idx="${idx}" class="memory-card btn-touch w-full h-24 sm:h-28 rounded-2xl bg-slate-200 border-2 border-slate-300 text-3xl flex items-center justify-center shadow-xs transition-transform">
                            ❓
                        </button>
                    `).join('')}
                </div>

                <div id="memory-success-msg" class="hidden p-4 rounded-2xl bg-emerald-100 text-emerald-900 font-bold text-lg">
                    🎉 Großartig! Sie haben alle Bildpaare gefunden.
                    <div class="mt-3">
                        <button onclick="app.initBrainGame('memory')" class="btn-touch px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold">
                            Neues Merkspiel
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    handleMemoryCard(idx, btn) {
        const state = this.brainGameState;
        if (state.memoryMatched.includes(idx) || state.memoryFlipped.includes(idx)) return;
        if (state.memoryFlipped.length >= 2) return;

        // Karte aufdecken
        btn.textContent = state.memoryCards[idx];
        btn.classList.add('bg-white', 'border-blue-500');
        btn.classList.remove('bg-slate-200');
        state.memoryFlipped.push(idx);

        if (window.appAudio) appAudio.playTone(500, 0.1);

        if (state.memoryFlipped.length === 2) {
            const [first, second] = state.memoryFlipped;
            if (state.memoryCards[first] === state.memoryCards[second]) {
                // Paar gefunden!
                state.memoryMatched.push(first, second);
                state.memoryFlipped = [];

                if (window.appAudio) appAudio.playSuccessChime();

                if (state.memoryMatched.length === state.memoryCards.length) {
                    document.getElementById('memory-success-msg').classList.remove('hidden');
                    if (window.appAudio) appAudio.speak('Hervorragend! Sie haben alle Bildpaare entdeckt.');
                }
            } else {
                // Keine Übereinstimmung -> nach 1 Sekunde zudecken
                setTimeout(() => {
                    const cards = document.querySelectorAll('.memory-card');
                    if (cards[first]) {
                        cards[first].textContent = '❓';
                        cards[first].classList.remove('bg-white', 'border-blue-500');
                        cards[first].classList.add('bg-slate-200');
                    }
                    if (cards[second]) {
                        cards[second].textContent = '❓';
                        cards[second].classList.remove('bg-white', 'border-blue-500');
                        cards[second].classList.add('bg-slate-200');
                    }
                    state.memoryFlipped = [];
                }, 1000);
            }
        }
    }

    // =========================================================================
    // TAB 6: FRAGEN & ANTWORTEN (FAQ)
    // =========================================================================
    renderFaq(categoryFilter = 'all', searchQuery = '') {
        const container = document.getElementById('faq-container');
        if (!container) return;

        let filtered = FAQ_DATA;
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(f => f.category === categoryFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(f => f.question.toLowerCase().includes(q) || f.fullAnswer.toLowerCase().includes(q));
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
                    Keine passende Antwort gefunden. Bitte probieren Sie einen anderen Suchbegriff.
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(item => `
            <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
                <div class="flex items-start justify-between gap-4 mb-3">
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        ${item.categoryLabel}
                    </span>
                    <button onclick="appAudio.speak('${item.question}. ${item.fullAnswer}')" class="btn-touch p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl" title="Antwort vorlesen">
                        🔊 Vorlesen
                    </button>
                </div>

                <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 leading-tight">
                    ${item.question}
                </h3>

                <p class="text-base sm:text-lg font-bold text-blue-700 mb-3">
                    ${item.shortAnswer}
                </p>

                <p class="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                    ${item.fullAnswer}
                </p>

                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Praktische Tipps:</span>
                    ${item.tips.map(tip => `
                        <div class="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                            <span class="text-blue-600 font-bold">•</span>
                            <span>${tip}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // =========================================================================
    // TAB 7: REHA-TAGEBUCH
    // =========================================================================
    renderDiary() {
        const historyContainer = document.getElementById('diary-history-list');
        const printContainer = document.getElementById('diary-print-table');

        // Formular-Vorauswahl
        const todayDateInput = document.getElementById('diary-date-input');
        if (todayDateInput) {
            todayDateInput.value = new Date().toISOString().slice(0, 10);
        }

        // Verlauf rendern
        if (historyContainer) {
            if (this.diary.length === 0) {
                historyContainer.innerHTML = `
                    <div class="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
                        Noch keine Tagebucheinträge vorhanden. Schließen Sie ein Training ab oder tragen Sie oben Ihr Befinden ein.
                    </div>
                `;
            } else {
                const moodIcons = ['', '😢 Schlecht', '😐 Mäßig', '🙂 In Ordnung', '😊 Gut', '🌟 Sehr gut'];

                historyContainer.innerHTML = this.diary.map((entry, idx) => `
                    <div class="bg-white rounded-2xl p-5 border-2 border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="space-y-1">
                            <div class="flex items-center gap-3">
                                <span class="font-bold text-base text-slate-900">${this.formatDateDe(entry.date)}</span>
                                <span class="text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">${entry.time || ''}</span>
                                <span class="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                                    Stimmung: ${moodIcons[entry.mood] || 'Neutral'}
                                </span>
                            </div>
                            <p class="text-xs sm:text-sm text-slate-600">
                                <strong>Müdigkeit:</strong> ${entry.fatigue || 'mittel'}
                                ${entry.exercises && entry.exercises.length > 0 ? ` | <strong>Übungen:</strong> ${entry.exercises.join(', ')}` : ''}
                            </p>
                            ${entry.notes ? `<p class="text-xs italic text-slate-500">„${entry.notes}“</p>` : ''}
                        </div>
                        <button onclick="app.deleteDiaryEntry(${idx})" class="self-end sm:self-center p-2 text-slate-400 hover:text-rose-600 rounded-lg text-xs" title="Eintrag löschen">
                            ✕ Löschen
                        </button>
                    </div>
                `).join('');
            }
        }

        // Druck-Tabelle für den Arztbesuch
        if (printContainer) {
            printContainer.innerHTML = this.diary.slice(0, 14).map(e => `
                <tr class="border-b border-black">
                    <td class="p-2">${this.formatDateDe(e.date)}</td>
                    <td class="p-2">${e.mood}/5</td>
                    <td class="p-2">${e.fatigue}</td>
                    <td class="p-2">${(e.exercises || []).join(', ') || '-'}</td>
                    <td class="p-2">${e.notes || '-'}</td>
                </tr>
            `).join('');
        }

        // SVG-Verlaufsdiagramm zeichnen
        this.renderDiaryChart();
    }

    addDiaryEntryFromForm() {
        const date = document.getElementById('diary-date-input').value || new Date().toISOString().slice(0, 10);
        const moodRadio = document.querySelector('input[name="diary-mood"]:checked');
        const mood = moodRadio ? parseInt(moodRadio.value) : 3;
        const fatigueRadio = document.querySelector('input[name="diary-fatigue"]:checked');
        const fatigue = fatigueRadio ? fatigueRadio.value : 'mittel';
        const notes = document.getElementById('diary-notes-input').value.trim();

        const entry = {
            id: 'entry-' + Date.now(),
            date: date,
            time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            mood: mood,
            fatigue: fatigue,
            exercises: ['Manuell eingetragen'],
            notes: notes
        };

        this.diary.unshift(entry);
        this.saveDiary();
        document.getElementById('diary-notes-input').value = '';
        this.renderDiary();

        if (window.appAudio) {
            appAudio.playTone(523.25, 0.2);
            appAudio.speak('Tagebucheintrag erfolgreich gespeichert.');
        }
    }

    deleteDiaryEntry(index) {
        if (confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
            this.diary.splice(index, 1);
            this.saveDiary();
            this.renderDiary();
        }
    }

    renderDiaryChart() {
        const svgContainer = document.getElementById('diary-chart-container');
        if (!svgContainer) return;

        const recent = this.diary.slice(0, 7).reverse();
        if (recent.length < 2) {
            svgContainer.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Diagramm erscheint ab 2 Einträgen.</p>`;
            return;
        }

        const width = 360;
        const height = 120;
        const padding = 25;
        const stepX = (width - 2 * padding) / (recent.length - 1);

        const points = recent.map((item, idx) => {
            const x = padding + idx * stepX;
            // Stimmung von 1 (unten) bis 5 (oben)
            const y = height - padding - ((item.mood - 1) / 4) * (height - 2 * padding);
            return { x, y, mood: item.mood, date: item.date.slice(5) };
        });

        const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

        svgContainer.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" class="w-full h-32">
                <!-- Horizontale Hilfslinien -->
                <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="#e2e8f0" stroke-dasharray="3,3" />
                <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#e2e8f0" stroke-dasharray="3,3" />
                <!-- Verlaufslinie -->
                <path d="${pathD}" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
                <!-- Datenpunkte -->
                ${points.map(p => `
                    <circle cx="${p.x}" cy="${p.y}" r="6" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
                    <text x="${p.x}" y="${height - 5}" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">${p.date}</text>
                `).join('')}
            </svg>
        `;
    }

    formatDateDe(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return dateStr;
    }

    // =========================================================================
    // ERSTEINRICHTUNGS-MODAL (ONBOARDING)
    // =========================================================================
    openOnboardingModal() {
        const modal = document.getElementById('onboarding-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.onboardingStep = 1;
            this.showOnboardingStep(1);
        }
    }

    closeOnboardingModal() {
        const modal = document.getElementById('onboarding-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
        this.renderAll();
    }

    showOnboardingStep(step) {
        this.onboardingStep = step;
        for (let i = 1; i <= 4; i++) {
            const el = document.getElementById(`onboarding-step-${i}`);
            if (el) el.classList.toggle('hidden', i !== step);
        }
        document.getElementById('onboarding-progress-text').textContent = `Frage ${step} von 4`;
    }

    setOnboardingSide(side) {
        this.profile.side = side;
        if (window.appAudio) appAudio.playTone(523.25, 0.15);
        this.showOnboardingStep(2);
    }

    setOnboardingStanding(val) {
        this.profile.standing = val; // 0, 1, 2
        if (window.appAudio) appAudio.playTone(523.25, 0.15);
        this.showOnboardingStep(3);
    }

    setOnboardingArm(val) {
        this.profile.arm = val; // 0, 1, 2
        if (window.appAudio) appAudio.playTone(523.25, 0.15);
        this.showOnboardingStep(4);
    }

    setOnboardingCaregiver(val) {
        this.profile.caregiver = val;
        this.profile.caregiverMode = (val === 'mit-begleitung');
        this.saveProfile();
        if (window.appAudio) {
            appAudio.playSuccessChime();
            appAudio.speak('Herzlich willkommen! Ihr persönlicher Übungsplan ist jetzt startklar.');
        }
        this.closeOnboardingModal();
    }

    // =========================================================================
    // EVENT-LISTENER
    // =========================================================================
    setupEventListeners() {
        // FAQ Suche & Filter
        const searchInput = document.getElementById('faq-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.renderFaq('all', e.target.value);
            });
        }
    }
}

// Global verfügbare App-Instanz
let app = null;
window.addEventListener('DOMContentLoaded', () => {
    app = new SchlaganfallApp();
});
