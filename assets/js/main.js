// Initialize content and animations
document.addEventListener('DOMContentLoaded', () => {
    // Render Content from Data
    renderContent();

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
        anchorPlacement: 'top-bottom',
    });

    // ScrollSpy & Smooth Scrolling
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#side-nav .nav-link');
    const progressBar = document.getElementById('scroll-progress-bar');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Scroll Progress & Side Nav Update
    let scrollTimeout;
    const sideNav = document.getElementById('side-nav');

    window.addEventListener('scroll', () => {
        // Show labels while scrolling
        if (sideNav) {
            sideNav.classList.add('is-scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                sideNav.classList.remove('is-scrolling');
            }, 1000); // Labels stay for 1s after scroll stops
        }

        // Overall page progress for the small vertical bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.height = scrolled + "%";
        }
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetPosition = targetElement.offsetTop - 80; // Compensate for topbar
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});

function renderContent() {
    const data = window.PISA_CONTENT;
    if (!data) return;

    // 1. Hero / Header
    const titleHeader = document.querySelector('.topbar h1');
    const subtitleHeader = document.querySelector('.topbar .hero-subtitle');
    if (titleHeader) titleHeader.textContent = data.hero.title;
    if (subtitleHeader) subtitleHeader.textContent = data.hero.subtitle;

    // 2. Abstract
    const abstractTitle = document.querySelector('#abstract .section-title');
    const abstractContent = document.querySelector('#abstract .abstract p');
    if (abstractTitle) abstractTitle.textContent = data.abstract.title;
    if (abstractContent) abstractContent.textContent = data.abstract.content;

    // 3. Existing Methods
    const existingMethodsContainer = document.querySelector('#existing-methods');
    if (existingMethodsContainer && data.existingMethods) {
        const title = existingMethodsContainer.querySelector('.section-title');
        if (title) title.textContent = data.existingMethods.title;

        // Clear and rebuild section content
        const oldContent = existingMethodsContainer.querySelectorAll('.section-intro, .intro-list, .methods-side-grid');
        oldContent.forEach(el => el.remove());

        // Add Intro
        if (data.existingMethods.intro) {
            const introP = document.createElement('p');
            introP.className = 'section-intro';
            introP.textContent = data.existingMethods.intro;
            existingMethodsContainer.appendChild(introP);
        }

        // Add Points
        if (data.existingMethods.points) {
            const list = document.createElement('ul');
            list.className = 'intro-list';
            list.innerHTML = data.existingMethods.points.map(p => `<li>${p}</li>`).join('');
            existingMethodsContainer.appendChild(list);
        }

        // Add Methods Side-by-Side Grid
        const grid = document.createElement('div');
        grid.className = 'methods-side-grid';
        grid.innerHTML = data.existingMethods.methods.map((method, idx) => `
            <div class="method-side-item ${idx % 2 === 1 ? 'reverse' : ''}" data-aos="fade-up">
                <div class="method-media">
                    <img src="${method.image}" alt="${method.title}">
                </div>
                <div class="method-detail">
                    <span class="conf-tag">${method.conference}</span>
                    <h3>${method.title}</h3>
                    <ul class="method-points">
                        ${method.description.map(pt => `<li>${pt}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
        existingMethodsContainer.appendChild(grid);
    }

    // 4. Problems
    const problemsSection = document.querySelector('#problems');
    if (problemsSection) {
        const title = problemsSection.querySelector('.section-title');
        if (title) title.textContent = data.problems.title;

        // Remove existing items and rebuild from data
        const containers = problemsSection.querySelectorAll('.approach-stage');
        containers.forEach(c => c.remove());

        data.problems.items.forEach(item => {
            const stageDiv = document.createElement('div');
            stageDiv.className = 'approach-stage';
            stageDiv.setAttribute('data-aos', 'fade-up');
            stageDiv.innerHTML = `
                <div class="approach-text">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
                <div class="approach-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
            `;
            problemsSection.appendChild(stageDiv);
        });
    }

    // 5. Approach
    const approachSection = document.querySelector('#our-approach');
    if (approachSection) {
        const title = approachSection.querySelector('.section-title');
        if (title) title.textContent = data.approach.title;

        // Remove existing items and rebuild from data
        const containers = approachSection.querySelectorAll('.approach-stage');
        containers.forEach(c => c.remove());

        data.approach.stages.forEach(stage => {
            const stageDiv = document.createElement('div');
            stageDiv.className = 'approach-stage';
            stageDiv.setAttribute('data-aos', 'fade-up');
            stageDiv.innerHTML = `
                <div class="approach-text">
                    <h3>${stage.title}</h3>
                    <p>${stage.description}</p>
                </div>
                <div class="approach-image">
                    <img src="${stage.image}" alt="${stage.title}">
                </div>
            `;
            approachSection.appendChild(stageDiv);
        });
    }

    // 6. Architecture & 7. Training (Dual Subsections)
    // renderDualSection('#model-architecture', data.architecture);
    renderDualSection('#training-paradigm', data.training);

    // 8. Results
    const resultsTitle = document.querySelector('#results .section-title');
    if (resultsTitle) resultsTitle.textContent = data.results.title;

    // Benchmarks Table
    const benchmarksDiv = document.querySelector('.results-benchmarks');
    if (benchmarksDiv) {
        const h3 = benchmarksDiv.querySelector('h3');
        if (h3) h3.textContent = data.results.benchmarks.title;

        // Subtitle
        let subtitle = benchmarksDiv.querySelector('.table-subtitle');
        if (!subtitle && data.results.benchmarks.subtitle) {
            subtitle = document.createElement('p');
            subtitle.className = 'table-subtitle';
            h3.after(subtitle);
        }
        if (subtitle) subtitle.textContent = data.results.benchmarks.subtitle;

        const thead = benchmarksDiv.querySelector('.benchmark-table thead');
        if (thead && data.results.benchmarks.groups) {
            thead.innerHTML = `
                <tr>
                    <th rowspan="2">Parameter</th>
                    ${data.results.benchmarks.groups.map((g, idx) => `<th colspan="${g.colspan}" class="${idx === 2 ? 'pisa-stage-2-header' : ''}">${g.label}</th>`).join('')}
                </tr>
                <tr>
                    ${data.results.benchmarks.subheaders.map((s, idx) => `
                        <th class="${idx >= 4 ? 'pisa-stage-2-col' : ''} ${idx === 4 ? 'pisa-stage-2-left' : ''} ${idx === 5 ? 'pisa-stage-2-right' : ''}">${s}</th>
                    `).join('')}
                </tr>
            `;
        }

        const tbody = benchmarksDiv.querySelector('.benchmark-table tbody');
        if (tbody && data.results.benchmarks.rows) {
            tbody.innerHTML = data.results.benchmarks.rows.map(row => {
                const hasBold = row.values.some(v => v.bold);
                return `
                    <tr class="${hasBold ? 'highlight-row' : ''}">
                        <td>${row.parameter}</td>
                        ${row.values.map((v, idx) => `
                            <td class="${idx >= 4 ? 'pisa-stage-2-col' : ''} ${idx === 4 ? 'pisa-stage-2-left' : ''} ${idx === 5 ? 'pisa-stage-2-right' : ''}">
                                ${v.bold ? `<strong>${v.val}</strong>` : v.val}
                            </td>
                        `).join('')}
                    </tr>
                `;
            }).join('');
        }
    }

    // Audio Samples comparison
    const audiosDiv = document.querySelector('.results-audios');
    if (audiosDiv && data.results.audios) {
        audiosDiv.innerHTML = `
            <h3>${data.results.audios.title}</h3>
            <p class="table-subtitle">${data.results.audios.subtitle}</p>
            <div class="audio-comparison-grid">
                <div class="audio-grid-header">
                    <div class="header-info">Speaker & Content</div>
                    <div class="header-audio">Ground Truth</div>
                    <div class="header-audio">Baseline (Universal)</div>
                    <div class="header-audio">PISA (Ours)</div>
                </div>
                ${data.results.audios.items.map(item => `
                    <div class="audio-row" data-aos="fade-up">
                        <div class="audio-info">
                            <span class="speaker-label">${item.speaker}</span>
                            <p class="utterance-text">"${item.text}"</p>
                        </div>
                        <div class="audio-player-container">
                            <audio controls src="./assets/audios/${item.prefix}_gt.wav"></audio>
                        </div>
                        <div class="audio-player-container">
                            <audio controls src="./assets/audios/${item.prefix}_gen.wav"></audio>
                        </div>
                        <div class="audio-player-container">
                            <audio controls src="./assets/audios/${item.prefix}_generated_e2e.wav"></audio>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Parameters Following Plot
    const paramsDiv = document.querySelector('.parameters-following');
    if (paramsDiv && data.results.parameters) {
        paramsDiv.innerHTML = `
            <h3>${data.results.parameters.title}</h3>
            <p class="table-subtitle">${data.results.parameters.subtitle}</p>
            <div class="large-plot-container">
                <img src="${data.results.parameters.image}" alt="${data.results.parameters.title}">
            </div>
        `;
    }

    // Examples Gallery
    const galleryDiv = document.querySelector('.examples-gallery');
    if (galleryDiv && data.results.qualitative) {
        const h3 = galleryDiv.querySelector('h3');
        if (h3) h3.textContent = data.results.qualitative.title;

        // Clear existing items
        const existingItems = galleryDiv.querySelectorAll('.example-item');
        existingItems.forEach(item => item.remove());

        data.results.qualitative.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'example-item';
            itemDiv.innerHTML = `
                <h4>${item.title}</h4>
                <div class="spectrogram-grid">
                    ${item.specs.map(spec => `
                        <div class="spec-card ${spec.highlight ? 'highlighting' : ''}">
                            <img src="${spec.image}" alt="${spec.label}">
                            <span>${spec.label}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            galleryDiv.appendChild(itemDiv);
        });
    }
}

