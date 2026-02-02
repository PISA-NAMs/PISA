const PISA_CONTENT = {
    hero: {
        title: "PISA",
        subtitle: "Anonymous submission for InterSpeech 2026"
    },
    abstract: {
        title: "PISA (Physics-Informed Speaker-Aware Augmentation for Non-Audible Murmur to Speech Synthesis)",
        content: "Silent communication involves complex neural coordination, where brain signals drive vocal tract articulators to flow into articulate sounds. This process breaks down in cases of vocal tract pathology. Beyond clinical scenarios, daily situations also demand alternatives to conventional speech. These constraints have motivated research into Silent Speech Interfaces (SSI), which aim to capture non-acoustic physiological signals associated with speech production and decode them into intelligible speech. Among SSI approaches, Non-Audible Murmur (NAM) microphones offer a compelling alternative by capturing tissue-conducted vibrations through a contact sensor placed behind the ear during silent articulation. Unlike other methods, NAM requires no invasive attachments, bulky imaging equipment, or controlled lighting, enabling a software-centric pathway for NAM-to-speech conversion."
    },
    existingMethods: {
        title: "Existing Methods",
        methods: [
            {
                title: "Aligning NAMs & speech",
                description: "Dynamic Time Warping (DTW) is a common approach to align NAMs and speech in time",
                image: "./assets/img/dtw.png"
            },
            {
                title: "Towards Improving NAM-to-Speech Synthesis Intelligibility using Self-Supervised Speech Models",
                description: "Existing approaches for augmentation treat NAMs as devoid of any speaker information.",
                image: "./assets/img/existing_methods_towards_improving_nam_to_speech.png"
            },
            {
                title: "NAM-to-Speech Conversion with Multitask-Enhanced Autoregressive Models",
                description: "Vocoders are trained to generate NAMs from discrete HuBERT units. HuBERT units can be extracted from speech and then used to generated corresponding NAMs",
                image: "./assets/img/existing_methods_nam_to_speech_conversion.png"
            }
        ]
    },
    problems: {
        title: "Problems in existing approaches",
        items: [
            {
                title: "Loss of speaker-specific information",
                description: "Speaker-specific information is usually lost by most augmentation methods since they assume that NAMs are speaker-invariant. Baseline generated NAMs show roughly 8% variance retention for features such as pitch.",
                image: "./assets/img/baseline_problems_1.png"
            },
            {
                title: "No guarantees of synthetic data following physical properties of real NAMs",
                description: "Most methods do not guarantee that the generated data follows the physical properties of real NAMs. Baseline generated NAMs showed 0% variance retention for RMS energy and only 8.79% for High Frequency Energy ratio.",
                image: "./assets/img/baseline_problems_2.png"
            }
        ]
    },
    approach: {
        title: "Our Approach",
        stages: [
            {
                title: "Stage 1: Speaker-invariant NAM generation",
                description: "Some properties of NAMs such as High Frequency Energy Ratio & RMS Energy demonstrate similar distributions regardless of the speaker. In the first stage, we generate NAMs that follow these constraints while preserving contents from clean speech.",
                image: "./assets/img/our_approach_stage_1.png"
            },
            {
                title: "Stage 2: Speaker-modulated Generations",
                description: "Once we have the speaker-invariant NAMs, we use a small diffusion transformer conditioned on speaker features to generate NAMs that follow speaker-specific features such as spectral flatness, pitch and temporal jitter.",
                image: "./assets/img/our_approach_stage_2.png"
            }
        ]
    },
    architecture: {
        title: "Model Architecture",
        intro: "PISA is built on a two-tier architecture: a foundation layer for speaker-invariant features and a modulation layer for personalized identity injection.",
        subsections: [
            {
                title: "Speaker-Invariant Generator",
                description: "In this stage, we train the model to generate speaker-invariant NAMs. An 8-layer CNN-based module is used as the generator in this stage.",
                image: "./assets/img/our_approach_stage_1.png"
            },
            {
                title: "Speaker-Modulated Generator",
                description: "In this stage, we train the model to generate speaker-specific NAMs. We use 2 DiT blocks in this stage. The DiT blocks are conditioned on the speaker specific parameters.",
                image: "./assets/img/our_approach_stage_2.png"
            }
        ]
    },
    training: {
        title: "Training Paradigm",
        intro: "The training progresses from learning general physical constraints to refining speaker-specific acoustic distributions.",
        legend: {
            active: "Component Active",
            annealing: "Weight Annealing Phase"
        },
        subsections: [
            {
                title: "Stage 1: Speaker-Invariant NAM Training",
                description: "The speaker-invariant generator is trained to predict speaker-invariant NAMs. ",
                range: [1, 60],
                components: [
                    {
                        name: "Spectral Reconstruction",
                        epochs: [1, 60],
                        description: "Learning base speech structure",
                        tooltip: "Multi-scale Spectral loss to ensure structural fidelity in the generated mel-spectrograms."
                    },
                    {
                        name: "Gradient Reversal",
                        epochs: [1, 60],
                        description: "Stripping speaker-specific identity",
                        tooltip: "We add a CNN-based regression head to predict values for speaker-specific parameters such as spectral centroid, pitch and spectral flatness. Uses a GRL layer to maximize the regression error, ensuring content representations are speaker-invariant."
                    },
                    {
                        name: "Adversarial Training",
                        epochs: [11, 60],
                        description: "Enhancing spectrogram realism",
                        tooltip: "A GAN-based discriminator distinguishes between real real-NAM distributions and synthetic generations. This helps the generator model finer details in the spectrograms."
                    },
                    {
                        name: "Physics Constraints",
                        epochs: [11, 60],
                        anneal: [11, 50],
                        description: "Enforcing physical properties of NAMs",
                        tooltip: "Ensures the generated signal follows the physical properties typical of NAMs."
                    }
                ]
            },
            {
                title: "Stage 2: Speaker-Modulated Training",
                description: "The speaker-modulated generator is trained to predict speaker-specific NAMs using the universal NAMs generated by the universal generator and speaker features.",
                range: [61, 150],
                components: [
                    {
                        name: "Spectral Refinement",
                        epochs: [61, 150],
                        description: "Injecting high-fidelity details",
                        tooltip: "Multi-scale Spectral loss to ensure structural fidelity in the generated mel-spectrograms."
                    },
                    {
                        name: "Adversarial Modulation",
                        epochs: [61, 150],
                        description: "Tailoring realism to specific speakers",
                        tooltip: "A conditional discriminator ensures the fine-grained texture matches the target speaker's vocal characteristics."
                    },
                    {
                        name: "Speaker Physics",
                        epochs: [71, 150],
                        anneal: [71, 111],
                        description: "Enforcing speaker-specific acoustics",
                        tooltip: "Optimizes for speaker-specific distributional fidelity metrics like Spectral Centroid and Temporal Jitter."
                    }
                ],
                note: "Universal Encoder training persists from Stage 1."
            }
        ]
    },
    results: {
        title: "Results & Validation",
        benchmarks: {
            title: "Distributional Fidelity Metrics for Synthetic NAM",
            subtitle: "Normalized mean error (%, ideal: 0) and variance retention (%, ideal: 100) relative to real NAMs from StethoText corpus.",
            groups: [
                { label: "Baseline", colspan: 2 },
                { label: "PISA (Stage 1)", colspan: 2 },
                { label: "PISA (Stage 2)", colspan: 2 }
            ],
            subheaders: ["Mean", "Var", "Mean", "Var", "Mean", "Var"],
            rows: [
                {
                    parameter: "HF Energy Ratio",
                    values: [
                        { val: "1.11", bold: true }, { val: "8.79" },
                        { val: "5.75" }, { val: "20.76" },
                        { val: "8.45" }, { val: "92.32", bold: true }
                    ]
                },
                {
                    parameter: "RMS dB",
                    values: [
                        { val: "-100" }, { val: "0.00" },
                        { val: "-0.76", bold: true }, { val: "132.31", bold: true },
                        { val: "-17.55" }, { val: "56.07" }
                    ]
                },
                {
                    parameter: "Spectral Centroid",
                    values: [
                        { val: "-0.03", bold: true }, { val: "12.77" },
                        { val: "4.70" }, { val: "13.88" },
                        { val: "6.75" }, { val: "100.83", bold: true }
                    ]
                },
                {
                    parameter: "Spectral Flatness",
                    values: [
                        { val: "16.87" }, { val: "25.28" },
                        { val: "8.92" }, { val: "21.45" },
                        { val: "0.27", bold: true }, { val: "99.65", bold: true }
                    ]
                },
                {
                    parameter: "Temporal Jitter",
                    values: [
                        { val: "580" }, { val: "786.03" },
                        { val: "-20", bold: true }, { val: "68.65" },
                        { val: "-20", bold: true }, { val: "75.14", bold: true }
                    ]
                },
                {
                    parameter: "Pitch Mean",
                    values: [
                        { val: "28.14" }, { val: "6.19" },
                        { val: "16.70", bold: true }, { val: "7.56" },
                        { val: "48.49" }, { val: "93.48", bold: true }
                    ]
                }
            ]
        },
        qualitative: {
            title: "Qualitative Spectrogram Comparisons",
            items: [
                {
                    title: "Example 1",
                    specs: [
                        { label: "Ground Truth", image: "./assets/img/example_1_gt.png" },
                        { label: "Baseline", image: "./assets/img/example_1_baseline.png" },
                        { label: "PISA (Universal)", image: "./assets/img/example_1_gen_univ.png" },
                        { label: "PISA (Speaker-Modulated)", image: "./assets/img/example_1_gen_spk.png", highlight: true }
                    ]
                },
            ]
        },
        parameters: {
            title: "Speaker Parameters Following",
            subtitle: "Comparing acoustic parameter distributions for generations from stage 1 (Universal) and stage 2 (Speaker-Modulated) modules against the ground truth real-NAMs.",
            image: "./assets/img/speaker_params_following_demonstration.png"
        }
    }
};

window.PISA_CONTENT = PISA_CONTENT;
