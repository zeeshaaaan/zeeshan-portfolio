(function () {
    'use strict';

    /* ---------- Knowledge base ---------- 
       Each intent has keywords (for scoring) and an HTML answer. */
    const KB = [
        {
            id: 'greeting',
            keywords: ['hi', 'hello', 'hey', 'yo', 'greetings', 'good morning', 'good evening'],
            answer: `Hey there! I'm Zeeshan's assistant. Ask me about his <strong>experience</strong>, <strong>skills</strong>, <strong>projects</strong>, or how to <strong>get in touch</strong>.`
        },
        {
            id: 'about',
            keywords: ['who', 'about', 'yourself', 'introduce', 'tell me', 'background', 'summary', 'zeeshan'],
            answer: `<strong>Zeeshan Ali</strong> is a Senior Angular / UI Developer with <strong>7+ years</strong> of experience architecting enterprise-grade frontend applications. He specializes in <strong>Micro-Frontend architecture</strong> (Webpack Module Federation), NgRx state management, TypeScript, and performance optimization.`
        },
        {
            id: 'experience',
            keywords: ['experience', 'work', 'career', 'job', 'companies', 'history', 'worked', 'employer', 'years'],
            answer: `Zeeshan has <strong>6+ years</strong> across three global firms: <ul><li><strong>Accenture</strong> — App Dev Senior Analyst (Mar 2023 – Present)</li><li><strong>Infosys</strong> — Senior Systems Engineer (Dec 2021 – Mar 2023)</li><li><strong>Wipro</strong> — Project Engineer (Nov 2018 – Dec 2021)</li></ul>Ask about any of them for details!`
        },
        {
            id: 'accenture',
            keywords: ['accenture', 'current', 'now', 'present', 'latest', 'recent'],
            answer: `At <strong>Accenture</strong> (Mar 2023 – Present), Zeeshan architected an <strong>Angular 21 micro-frontend shell</strong> orchestrating 9+ federated modules via Module Federation, engineered centralized <strong>NgRx</strong> state, built multi-layer session security (idle timeout, JWT refresh, cross-tab logout sync), and a custom RouteReuseStrategy. He earned the <strong>Pinnacle Award</strong> for his impact.`
        },
        {
            id: 'infosys',
            keywords: ['infosys', 'adminportal', 'survey'],
            answer: `At <strong>Infosys</strong> (Dec 2021 – Mar 2023), Zeeshan developed features for <strong>AdminPortal</strong> using Angular, TypeScript, RxJS and REST APIs, built reusable survey components (text &amp; star-rating) with Reactive Forms and custom validators, and authored unit tests to ensure quality.`
        },
        {
            id: 'wipro',
            keywords: ['wipro', 'singtel', 'ijoin', 'maps', 'comcenter', 'onboarding'],
            answer: `At <strong>Wipro</strong> (Nov 2018 – Dec 2021), Zeeshan built the <strong>Singtel iJoin App</strong> (Pre-boarding &amp; Onboarding) with Angular, SCSS and Bootstrap, and implemented the <strong>ComCenter map</strong> feature using the Google Maps API — applying responsive, mobile-hybrid design throughout.`
        },
        {
            id: 'microfrontend',
            keywords: ['micro', 'microfrontend', 'micro-frontend', 'module', 'federation', 'webpack', 'shell', 'remote', 'architecture'],
            answer: `Micro-Frontends are Zeeshan's specialty. He designed a <strong>manifest-driven Module Federation shell</strong> dynamically registering <strong>9+ independently deployable remotes</strong> (e.g. Enrollment, Validation, Assessment, Notifications, Admin), with singleton shared dependencies and zero-downtime deploys via automated version polling.`
        },
        {
            id: 'ngrx',
            keywords: ['ngrx', 'state', 'store', 'redux', 'effects', 'selectors'],
            answer: `Zeeshan engineered <strong>centralized NgRx state</strong> across all remote modules — feature stores, effects, selectors, and meta-reducers (including logout state clearing) — plus store-devtools for time-travel debugging. This standardized data flow and reduced state-related bugs.`
        },
        {
            id: 'skills',
            keywords: ['skill', 'skills', 'tech', 'stack', 'technologies', 'tools', 'know', 'expertise', 'languages'],
            answer: `Zeeshan's core stack:<ul><li><strong>Frameworks:</strong> Angular 15 / 16 / 21, Angular Material, RxJS, NgRx, ngx-formly, ngx-translate</li><li><strong>Languages:</strong> TypeScript, JavaScript (ES6+), HTML5, SCSS</li><li><strong>Architecture:</strong> Micro-Frontend, Module Federation, PWA</li><li><strong>Testing/DevOps:</strong> Jest, Git, SonarQube, Jira, Gerrit</li></ul>`
        },
        {
            id: 'performance',
            keywords: ['performance', 'optimize', 'optimization', 'fast', 'speed', 'zone', 'change detection'],
            answer: `Performance is a focus area. Zeeshan optimized change detection by running session timeouts and version polling outside Angular's zone with <code>runOutsideAngular()</code>, used a custom RouteReuseStrategy to preserve state and speed navigation, and configured a PWA service worker for offline caching.`
        },
        {
            id: 'accessibility',
            keywords: ['accessibility', 'a11y', 'wcag', 'ada', 'aria', 'i18n', 'language', 'translation', 'responsive'],
            answer: `Zeeshan builds inclusive UIs: <strong>WCAG accessibility</strong> (skip-to-main, ARIA labels, keyboard nav, focus management), full <strong>cross-browser</strong> support, multi-language <strong>i18n</strong> (English / Spanish, runtime switching), and responsive adaptive layouts using ResizeObserver.`
        },
        {
            id: 'education',
            keywords: ['education', 'degree', 'college', 'university', 'study', 'btech', 'b.tech', 'graduate', 'studied'],
            answer: `Zeeshan holds a <strong>B.Tech in Computer Science &amp; Engineering</strong> from Dr. B.C. Roy Engineering College (MAKAUT University), Durgapur — 2014 to 2018.`
        },
        {
            id: 'awards',
            keywords: ['award', 'recognition', 'achievement', 'pinnacle', 'trailblazer'],
            answer: `Zeeshan received the <strong>Pinnacle Award — Trailblazer &amp; Cool Collaborator</strong> at Accenture for outstanding contributions to his team and project.`
        },
        {
            id: 'location',
            keywords: ['where', 'location', 'based', 'live', 'city', 'kolkata', 'india', 'relocate'],
            answer: `Zeeshan is based in <strong>Kolkata, India</strong>. He has extensive experience working with cross-functional, distributed teams in Agile environments.`
        },
        {
            id: 'availability',
            keywords: ['available', 'hire', 'hiring', 'open', 'opportunity', 'role', 'looking', 'join', 'recruit'],
            answer: `Yes — Zeeshan is <strong>open to senior frontend &amp; architecture roles</strong>. If you need someone who can tame large-scale Angular and ship it cleanly, the best next step is to email him. Want his contact details?`
        },
        {
            id: 'contact',
            keywords: ['contact', 'email', 'reach', 'phone', 'call', 'linkedin', 'connect', 'talk', 'mail', 'number'],
            answer: `Here's how to reach Zeeshan:<ul><li><a href="mailto:zeeshan2211997@gmail.com">zeeshan2211997@gmail.com</a></li><li><a href="tel:+918759052341">+91 87590 52341</a></li><li><a href="https://linkedin.com/in/zeeshan-ali-865112116" target="_blank" rel="noopener">LinkedIn</a></li></ul>`
        },
        {
            id: 'resume',
            keywords: ['resume', 'cv', 'download', 'pdf'],
            answer: `You can <a href="Zeeshan_Ali_Resume.pdf" download>download Zeeshan's résumé (PDF)</a> right here. It covers his full experience, skills, and education.`
        },
        {
            id: 'thanks',
            keywords: ['thanks', 'thank', 'cool', 'awesome', 'nice', 'great', 'perfect', 'ok', 'okay'],
            answer: `You're welcome! Anything else you'd like to know about Zeeshan?`
        }
    ];

    const FALLBACK = `I'm not sure about that one — but I can tell you about Zeeshan's <strong>experience</strong>, <strong>skills</strong>, <strong>micro-frontend work</strong>, <strong>education</strong>, or how to <strong>contact</strong> him. Try one of the suggestions below!`;

    const SUGGESTIONS = [
        'Tell me about Zeeshan',
        'What are his skills?',
        'Micro-frontend experience?',
        'Is he available to hire?',
        'How do I contact him?'
    ];

    /* ---------- Intent matching ---------- */
    function findAnswer(text) {
        const q = ' ' + text.toLowerCase().replace(/[^\w\s]/g, ' ') + ' ';
        let best = null, bestScore = 0;
        KB.forEach(function (intent) {
            let score = 0;
            intent.keywords.forEach(function (kw) {
                if (q.indexOf(' ' + kw) !== -1 || q.indexOf(kw + ' ') !== -1 || q.indexOf(kw) !== -1) {
                    score += kw.length > 4 ? 2 : 1; // longer keywords weigh more
                }
            });
            if (score > bestScore) { bestScore = score; best = intent; }
        });
        return bestScore > 0 ? best.answer : FALLBACK;
    }

    /* ---------- DOM ---------- */
    const fab = document.getElementById('chatFab');
    const panel = document.getElementById('chatbot');
    const closeBtn = document.getElementById('chatClose');
    const body = document.getElementById('chatBody');
    const chips = document.getElementById('chatChips');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    if (!fab || !panel) return;

    let opened = false;

    function scrollDown() { body.scrollTop = body.scrollHeight; }

    function addMessage(html, who) {
        const el = document.createElement('div');
        el.className = 'msg msg--' + who;
        el.innerHTML = html;
        body.appendChild(el);
        scrollDown();
    }

    function showTyping() {
        const t = document.createElement('div');
        t.className = 'typing';
        t.id = 'typingIndicator';
        t.innerHTML = '<span></span><span></span><span></span>';
        body.appendChild(t);
        scrollDown();
    }
    function hideTyping() {
        const t = document.getElementById('typingIndicator');
        if (t) t.remove();
    }

    function botReply(text) {
        showTyping();
        const delay = 500 + Math.min(text.length * 6, 900);
        setTimeout(function () {
            hideTyping();
            addMessage(findAnswer(text), 'bot');
        }, delay);
    }

    function renderChips() {
        chips.innerHTML = '';
        SUGGESTIONS.forEach(function (s) {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = s;
            b.addEventListener('click', function () { send(s); });
            chips.appendChild(b);
        });
    }

    function send(text) {
        text = text.trim();
        if (!text) return;
        addMessage(text.replace(/</g, '&lt;'), 'user');
        input.value = '';
        botReply(text);
    }

    function openChat() {
        panel.classList.add('open');
        fab.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        if (!opened) {
            opened = true;
            setTimeout(function () {
                addMessage("Hi! I'm <strong>Zeeshan's assistant</strong>. Ask me anything about his experience, skills, or projects — or tap a suggestion below.", 'bot');
                renderChips();
            }, 300);
        }
        setTimeout(function () { input.focus(); }, 350);
    }
    function closeChat() {
        panel.classList.remove('open');
        fab.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
    }

    fab.addEventListener('click', function () {
        panel.classList.contains('open') ? closeChat() : openChat();
    });
    closeBtn.addEventListener('click', closeChat);
    form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.classList.contains('open')) closeChat();
    });
})();