function renderDualSection(selector, sectionData) {
    const section = document.querySelector(selector);
    if (!section) return;

    const title = section.querySelector('.section-title');
    if (title) title.textContent = sectionData.title;

    if (sectionData.intro) {
        let introP = section.querySelector('.section-intro');
        if (!introP) {
            introP = document.createElement('p');
            introP.className = 'section-intro';
            title.after(introP);
        }
        introP.textContent = sectionData.intro;
    }

    const container = section.querySelector('.dual-subsection-container');
    if (container) {
        container.innerHTML = sectionData.subsections.map(sub => `
            <div class="subsection">
                <h3>${sub.title}</h3>
                <p>${sub.description}</p>
                ${sub.image ? `<img src="${sub.image}" alt="${sub.title}">` : ''}
                ${sub.placeholder ? `
                    <div class="placeholder-diagram">
                        <p>${sub.placeholder}</p>
                    </div>
                ` : ''}
                ${sub.components ? `
                    <div class="training-map">
                        <div class="map-range-header">
                            <span>Epoch ${sub.range[0]}</span>
                            <span>Epoch ${sub.range[1]}</span>
                        </div>
                        <div class="map-legend">
                            <div class="legend-item">
                                <span class="legend-box active-box"></span>
                                <span>${window.PISA_CONTENT.training.legend.active}</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-box anneal-box"></span>
                                <span>${window.PISA_CONTENT.training.legend.annealing}</span>
                            </div>
                        </div>
                        <div class="map-rows">
                            ${sub.components.map(comp => {
            const total = sub.range[1] - sub.range[0];
            const start = ((comp.epochs[0] - sub.range[0]) / total) * 100;
            const width = ((comp.epochs[1] - comp.epochs[0]) / total) * 100;

            let annealBar = '';
            if (comp.anneal) {
                const aStart = ((comp.anneal[0] - comp.epochs[0]) / (comp.epochs[1] - comp.epochs[0])) * 100;
                const aWidth = ((comp.anneal[1] - comp.anneal[0]) / (comp.epochs[1] - comp.epochs[0])) * 100;
                annealBar = `<div class="anneal-bar" style="left: ${aStart}%; width: ${aWidth}%"></div>`;
            }

            return `
                                    <div class="component-row">
                                        <div class="comp-info">
                                            <span class="comp-name">${comp.name}</span>
                                            <span class="comp-desc">${comp.description}</span>
                                        </div>
                                        <div class="comp-track">
                                            <div class="comp-bar" style="left: ${start}%; width: ${width}%" data-tooltip="${comp.tooltip}">
                                                ${annealBar}
                                            </div>
                                        </div>
                                    </div>
                                `;
        }).join('')}
                        </div>
                    </div>
                ` : ''}
                ${sub.timeline ? `
                    <div class="timeline-container">
                        ${sub.timeline.map((item, idx) => `
                            <div class="timeline-item">
                                <div class="timeline-marker">
                                    <div class="timeline-dot"></div>
                                    ${idx < sub.timeline.length - 1 ? '<div class="timeline-line"></div>' : ''}
                                </div>
                                <div class="timeline-content">
                                    <h4>${item.label}</h4>
                                    <ul>
                                        ${item.points.map(p => `<li>${p}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${sub.note ? `
                    <div class="subsection-note">
                        <i class="fas fa-info-circle"></i> ${sub.note}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
}

