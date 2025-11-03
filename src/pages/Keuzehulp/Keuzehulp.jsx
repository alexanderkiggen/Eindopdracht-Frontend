import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Keuzehulp.css';

import KeuzehulpImg from "../../assets/images/keuzehulp-image.png"

import ShortDescription from "../../components/ShortDescription/ShortDescription";
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import ButtonSecondary from '../../components/ButtonSecondary/ButtonSecondary';

function Keuzehulp() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isComplete, setIsComplete] = useState(false);

    const visualStepsTotal = 4;

    const questions = [
        {
            id: 'genre',
            question: 'Naar welk genre ben je op zoek?',
            subtitle: 'Je kunt slechts 1 kiezen.',
            options: [
                {value: 'action', label: 'Action'},
                {value: 'adventure', label: 'Adventure'},
                {value: 'arcade', label: 'Arcade'},
                {value: 'casual', label: 'Casual'},
                {value: 'indie', label: 'Indie'},
                {value: 'puzzle', label: 'Puzzle'},
                {value: 'rpg', label: 'RPG'},
                {value: 'shooter', label: 'Shooter'},
                {value: 'simulation', label: 'Simulation'},
                {value: 'strategy', label: 'Strategy'}
            ]
        },
        {
            id: 'platform',
            question: 'Op welk platform wil je spelen?',
            subtitle: 'Je moet minimaal 1 kiezen em maximaal 2.',
            options: [
                {value: '4', label: 'PC'},
                {value: '187', label: 'PlayStation 5'},
                {value: '18', label: 'PlayStation 4'},
                {value: '1', label: 'Xbox One'},
                {value: '186', label: 'Xbox Series X/S'}
            ]
        },
        {
            id: 'playStyle',
            question: 'Hoe speel je het liefst?',
            subtitle: 'Je moet minimaal 1 kiezen em maximaal 2.',
            options: [
                {value: '7', label: 'Singleplayer'},
                {value: '8', label: 'Multiplayer'},
                {value: '9', label: 'Co-op'}
            ]
        }
    ];

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => {
            const cur = prev[questionId] || [];
            const max = questionId === 'genre' ? 1 : 2;
            if (cur.includes(value)) return {...prev, [questionId]: cur.filter(v => v !== value)};
            if (cur.length < max) return {...prev, [questionId]: [...cur, value]};
            return prev;
        });
    };

    const handleNext = () => {
        const q = questions[currentStep];
        const cur = answers[q.id] || [];
        if (cur.length === 0) return;

        if (currentStep < questions.length - 1) setCurrentStep(s => s + 1); else setIsComplete(true);
    };

    const handlePrevious = () => {
        if (currentStep > 0) setCurrentStep(s => s - 1);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setAnswers({});
        setIsComplete(false);
    };

    const handleViewResults = () => {
        const params = new URLSearchParams();
        if (answers.genre?.length > 0) params.set('genre', answers.genre[0]);
        if (answers.platform?.length > 0) params.set('platform', answers.platform.join(','));
        if (answers.playStyle?.length > 0) params.set('features', answers.playStyle.join(','));
        navigate(`/ontdekken?${params.toString()}`);
    };

    const isAnswered = () => {
        const q = questions[currentStep];
        const cur = answers[q.id] || [];
        return cur.length > 0;
    };

    const currentQuestion = questions[currentStep];
    const currentAnswers = answers[currentQuestion.id] || [];
    const steps = questions.length + 1;
    const progressPct = (currentStep / (steps - 1)) * 100;

    if (isComplete) {
        return (
            <main className="keuzehulp-container">
                <section className="keuzehulp-complete">
                    <div className="keuzehulp-complete__icon" aria-hidden="true">✓</div>
                    <h1>Jouw perfecte game is gevonden!</h1>
                    <p>Op basis van jouw voorkeuren hebben we de beste games geselecteerd.</p>

                    <dl className="keuzehulp-summary">
                        <h3>Jouw keuzes</h3>

                        {answers.genre?.length > 0 && (<div className="keuzehulp-summary__row">
                                <dt className="keuzehulp-summary__label">Genre</dt>
                                <dd className="keuzehulp-summary__value">
                                    {questions[0].options.find(o => o.value === answers.genre[0])?.label}
                                </dd>
                            </div>)}

                        {answers.platform?.length > 0 && (<div className="keuzehulp-summary__row">
                                <dt className="keuzehulp-summary__label">Platform</dt>
                                <dd className="keuzehulp-summary__value">
                                    {answers.platform.map(p => {
                                        const option = questions[1].options.find(o => o.value === p);
                                        return option?.label;
                                    }).join(', ')}
                                </dd>
                            </div>)}

                        {answers.playStyle?.length > 0 && (<div className="keuzehulp-summary__row">
                                <dt className="keuzehulp-summary__label">Speelstijl</dt>
                                <dd className="keuzehulp-summary__value">
                                    {answers.playStyle.map(ps => {
                                        const option = questions[2].options.find(o => o.value === ps);
                                        return option?.label;
                                    }).join(', ')}
                                </dd>
                            </div>)}
                    </dl>

                    <div className="keuzehulp-complete__actions">
                        <ButtonSecondary onClick={handleReset}>
                            Opnieuw beginnen
                        </ButtonSecondary>
                        <ButtonPrimary onClick={handleViewResults}>
                            Bekijk aanbevolen games
                        </ButtonPrimary>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="keuzehulp-container">
            <div className="keuzehulp-layout">
                <aside className="keuzehulp-left">
                    <h1>Keuzehulp</h1>
                    <ShortDescription
                        maxLength={30}
                        text={"Deze slimme keuzehulp vertaalt jouw persoonlijke voorkeuren naar unieke aanbevelingen. Selecteer eenvoudig je favoriete genre, platform en speelstijl, waarna het systeem automatisch een selectie toont op de ontdekken pagina die aansluit bij jouw speelgedrag en interesses. Ontdek titels en verfijn je resultaten met één klik. Zo vind je moeiteloos de game die perfect past bij jouw manier van spelen."}
                    />

                    <div className="keuzehulp-info-card">
                        <img
                            src={KeuzehulpImg}
                            alt="Visuele weergave van de keuzehulp"
                            className="keuzehulp-info-card__img"
                        />
                        <div className="keuzehulp-info-card__body">
                            <h3>Hoe werkt de keuzehulp</h3>
                            <p className="keuzehulp-info-card__text">
                                Doorloop de korte vragenlijst, en wij vertalen je antwoorden naar een
                                gepersonaliseerde lijst met games.
                            </p>
                            <ul className="keuzehulp-info-card__list">
                                <li>
                                    <span className="keuzehulp-check" aria-hidden="true">✓</span>
                                    <span><strong>Stap 1:</strong> Kies je genre.</span>
                                </li>
                                <li>
                                    <span className="keuzehulp-check" aria-hidden="true">✓</span>
                                    <span><strong>Stap 2:</strong> Selecteer je platform(s).</span>
                                </li>
                                <li>
                                    <span className="keuzehulp-check" aria-hidden="true">✓</span>
                                    <span><strong>Stap 3:</strong> Bepaal je speelstijl.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>

                <section className="keuzehulp-right" role="form" aria-live="polite">
                    <div className="keuzehulp-card">
                        <header className="keuzehulp-header">
                            <h2>Zoek uw perfecte game</h2>
                            <p>Uw nieuwe favoriete game is dichterbij dan u denkt!</p>
                        </header>

                        <div
                            className="keuzehulp-line-progress"
                            role="progressbar"
                            aria-valuenow={currentStep}
                            aria-valuemin="0"
                            aria-valuemax={questions.length}
                            aria-label={`Voortgang: Stap ${currentStep + 1} van ${questions.length}`}
                        >
                            <div className="keuzehulp-line-progress__rail">
                                <div className="keuzehulp-line-progress__fill" style={{width: `${progressPct}%`}}/>
                            </div>
                            <div className="keuzehulp-line-progress__dots">
                                {Array.from({length: visualStepsTotal}).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`keuzehulp-dot ${i <= currentStep ? 'keuzehulp-dot--active' : ''} ${i === currentStep ? 'keuzehulp-dot--current' : ''}`}
                                        aria-current={i === currentStep ? 'step' : undefined}
                                        aria-label={`Stap ${i + 1}`}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <fieldset className="keuzehulp-question">
                            <legend className="keuzehulp-question__legend">
                                <h3>{currentQuestion.question}</h3>
                                <p className="keuzehulp-question__subtitle">{currentQuestion.subtitle}</p>
                            </legend>

                            <div className="keuzehulp-options">
                                {currentQuestion.options.map(option => (
                                    <button
                                        key={option.value}
                                        className={`keuzehulp-option ${currentAnswers.includes(option.value) ? 'keuzehulp-option--selected' : ''}`}
                                        onClick={() => handleAnswer(currentQuestion.id, option.value)}
                                        aria-pressed={currentAnswers.includes(option.value)}
                                    >
                                        <span className="keuzehulp-option__check" aria-hidden="true">
                                            {currentAnswers.includes(option.value) && '✓'}
                                        </span>
                                        <span className="keuzehulp-option__label">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        <div className="keuzehulp-navigation">
                            <ButtonSecondary onClick={handlePrevious} disabled={currentStep === 0}>
                                Vorige
                            </ButtonSecondary>
                            <ButtonPrimary onClick={handleNext} disabled={!isAnswered()}>
                                {currentStep === questions.length - 1 ? 'Voltooien' : 'Volgende Pagina'}
                            </ButtonPrimary>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Keuzehulp;