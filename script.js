document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const TOTAL_IMAGES = 60;
    const QUIZ_SIZE = 10;
    
    // Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const demographicsScreen = document.getElementById('demographics-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startButton = document.getElementById('start-quiz');
    const currentImage = document.getElementById('current-image');
    const btnAI = document.getElementById('btn-ai');
    const btnReal = document.getElementById('btn-real');
    const questionCounter = document.getElementById('question-counter');
    const progressBar = document.getElementById('progress-bar');
    const demographicsForm = document.getElementById('demographics-form');
    
    // Quiz state
    let selectedImages = [];
    let currentQuestionIndex = 0;
    let userResponses = new Array(TOTAL_IMAGES + 1).fill(0);
    
    // Google Form settings
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeOOg_rCbQ-Z4CuvJAIJHnP_QZdn4mmZ3aB9C-G7aziEa92jg/formResponse';

    // Entry IDs for Google Form
    const FORM_ENTRIES = {
        age: 'entry.1912540678',
        gender: 'entry.592245834',
        occupation: 'entry.1570800905',
        experience: 'entry.1143881926',
    };
    
    // Event listeners
    startButton.addEventListener('click', startQuiz);
    btnAI.addEventListener('click', () => recordAnswer(true));
    btnReal.addEventListener('click', () => recordAnswer(false));
    demographicsForm.addEventListener('submit', submitResults);
    
    // Functions
    function startQuiz() {
        selectedImages = selectRandomImages();
        welcomeScreen.classList.add('d-none');
        quizScreen.classList.remove('d-none');
        loadQuestion(0);
    }
    
    function selectRandomImages() {
        let selected = [];
        let indices = new Set();
        let imageIndex;
        let extension = '';
        
        for (let i = 0; i < QUIZ_SIZE; i++) {
            // Choose random image
            do {
                imageIndex = Math.floor(Math.random() * TOTAL_IMAGES) + 1;
            } while (indices.has(imageIndex));
            
            indices.add(imageIndex);

            // Determine jpg vs png
            let ai = false;
            if (imageIndex <= 30) {
                extension = 'jpg';
            } else {
                extension = 'png';
                ai = true;
            }
            
            // Construct the folder path
            const imagePath = `data/${imageIndex}.${extension}`;
            
            selected.push({
                path: imagePath,
                isAI: ai,
                imageId: imageIndex
            });
        }
        
        return selected;
    }
    
    function loadQuestion(index) {
        if (index >= selectedImages.length) {
            showDemographicsScreen();
            return;
        }
        
        // Reset button selection
        btnAI.classList.remove('selected');
        btnReal.classList.remove('selected');
        
        // Update UI
        currentQuestionIndex = index;
        const imageData = selectedImages[index];
        currentImage.src = imageData.path;
        questionCounter.textContent = `Question ${index + 1} of ${QUIZ_SIZE}`;
        progressBar.style.width = `${((index + 1) / QUIZ_SIZE) * 100}%`;
    }
    
    function recordAnswer(userSelectedAI) {
        // Highlight selected button
        btnAI.classList.toggle('selected', userSelectedAI);
        btnReal.classList.toggle('selected', !userSelectedAI);
        
        const imageData = selectedImages[currentQuestionIndex];
        const isCorrect = (userSelectedAI === imageData.isAI);
        
        // Record whether answer was correct (2) or incorrect (1)
        userResponses[imageData.imageId] = isCorrect ? 2 : 1;
        
        setTimeout(() => {
            loadQuestion(currentQuestionIndex + 1);
        }, 100);
    }
    
    function showDemographicsScreen() {
        quizScreen.classList.add('d-none');
        demographicsScreen.classList.remove('d-none');
    }
    
    function submitResults(e) {
        e.preventDefault();
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_FORM_URL;
        form.target = '_blank';
        
        // Add demographic information
        const ageInput = createHiddenInput(FORM_ENTRIES.age, document.getElementById('age').value);
        const genderInput = createHiddenInput(FORM_ENTRIES.gender, document.getElementById('gender').value);
        const occupationInput = createHiddenInput(FORM_ENTRIES.occupation, document.getElementById('occupation').value);
        const experienceInput = createHiddenInput(FORM_ENTRIES.experience, document.getElementById('experience').value);

        form.appendChild(ageInput);
        form.appendChild(genderInput);
        form.appendChild(occupationInput);
        form.appendChild(experienceInput);
        
        const imageEntryIds = [
            null,
            "entry.50474045", "entry.942391462", "entry.733697951", "entry.1200794015", "entry.1740965885",
            "entry.784858993", "entry.458812333", "entry.12056080", "entry.1801819226", "entry.1688171437",
            "entry.156622096", "entry.118689194", "entry.1763150656", "entry.1161211203", "entry.537633582",
            "entry.505609603", "entry.747806912", "entry.1626192513", "entry.234432985", "entry.1480742866",
            "entry.436437140", "entry.514394982", "entry.958528072", "entry.346885834", "entry.1135107736",
            "entry.250740613", "entry.531341568", "entry.735075617", "entry.1189178750", "entry.683648801",
            "entry.1324631045", "entry.1384842740", "entry.769300156", "entry.1833610928", "entry.312730017",
            "entry.1208583626", "entry.598846663", "entry.1540374881", "entry.830899269", "entry.1718913001",
            "entry.688268869", "entry.107763086", "entry.1904044078", "entry.2095812983", "entry.286185244",
            "entry.981969523", "entry.1833103938", "entry.1986930285", "entry.1430901426", "entry.767609290",
            "entry.1296108059", "entry.1804071793", "entry.237593554", "entry.308691268", "entry.1720842742",
            "entry.960353249", "entry.1412670801", "entry.1547620868", "entry.843783385", "entry.2056483477",
            "entry.759234781"
        ];
        
        for (let i = 1; i <= TOTAL_IMAGES; i++) {
            // 0 = not shown, 1 = incorrect, 2 = correct
            const input = createHiddenInput(imageEntryIds[i], userResponses[i]);
            form.appendChild(input);
        }

        // Add website passkey
        const extraInput = createHiddenInput("entry.759234781", "SentFromWebsite");
        form.appendChild(extraInput);
        
        // Submit form
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        console.log(form);
        
        // Show results screen
        demographicsScreen.classList.add('d-none');
        resultsScreen.classList.remove('d-none');
    }
    
    function createHiddenInput(name, value) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        return input;
    }
});
