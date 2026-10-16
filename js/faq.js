/**
 * SchlaganfallFit - Fragen & Antworten (Wissensdatenbank)
 * Regelbasierter Ratgeber, 100% offline, keine externe KI erforderlich.
 * Alle Antworten in einfacher, verständlicher Sprache mit Vorlese-Unterstützung.
 */

const FAQ_DATA = [
    {
        id: 'faq-haeufigkeit',
        category: 'ueben',
        categoryLabel: 'Üben & Training',
        question: 'Wie oft und wie lange soll ich täglich üben?',
        shortAnswer: 'Lieber mehrmals kurz als einmal lang.',
        fullAnswer: 'Üben Sie am besten 2 bis 3 Mal am Tag für jeweils 10 bis 15 Minuten. Nach einem Schlaganfall ermüdet das Gehirn sehr schnell. Kurze, häufige Wiederholungen sind viel wirksamer als eine anstrengende Stunde am Stück.',
        tips: [
            'Feste Zeiten helfen (z. B. nach dem Frühstück und nach der Mittagsruhe).',
            'Hören Sie sofort auf, wenn die Konzentration nachlässt.',
            'Qualität der Bewegung geht immer vor Schnelligkeit!'
        ]
    },
    {
        id: 'faq-muedigkeit',
        category: 'gesundheit',
        categoryLabel: 'Körper & Psyche',
        question: 'Warum bin ich nach dem Üben so extrem müde?',
        shortAnswer: 'Das Gehirn leistet Schwerstarbeit beim Lernen neuer Wege.',
        fullAnswer: 'Diese tiefe Erschöpfung nennt man Post-Stroke-Fatigue. Sie ist völlig normal. Das Gehirn muss beschädigte Nervenbahnen umleiten. Das verbraucht enorm viel Energie – wie ein Muskel, der neu wachsen muss.',
        tips: [
            'Schämen Sie sich nicht für Ruhepausen und Mittagsschlaf.',
            'Trinken Sie über den Tag verteilt ausreichend stilles Wasser.',
            'Teilen Sie Ihre Kräfte gut ein – Sie sind nicht faul, Ihr Gehirn baut sich um!'
        ]
    },
    {
        id: 'faq-spastik',
        category: 'gesundheit',
        categoryLabel: 'Körper & Psyche',
        question: 'Was kann ich tun, wenn die Hand oder das Bein verkrampft (Spastik)?',
        shortAnswer: 'Sanfte Wärme, weiches Ausstreichen und niemals mit Gewalt aufbiegen.',
        fullAnswer: 'Spastik entsteht durch eine Übererregung der Muskeln. Bei Schmerz oder Hektik verstärkt sie sich oft. Versuchen Sie niemals, eine verkrampfte Faust gewaltsam aufzubrechen!',
        tips: [
            'Wärmekissen oder ein warmes Handbad lockern das Gewebe.',
            'Langsame, rhythmische Bewegungen beruhigen den Muskeltonus.',
            'Atmung ruhig fließen lassen – nicht die Zähne zusammenbeißen.'
        ]
    },
    {
        id: 'faq-spazieren',
        category: 'alltag',
        categoryLabel: 'Alltag & Bewegung',
        question: 'Darf ich draußen spazieren gehen?',
        shortAnswer: 'Ja, aber nur mit passenden Hilfsmitteln und anfangs in Begleitung.',
        fullAnswer: 'Frische Luft und Sonnenlicht fördern die Stimmung und den Kreislauf. Gehen Sie jedoch erst dann allein nach draußen, wenn Sie in der Wohnung ohne Sturzgefahr sicher gehen können.',
        tips: [
            'Nutzen Sie Gehstock, Vierpunktstock oder Rollator wie vom Therapeuten empfohlen.',
            'Wählen Sie feste, geschlossene Schuhe mit gutem Profil.',
            'Nehmen Sie ein aufgeladenes Mobiltelefon für den Notfall mit.'
        ]
    },
    {
        id: 'faq-angehoerige',
        category: 'angehoerige',
        categoryLabel: 'Für Angehörige',
        question: 'Wie können Partner und Angehörige am besten helfen?',
        shortAnswer: 'Geduld schenken, loben und dem Betroffenen Selbstständigkeit lassen.',
        fullAnswer: 'Die größte Hilfe ist Zeit. Nehmen Sie dem Betroffenen nicht sofort alles aus der Hand, auch wenn es länger dauert. Jede eigenständige Bewegung trainiert das Gehirn.',
        tips: [
            'NIEMALS am gelähmten Arm ziehen (schwere Verletzungsgefahr für die Schulter!).',
            'In kurzen, klaren Sätzen sprechen und Zeit zum Antworten lassen.',
            'Kleine Fortschritte feiern: Jede Bewegung zählt!'
        ]
    },
    {
        id: 'faq-abbruch',
        category: 'sicherheit',
        categoryLabel: 'Sicherheit',
        question: 'Wann muss eine Übung sofort abgebrochen werden?',
        shortAnswer: 'Bei Schmerz, Schwindel, Atemnot oder plötzlichem Unwohlsein.',
        fullAnswer: 'Reha-Training darf anstrengend sein, aber niemals wehtun. Wenn Warnsignale des Körpers auftreten, beenden Sie das Training auf der Stelle und setzen Sie sich sicher hin.',
        tips: [
            'Stechender Brustschmerz oder Atemnot -> sofort Notruf 112 / 144!',
            'Starker Schwindel oder Übelkeit -> sofort hinsetzen, Beine hochlegen.',
            'Plötzliche neue Taubheit oder Sprachverlust -> BE-FAST Notfallregel beachten!'
        ]
    },
    {
        id: 'faq-erholung',
        category: 'gesundheit',
        categoryLabel: 'Körper & Psyche',
        question: 'Wie lange dauert die Erholung nach einem Schlaganfall?',
        shortAnswer: 'Das Gehirn kann ein Leben lang Neues lernen (Neuroplastizität).',
        fullAnswer: 'Die größten Sprünge passieren meist in den ersten 6 bis 12 Monaten. Aber auch nach vielen Jahren können durch regelmäßiges Training noch neue Fähigkeiten zurückgewonnen oder verfeinert werden.',
        tips: [
            'Vergleichen Sie sich nicht mit anderen Patienten, jeder Weg ist einzigartig.',
            'Führen Sie ein Tagebuch, um auch kleine Verbesserungen sichtbar zu machen.',
            'Regelmäßigkeit schlägt Intensität!'
        ]
    },
    {
        id: 'faq-schulter',
        category: 'sicherheit',
        categoryLabel: 'Sicherheit',
        question: 'Warum tut die betroffene Schulter oft weh?',
        shortAnswer: 'Weil die haltenden Muskeln schlaff sind und der Arm nach unten zieht.',
        fullAnswer: 'Ohne Muskelspannung kann der Oberarmkopf etwas aus der Gelenkpfanne rutschen (Subluxation). Das dehnt die Bänder und schmerzt. Der Arm muss daher im Sitzen immer gut gelagert werden.',
        tips: [
            'Legen Sie den Unterarm beim Sitzen auf ein Kissen oder eine Armlehne.',
            'Lassen Sie den Arm beim Stehen oder Gehen nicht schwer nach unten baumeln.',
            'Fragen Sie Ihren Arzt nach einer speziellen Schulter-Orthese.'
        ]
    }
];
