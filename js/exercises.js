/**
 * SchlaganfallFit - Übungsdatenbank
 * Evidenzbasierte, vorsichtig dosierte Reha-Übungen für Schlaganfallpatienten.
 * 
 * WICHTIGER HINWEIS:
 * Alle Texte sind in einfacher Sprache verfasst (kurze Sätze, max. 10–12 Wörter).
 * Der Platzhalter {BETROFFENE_SEITE} wird in app.js dynamisch durch
 * "linke", "rechte" oder "betroffene" ersetzt.
 * 
 * Eigene Übungen können ganz einfach nach dem gleichen Schema unten angehängt werden!
 */

const EXERCISES = [
    // =========================================================================
    // BEREICH 1: ARM & HAND
    // =========================================================================
    {
        id: 'arm-streichen',
        bereich: 'arm-hand',
        bereichLabel: 'Arm & Hand',
        titel: 'Hand auf dem Tisch flach streichen',
        kurzbeschreibung: 'Öffnet die Finger sanft und lockert die Handfläche auf der Tischplatte.',
        position: 'sitzen',
        schwierigkeit: 1, // 1 = leicht, 2 = mittel, 3 = anspruchsvoll
        minArmMobility: 0, // 0 = gar nicht (mit gesunder Hand geführt), 1 = ein wenig, 2 = gut
        minStanding: 0,
        schritte: [
            'Setzen Sie sich aufrecht an einen stabilen Tisch.',
            'Legen Sie Ihre {BETROFFENE_SEITE} Hand mit der Handfläche auf den Tisch.',
            'Streichen Sie mit der gesunden Hand sanft über Handrücken und Finger.',
            'Versuchen Sie, die Finger für 5 Sekunden lang flach liegen zu lassen.',
            'Danach die Hand kurz entspannen und wiederholen.'
        ],
        wiederholungen: 5,
        saetze: 2,
        haltezeit_sek: 5,
        pause_sek: 10,
        sicherheitshinweis: 'Finger niemals mit Gewalt überstrecken. Es darf kein Schmerz entstehen.',
        tipp_fuer_angehoerige: 'Fassen Sie die Hand behutsam an den Fingerkuppen. Nicht an den Fingern reißen!',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Tischplatte -->
                <line x1="10" y1="75" x2="90" y2="75" stroke="#94a3b8" stroke-width="4" />
                <!-- Ausgestreckte Hand flach auf Tisch -->
                <path d="M 25 72 C 30 65, 45 65, 55 68 C 65 64, 75 64, 80 67 C 82 72, 75 73, 70 73 C 65 73, 50 73, 30 73 Z" fill="#dbeafe" />
                <path d="M 25 72 L 50 72 M 52 72 L 75 72" stroke="#2563eb" stroke-width="3" />
                <!-- Pfeil für sanftes Vorstreichen -->
                <path d="M 35 50 L 65 50 M 58 43 L 65 50 L 58 57" stroke="#ea580c" stroke-width="3" />
            </svg>
        `
    },
    {
        id: 'faust-oeffnen',
        bereich: 'arm-hand',
        bereichLabel: 'Arm & Hand',
        titel: 'Faust öffnen und schließen',
        kurzbeschreibung: 'Aktiviert das bewusste Öffnen und Entspannen der Finger.',
        position: 'sitzen',
        schwierigkeit: 1,
        minArmMobility: 1,
        minStanding: 0,
        schritte: [
            'Legen Sie den Unterarm bequem auf den Tisch oder eine Armlehne.',
            'Schließen Sie die {BETROFFENE_SEITE} Hand zu einer lockeren Faust.',
            'Öffnen Sie nun langsam und bewusst alle Finger so weit es geht.',
            'Halten Sie die offenen Finger kurz gestreckt.',
            'Schließen Sie die Finger wieder langsam und entspannen Sie kurz.'
        ],
        wiederholungen: 8,
        saetze: 2,
        haltezeit_sek: 4,
        pause_sek: 8,
        sicherheitshinweis: 'Nicht verkrampfen. Falls die Hand zittert, machen Sie eine kurze Pause.',
        tipp_fuer_angehoerige: 'Sie können mit Ihren Fingern ganz sanft von innen gegen die Handfläche streichen.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Geöffnete Hand -->
                <path d="M 40 75 L 40 55 C 38 48, 32 45, 30 50 L 30 65" stroke="#2563eb" />
                <path d="M 43 55 L 43 35 C 43 30, 48 30, 48 35 L 48 55" stroke="#2563eb" />
                <path d="M 50 55 L 50 30 C 50 25, 55 25, 55 30 L 55 55" stroke="#2563eb" />
                <path d="M 57 55 L 57 38 C 57 33, 62 33, 62 38 L 62 55" stroke="#2563eb" />
                <path d="M 64 57 L 64 45 C 64 41, 68 41, 68 45 L 68 62" stroke="#2563eb" />
                <!-- Strahlen für Spreizen -->
                <path d="M 30 25 L 35 32 M 50 18 L 50 24 M 70 25 L 65 32" stroke="#ea580c" stroke-width="2.5" />
            </svg>
        `
    },
    {
        id: 'arm-gefuehrt-heben',
        bereich: 'arm-hand',
        bereichLabel: 'Arm & Hand',
        titel: 'Arm mit gesunder Hand geführt heben',
        kurzbeschreibung: 'Bewegt die gelähmte Schulter sicher, indem beide Hände ineinandergreifen.',
        position: 'sitzen',
        schwierigkeit: 1,
        minArmMobility: 0,
        minStanding: 0,
        schritte: [
            'Falten Sie die Hände wie zum Gebet vor Ihrem Bauch.',
            'Die gesunde Hand umfasst die {BETROFFENE_SEITE} Hand sicher.',
            'Heben Sie beide Arme langsam nach vorne oben bis auf Brusthöhe.',
            'Nur so weit heben, wie die Schulter schmerzfrei bleibt.',
            'Halten Sie die Höhe kurz und senken Sie die Arme kontrolliert ab.'
        ],
        wiederholungen: 6,
        saetze: 2,
        haltezeit_sek: 3,
        pause_sek: 10,
        sicherheitshinweis: 'STRENG VERBOTEN: Niemals den betroffenen Arm mit Schwung nach oben reißen!',
        tipp_fuer_angehoerige: 'WICHTIGSTE REGEL: Niemals am betroffenen Arm ziehen! Die Schulter kann leicht luxieren.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Oberkörper Umriss -->
                <circle cx="50" cy="25" r="10" stroke="#64748b" />
                <path d="M 30 55 C 30 42, 70 42, 70 55" stroke="#64748b" />
                <!-- Gefaltete Hände mit Hebe-Pfeil -->
                <path d="M 38 48 C 42 60, 46 68, 50 68 C 54 68, 58 60, 62 48" stroke="#2563eb" stroke-width="4" />
                <!-- Hebe-Pfeil nach oben -->
                <path d="M 50 62 L 50 38 M 44 44 L 50 38 L 56 44" stroke="#ea580c" stroke-width="3.5" />
            </svg>
        `
    },
    {
        id: 'handgelenk-beugen',
        bereich: 'arm-hand',
        bereichLabel: 'Arm & Hand',
        titel: 'Handgelenk beugen und strecken',
        kurzbeschreibung: 'Mobilisiert das Handgelenk und beugt Verkürzungen der Sehnen vor.',
        position: 'sitzen',
        schwierigkeit: 2,
        minArmMobility: 1,
        minStanding: 0,
        schritte: [
            'Legen Sie den Unterarm so auf den Tisch, dass die Hand über die Kante ragt.',
            'Heben Sie die Hand langsam nach oben in Richtung Decke.',
            'Halten Sie die Streckung für 3 Sekunden.',
            'Senken Sie die Hand vorsichtig wieder nach unten ab.',
            'Entspannen Sie das Handgelenk für einen Moment.'
        ],
        wiederholungen: 8,
        saetze: 2,
        haltezeit_sek: 3,
        pause_sek: 8,
        sicherheitshinweis: 'Wenn nötig, stützt die gesunde Hand das Handgelenk sanft von unten.',
        tipp_fuer_angehoerige: 'Halten Sie den Unterarm flach auf dem Tisch, damit nur das Handgelenk arbeitet.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Tischkante -->
                <line x1="10" y1="65" x2="55" y2="65" stroke="#94a3b8" stroke-width="4" />
                <line x1="55" y1="65" x2="55" y2="90" stroke="#94a3b8" stroke-width="3" />
                <!-- Unterarm -->
                <rect x="15" y="55" width="40" height="10" rx="3" fill="#dbeafe" stroke="#2563eb" />
                <!-- Hand heben / senken Bogen -->
                <path d="M 55 60 C 65 55, 75 40, 80 42" stroke="#2563eb" stroke-width="4" />
                <path d="M 68 35 C 75 38, 80 48, 78 58" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="3,3" />
            </svg>
        `
    },
    {
        id: 'tuch-greifen',
        bereich: 'arm-hand',
        bereichLabel: 'Arm & Hand',
        titel: 'Tuch greifen und loslassen',
        kurzbeschreibung: 'Schult das gezielte Zugreifen und Loslassen von weichen Alltagsgegenständen.',
        position: 'sitzen',
        schwierigkeit: 2,
        minArmMobility: 1,
        minStanding: 0,
        schritte: [
            'Legen Sie ein weiches Geschirrtuch vor sich auf den Tisch.',
            'Greifen Sie mit den Fingern der {BETROFFENE_SEITE} Hand in das Tuch.',
            'Drücken Sie das Tuch sanft zusammen.',
            'Heben Sie das Tuch 5 Zentimeter vom Tisch an.',
            'Legen Sie es ab und öffnen Sie bewusst alle Finger zum Loslassen.'
        ],
        wiederholungen: 6,
        saetze: 2,
        haltezeit_sek: 4,
        pause_sek: 10,
        sicherheitshinweis: 'Beginnen Sie mit einem leichten Tuch, nicht mit schweren Gegenständen.',
        tipp_fuer_angehoerige: 'Das Loslassen ist oft schwieriger als das Greifen. Geben Sie viel Zeit und Geduld.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Tuch zerknüllt -->
                <path d="M 35 70 C 40 55, 60 55, 65 70 C 70 75, 60 80, 50 80 C 40 80, 30 75, 35 70 Z" fill="#fed7aa" stroke="#ea580c" />
                <!-- Greifende Hand darüber -->
                <path d="M 35 45 C 38 35, 62 35, 65 45 C 65 55, 60 58, 55 58" stroke="#2563eb" stroke-width="3" />
                <line x1="50" y1="20" x2="50" y2="35" stroke="#2563eb" stroke-width="4" />
            </svg>
        `
    },
    {
        id: 'finger-tippen',
        bereich: 'arm-hand',
        bereichLabel: 'Arm & Hand',
        titel: 'Fingerspitzen-Tippen (Feinmotorik)',
        kurzbeschreibung: 'Fördert die präzise Ansteuerung der einzelnen Finger.',
        position: 'sitzen',
        schwierigkeit: 3,
        minArmMobility: 2,
        minStanding: 0,
        schritte: [
            'Legen Sie die {BETROFFENE_SEITE} Hand flach und entspannt vor sich.',
            'Tippen Sie mit dem Zeigefinger 3-mal sanft auf den Tisch.',
            'Tippen Sie dann nacheinander mit Mittel-, Ring- und kleinem Finger.',
            'Nun berührt die Daumenspitze nacheinander jede andere Fingerspitze.',
            'Atmen Sie ruhig und wiederholen Sie den Durchgang.'
        ],
        wiederholungen: 5,
        saetze: 2,
        haltezeit_sek: 3,
        pause_sek: 10,
        sicherheitshinweis: 'Nicht hetzen. Genauigkeit ist viel wichtiger als Schnelligkeit.',
        tipp_fuer_angehoerige: 'Sie können mitzählen: 1, 2, 3, 4. Das hilft dem Gehirn beim Rhythmus.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Daumen trifft Zeigefinger (Ring) -->
                <circle cx="50" cy="50" r="16" stroke="#2563eb" stroke-width="3" fill="#eff6ff" />
                <!-- Handgelenk -->
                <path d="M 30 80 L 42 62 M 70 80 L 58 62" stroke="#64748b" />
                <!-- Kontaktstern -->
                <path d="M 50 30 L 50 36 M 46 33 L 54 33" stroke="#ea580c" stroke-width="2.5" />
            </svg>
        `
    },

    // =========================================================================
    // BEREICH 2: BEINE & GLEICHGEWICHT
    // =========================================================================
    {
        id: 'fusswippe-sitzen',
        bereich: 'legs-balance',
        bereichLabel: 'Beine & Gleichgewicht',
        titel: 'Fußwippe im Sitzen',
        kurzbeschreibung: 'Fördert die Beweglichkeit im Sprunggelenk und die Durchblutung.',
        position: 'sitzen',
        schwierigkeit: 1,
        minArmMobility: 0,
        minStanding: 0, // Auch wenn Stehen gar nicht möglich ist!
        schritte: [
            'Setzen Sie sich aufrecht auf einen festen Stuhl.',
            'Beide Füße stehen flach und stabil auf dem Boden.',
            'Heben Sie nun beide Fersen weit an – die Zehen bleiben am Boden.',
            'Senken Sie die Fersen ab und heben Sie nun die Zehenspitzen an.',
            'Wippen Sie langsam und gleichmäßig hin und her.'
        ],
        wiederholungen: 10,
        saetze: 2,
        haltezeit_sek: 3,
        pause_sek: 8,
        sicherheitshinweis: 'Füße hüftbreit aufstellen, nicht übereinanderschlagen.',
        tipp_fuer_angehoerige: 'Wenn der betroffene Fuß schwer abhebt, unterstützen Sie sanft unter der Sohle.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Bodenlinie -->
                <line x1="15" y1="80" x2="85" y2="80" stroke="#94a3b8" stroke-width="4" />
                <!-- Fuß in Wipp-Position -->
                <path d="M 30 75 L 55 60 C 65 58, 75 62, 75 75 Z" fill="#dbeafe" stroke="#2563eb" />
                <!-- Wipp-Pfeil (hoch/runter) -->
                <path d="M 28 65 C 28 50, 40 45, 45 45 M 40 40 L 45 45 L 40 50" stroke="#ea580c" stroke-width="3" />
            </svg>
        `
    },
    {
        id: 'knie-strecken-sitzen',
        bereich: 'legs-balance',
        bereichLabel: 'Beine & Gleichgewicht',
        titel: 'Knie strecken im Sitzen',
        kurzbeschreibung: 'Kräftigt die Oberschenkelmuskeln für sicheres Gehen und Stehen.',
        position: 'sitzen',
        schwierigkeit: 1,
        minArmMobility: 0,
        minStanding: 0,
        schritte: [
            'Sitzen Sie aufrecht und halten Sie sich an der Stuhlkante fest.',
            'Heben Sie den {BETROFFENE_SEITE} Unterschenkel langsam nach vorne an.',
            'Strecken Sie das Knie so weit wie möglich durch.',
            'Halten Sie das gestreckte Bein 3 Sekunden in der Luft.',
            'Senken Sie den Fuß langsam wieder zum Boden ab.'
        ],
        wiederholungen: 8,
        saetze: 2,
        haltezeit_sek: 3,
        pause_sek: 10,
        sicherheitshinweis: 'Den Rücken während der Übung fest an die Lehne drücken.',
        tipp_fuer_angehoerige: 'Ein Kissen unter dem Oberschenkel kann die Bewegung erleichtern.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Stuhl -->
                <path d="M 30 35 L 30 70 L 50 70 L 50 85" stroke="#94a3b8" stroke-width="4" />
                <!-- Gestrecktes Bein -->
                <line x1="32" y1="65" x2="52" y2="65" stroke="#2563eb" stroke-width="5" />
                <line x1="52" y1="65" x2="80" y2="55" stroke="#2563eb" stroke-width="5" />
                <!-- Pfeil nach oben -->
                <path d="M 75 75 L 75 58 M 70 63 L 75 58 L 80 63" stroke="#ea580c" stroke-width="3" />
            </svg>
        `
    },
    {
        id: 'gewicht-verlagern-sitzen',
        bereich: 'legs-balance',
        bereichLabel: 'Beine & Gleichgewicht',
        titel: 'Gewicht im Sitzen verlagern',
        kurzbeschreibung: 'Schult das Gefühl für die Körpermitte und die gelähmte Körperseite.',
        position: 'sitzen',
        schwierigkeit: 1,
        minArmMobility: 0,
        minStanding: 0,
        schritte: [
            'Sitzen Sie aufrecht mit beiden Füßen fest am Boden.',
            'Lehnen Sie Ihren Oberkörper langsam sanft nach rechts.',
            'Spüren Sie, wie die rechte Pobacke das Gewicht trägt.',
            'Kommen Sie langsam zur Mitte zurück.',
            'Lehnen Sie sich nun vorsichtig nach links und wiederholen Sie.'
        ],
        wiederholungen: 6,
        saetze: 2,
        haltezeit_sek: 4,
        pause_sek: 8,
        sicherheitshinweis: 'Nur so weit neigen, dass Sie jederzeit sicher auf dem Stuhl sitzen bleiben.',
        tipp_fuer_angehoerige: 'Stellen Sie sich vor die Person, um bei Schwindel sofort zu stützen.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Oberkörper geneigt -->
                <circle cx="58" cy="25" r="9" stroke="#64748b" />
                <path d="M 45 75 L 55 45 C 55 40, 70 42, 65 52" stroke="#2563eb" stroke-width="4" />
                <!-- Pendel-Pfeil links / rechts -->
                <path d="M 30 35 C 50 25, 70 35, 75 40 M 70 34 L 75 40 L 68 42" stroke="#ea580c" stroke-width="3" />
            </svg>
        `
    },
    {
        id: 'aufstehen-vom-stuhl',
        bereich: 'legs-balance',
        bereichLabel: 'Beine & Gleichgewicht',
        titel: 'Aufstehen vom Stuhl (mit Hilfe)',
        kurzbeschreibung: 'Wichtigste Alltagsübung: Kraft in Beinen und Rumpf aufbauen.',
        position: 'sitzen',
        schwierigkeit: 2,
        minArmMobility: 0,
        minStanding: 1, // Mindestens "Mit Hilfe" erforderlich!
        schritte: [
            'Rücken Sie auf dem Stuhl etwas nach vorne.',
            'Stellen Sie beide Füße nah an die Stuhlbeine heran.',
            'Beugen Sie den Oberkörper mit geradem Rücken nach vorne ("Nase über Zehen").',
            'Drücken Sie sich mit beiden Beinen kraftvoll in den Stand.',
            'Stehen Sie für 3 Sekunden aufrecht und setzen sich langsam wieder ab.'
        ],
        wiederholungen: 5,
        saetze: 2,
        haltezeit_sek: 3,
        pause_sek: 15,
        sicherheitshinweis: 'Nutzen Sie einen Stuhl mit Armlehnen. Ein Tisch oder Helfer davor gibt Sicherheit.',
        tipp_fuer_angehoerige: 'Begleiten Sie an Becken oder Taille, NIEMALS an den Armen nach oben ziehen!',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Stuhl -->
                <path d="M 25 45 L 25 75 L 42 75 L 42 90" stroke="#94a3b8" stroke-width="3.5" />
                <!-- Aufstehende Figur -->
                <circle cx="55" cy="22" r="8" stroke="#64748b" />
                <path d="M 50 48 L 55 35 L 50 65 L 52 85" stroke="#2563eb" stroke-width="4" />
                <!-- Aufsteh-Pfeil diagonal nach oben -->
                <path d="M 60 65 L 75 35 M 68 35 L 75 35 L 75 43" stroke="#ea580c" stroke-width="3.5" />
            </svg>
        `
    },
    {
        id: 'stehen-mit-halt',
        bereich: 'legs-balance',
        bereichLabel: 'Beine & Gleichgewicht',
        titel: 'Sicheres Stehen mit Stuhllehne',
        kurzbeschreibung: 'Verbessert die Standstabilität und das Vertrauen in die Beine.',
        position: 'stehen',
        schwierigkeit: 2,
        minArmMobility: 0,
        minStanding: 2, // Nur wenn Stehen sicher oder mit direkter Begleitung
        schritte: [
            'Stellen Sie sich hinter die feste Lehne eines stabilen Stuhls.',
            'Legen Sie beide Hände sicher auf die Oberkante der Lehne.',
            'Richten Sie sich ganz auf: Brust raus, Blick geradeaus.',
            'Verteilen Sie Ihr Körpergewicht gleichmäßig auf beide Füße.',
            'Atmen Sie 10 Sekunden lang ruhig und tief ein und aus.'
        ],
        wiederholungen: 3,
        saetze: 2,
        haltezeit_sek: 10,
        pause_sek: 15,
        sicherheitshinweis: 'Bei Schwindelgefühl sofort auf den Stuhl setzen! Feste Schuhe tragen.',
        tipp_fuer_angehoerige: 'Bleiben Sie seitlich nah stehen, um bei Unsicherheit Halt zu bieten.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Stuhllehne -->
                <rect x="25" y="35" width="8" height="50" rx="2" fill="#cbd5e1" stroke="#64748b" />
                <line x1="20" y1="85" x2="38" y2="85" stroke="#64748b" stroke-width="4" />
                <!-- Stehende Person hält sich fest -->
                <circle cx="60" cy="20" r="8" stroke="#2563eb" />
                <line x1="60" y1="30" x2="60" y2="60" stroke="#2563eb" stroke-width="4" />
                <line x1="60" y1="60" x2="55" y2="85" stroke="#2563eb" stroke-width="4" />
                <line x1="60" y1="60" x2="65" y2="85" stroke="#2563eb" stroke-width="4" />
                <!-- Arm zur Lehne -->
                <path d="M 60 38 L 33 42" stroke="#2563eb" stroke-width="3.5" />
            </svg>
        `
    },
    {
        id: 'auf-stelle-gehen',
        bereich: 'legs-balance',
        bereichLabel: 'Beine & Gleichgewicht',
        titel: 'Auf der Stelle treten mit Halt',
        kurzbeschreibung: 'Trainiert das rhythmische Beugen der Knie und das Abrollen beim Gehen.',
        position: 'stehen',
        schwierigkeit: 3,
        minArmMobility: 0,
        minStanding: 2,
        schritte: [
            'Halten Sie sich mit beiden Händen an der Stuhllehne fest.',
            'Heben Sie den rechten Fuß langsam 5 Zentimeter vom Boden an.',
            'Setzen Sie ihn leise ab und heben Sie nun den linken Fuß.',
            'Treten Sie abwechselnd wie bei einem sehr langsamen Spaziergang.',
            'Achten Sie darauf, das Knie bewusst anzuheben.'
        ],
        wiederholungen: 10,
        saetze: 2,
        haltezeit_sek: 2,
        pause_sek: 15,
        sicherheitshinweis: 'Nicht eilen. Stuhl muss rutschfest an einer Wand oder auf Teppich stehen.',
        tipp_fuer_angehoerige: 'Schauen Sie, ob das gelähmte Knie ausreichend angehoben wird.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Stuhlhalt -->
                <line x1="25" y1="35" x2="25" y2="85" stroke="#64748b" stroke-width="4" />
                <!-- Person mit gebeugtem Knie -->
                <circle cx="55" cy="20" r="7" stroke="#2563eb" />
                <line x1="55" y1="28" x2="55" y2="55" stroke="#2563eb" stroke-width="3.5" />
                <path d="M 55 35 L 25 40" stroke="#2563eb" stroke-width="3" />
                <!-- Ein Bein am Boden, eins gehoben -->
                <line x1="55" y1="55" x2="52" y2="85" stroke="#2563eb" stroke-width="3.5" />
                <path d="M 55 55 L 68 65 L 68 76" stroke="#ea580c" stroke-width="3.5" />
            </svg>
        `
    },

    // =========================================================================
    // BEREICH 3: GESICHT & SPRECHEN
    // =========================================================================
    {
        id: 'laecheln-spitzen',
        bereich: 'face-speech',
        bereichLabel: 'Gesicht & Sprechen',
        titel: 'Lächeln und Lippen spitzen',
        kurzbeschreibung: 'Kräftigt die Gesichtsmuskeln gegen das Hängen des Mundwinkels.',
        position: 'sitzen',
        schwierigkeit: 1,
        minArmMobility: 0,
        minStanding: 0,
        schritte: [
            'Setzen Sie sich entspannt hin, am besten vor einen Spiegel.',
            'Ziehen Sie beide Mundwinkel breit zu einem großen Lächeln auseinander.',
            'Halten Sie das Lächeln für 3 Sekunden.',
            'Spitzen Sie die Lippen nun fest nach vorne wie zu einem Kuss.',
            'Halten Sie auch den Kussmund für 3 Sekunden und entspannen Sie.'
        ],
        wiederholungen: 6,
        saetze: 2,
        haltezeit_sek: 3,
        pause_sek: 8,
        sicherheitshinweis: 'Keine Schmerzen. Wenn die Muskulatur ermüdet, kurz die Wange ausstreichen.',
        tipp_fuer_angehoerige: 'Machen Sie die Übung gemeinsam mit! Gemeinsames Lachen lockert die Wangen.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Gesichtsumriss -->
                <circle cx="50" cy="50" r="35" stroke="#2563eb" fill="#eff6ff" />
                <circle cx="38" cy="42" r="3" fill="#2563eb" />
                <circle cx="62" cy="42" r="3" fill="#2563eb" />
                <!-- Breites Lächeln mit Dehnpfeilen -->
                <path d="M 32 58 C 42 70, 58 70, 68 58" stroke="#ea580c" stroke-width="3.5" stroke-linecap="round" fill="none" />
                <path d="M 28 54 L 33 58 M 72 54 L 67 58" stroke="#ea580c" stroke-width="3" />
            </svg>
        `
    },
    {
        id: 'backen-aufblasen',
        bereich: 'face-speech',
        bereichLabel: 'Gesicht & Sprechen',
        titel: 'Backen aufblasen und Luft halten',
        kurzbeschreibung: 'Verbessert den Lippenschluss beim Trinken und Essen.',
        position: 'sitzen',
        schwierigkeit: 1,
        minArmMobility: 0,
        minStanding: 0,
        schritte: [
            'Schließen Sie die Lippen ganz fest zusammen.',
            'Atmen Sie durch die Nase ein und blasen Sie beide Backen dick auf.',
            'Halten Sie die Luft wie ein Kugelfisch für 3 bis 5 Sekunden.',
            'Pusten Sie die Luft langsam durch die geschlossenen Lippen aus.',
            'Entspannen Sie das Gesicht und atmen Sie normal.'
        ],
        wiederholungen: 5,
        saetze: 2,
        haltezeit_sek: 4,
        pause_sek: 10,
        sicherheitshinweis: 'Nicht schwindelig atmen. Zwischen den Wiederholungen ruhig durchatmen.',
        tipp_fuer_angehoerige: 'Falls an der gelähmten Seite Luft entweicht, kann man sanft mit dem Zeigefinger den Mundwinkel abdichten.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Dicke Backen Gesicht -->
                <path d="M 50 15 C 25 15, 18 35, 18 55 C 18 72, 35 85, 50 85 C 65 85, 82 72, 82 55 C 82 35, 75 15, 50 15 Z" stroke="#2563eb" fill="#eff6ff" />
                <circle cx="36" cy="40" r="3" fill="#2563eb" />
                <circle cx="64" cy="40" r="3" fill="#2563eb" />
                <circle cx="50" cy="62" r="5" stroke="#ea580c" stroke-width="3" fill="#fff" />
            </svg>
        `
    },
    {
        id: 'zunge-bewegen',
        bereich: 'face-speech',
        bereichLabel: 'Gesicht & Sprechen',
        titel: 'Zunge sanft bewegen',
        kurzbeschreibung: 'Mobilisiert die Zunge für besseres Schlucken und Sprechen.',
        position: 'sitzen',
        schwierigkeit: 2,
        minArmMobility: 0,
        minStanding: 0,
        schritte: [
            'Öffnen Sie den Mund leicht und entspannt.',
            'Strecken Sie die Zungenspitze gerade nach vorne heraus.',
            'Tippen Sie mit der Zunge langsam in den rechten Mundwinkel.',
            'Tippen Sie dann in den linken Mundwinkel.',
            'Zunge zurücknehmen, Schlucken und kurz Pause machen.'
        ],
        wiederholungen: 6,
        saetze: 2,
        haltezeit_sek: 3,
        pause_sek: 8,
        sicherheitshinweis: 'Haben Sie ein Glas Wasser bereit, falls sich Speichel sammelt.',
        tipp_fuer_angehoerige: 'Diese Übung hilft enorm gegen Verschlucken beim Trinken.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Geöffneter Mund -->
                <ellipse cx="50" cy="50" rx="30" ry="20" stroke="#2563eb" fill="#eff6ff" />
                <!-- Zunge nach rechts/links -->
                <path d="M 40 50 C 40 60, 60 62, 68 52 C 65 44, 45 42, 40 50 Z" fill="#fca5a5" stroke="#dc2626" />
                <path d="M 35 32 L 65 32 M 60 27 L 65 32 L 60 37" stroke="#ea580c" stroke-width="2.5" />
            </svg>
        `
    },
    {
        id: 'vokale-toenen',
        bereich: 'face-speech',
        bereichLabel: 'Gesicht & Sprechen',
        titel: 'Vokale laut und deutlich sprechen (A–E–I–O–U)',
        kurzbeschreibung: 'Schult die Atemstütze, Stimmkraft und Lautbildung.',
        position: 'sitzen',
        schwierigkeit: 1,
        minArmMobility: 0,
        minStanding: 0,
        schritte: [
            'Atmen Sie tief und ruhig durch die Nase in den Bauch ein.',
            'Sprechen Sie beim Ausatmen ein langes, klares „AAAAAA“.',
            'Neuer Atemzug: Sprechen Sie ein langes „EEEEEE“.',
            'Wiederholen Sie dies nacheinander mit „I“, „O“ und „U“.',
            'Spüren Sie, wie sich die Mundöffnung bei jedem Laut verändert.'
        ],
        wiederholungen: 5,
        saetze: 1,
        haltezeit_sek: 5,
        pause_sek: 10,
        sicherheitshinweis: 'Nicht pressen. Die Stimme soll angenehm und mühelos klingen.',
        tipp_fuer_angehoerige: 'Sprechen Sie den Laut laut vor. Das Nachahmen fällt oft viel leichter!',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Lautsprecher / Schallwellen -->
                <path d="M 20 40 L 32 40 L 45 28 L 45 72 L 32 60 L 20 60 Z" stroke="#2563eb" fill="#eff6ff" />
                <path d="M 55 40 C 60 45, 60 55, 55 60" stroke="#ea580c" stroke-width="3" />
                <path d="M 65 32 C 73 42, 73 58, 65 68" stroke="#ea580c" stroke-width="3.5" />
                <!-- Buchstabe A -->
                <text x="75" y="55" font-family="system-ui" font-weight="bold" font-size="20" fill="#2563eb">A</text>
            </svg>
        `
    },
    {
        id: 'woerter-sprechen',
        bereich: 'face-speech',
        bereichLabel: 'Gesicht & Sprechen',
        titel: 'Wichtige Alltagswörter nachsprechen',
        kurzbeschreibung: 'Festigt essenzielle Wörter für den Alltag und stärkt das Selbstvertrauen.',
        position: 'sitzen',
        schwierigkeit: 2,
        minArmMobility: 0,
        minStanding: 0,
        schritte: [
            'Hören Sie das Wort genau an oder lesen Sie es von den Lippen ab.',
            'Sprechen Sie langsam das Wort: „J A“ (Kopfnicken dazu).',
            'Sprechen Sie das Wort: „N E I N“ (Kopfschütteln dazu).',
            'Sprechen Sie das Wort: „D A N K E“ (Hand aufs Herz).',
            'Sprechen Sie das Wort: „W A S S E R“.'
        ],
        wiederholungen: 4,
        saetze: 1,
        haltezeit_sek: 4,
        pause_sek: 10,
        sicherheitshinweis: 'Kein Zeitdruck. Ein Wort darf auch mehrfach probiert werden.',
        tipp_fuer_angehoerige: 'Verbinden Sie jedes Wort mit einer Geste. Das Gehirn speichert Bewegung und Sprache zusammen!',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Sprechblase -->
                <path d="M 20 25 C 20 20, 80 20, 80 25 L 80 60 C 80 65, 45 65, 40 75 L 35 65 L 20 65 Z" fill="#eff6ff" stroke="#2563eb" stroke-width="3" />
                <text x="32" y="48" font-family="system-ui" font-weight="900" font-size="16" fill="#1d4ed8">DANKE</text>
            </svg>
        `
    },
    {
        id: 'tiefe-bauchatmung',
        bereich: 'face-speech',
        bereichLabel: 'Gesicht & Sprechen',
        titel: 'Tiefe Bauchatmung zur Entspannung',
        kurzbeschreibung: 'Senkt den Blutdruck, löst Muskelspannungen und beruhigt das Nervensystem.',
        position: 'sitzen',
        schwierigkeit: 1,
        minArmMobility: 0,
        minStanding: 0,
        schritte: [
            'Legen Sie eine oder beide Hände flach auf Ihren Bauch.',
            'Schließen Sie sanft die Augen oder schauen Sie auf einen ruhigen Punkt.',
            'Atmen Sie langsam durch die Nase tief in den Bauch ein (Bauch hebt sich).',
            'Halten Sie die Luft 2 Sekunden sanft an.',
            'Atmen Sie langsam und warm durch den leicht geöffneten Mund wieder aus.'
        ],
        wiederholungen: 5,
        saetze: 1,
        haltezeit_sek: 4,
        pause_sek: 6,
        sicherheitshinweis: 'Bei Schwindel sofort wieder normal und flacher atmen.',
        tipp_fuer_angehoerige: 'Atmen Sie im gleichen Takt mit. Das beruhigt auch Sie selbst und gibt Geborgenheit.',
        svg_piktogramm: `
            <svg class="w-28 h-28 text-blue-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- Lunge / Brustkorb sanft -->
                <path d="M 50 25 L 50 50 M 50 35 C 40 30, 25 38, 25 55 C 25 70, 42 75, 48 65" stroke="#2563eb" stroke-width="3" />
                <path d="M 50 35 C 60 30, 75 38, 75 55 C 75 70, 58 75, 52 65" stroke="#2563eb" stroke-width="3" />
                <!-- Pulsierender Kreis für Ruhe -->
                <circle cx="50" cy="50" r="38" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4,4" />
            </svg>
        `
    }
];
