// Troubleshooting Wizard State
const state = {
    currentStep: 0,
    answers: {},
    fixesTried: []
};

// Wizard Steps
const steps = [
    {
        id: 'welcome',
        type: 'info',
        question: 'Welcome to Printer Troubleshooting',
        description: 'This wizard will help you diagnose and fix your printer issue. We\'ll ask you some questions and guide you through solutions step by step.',
        action: () => nextStep()
    },
    {
        id: 'device',
        type: 'choice',
        question: 'What device are you using with your printer?',
        description: 'Select the Square device you\'re trying to connect your printer to:',
        options: [
            'Square Register',
            'Square Stand',
            'Square Terminal',
            'Square Handheld',
            'iPad/iPhone',
            'Android device'
        ]
    },
    {
        id: 'worked-before',
        type: 'choice',
        question: 'Has this printer worked before?',
        description: 'This helps us understand if this is a setup issue or something changed:',
        options: [
            'Yes, it worked before',
            'No, this is my first time setting it up'
        ]
    },
    {
        id: 'printer-type',
        type: 'choice',
        question: 'What type of printer are you using?',
        description: 'Select your printer connection type:',
        options: [
            'USB Printer',
            'Wi-Fi Printer',
            'Ethernet Printer',
            'Bluetooth Printer',
            'I\'m not sure'
        ]
    },
    {
        id: 'printer-type-help',
        type: 'printer-help',
        question: 'Let\'s figure out your printer type',
        description: 'Here\'s how to identify which type of printer you have:'
    },
    {
        id: 'issue-type',
        type: 'choice',
        question: 'What problem are you experiencing?',
        description: 'Select the issue that best describes your situation:',
        options: [
            'Printer won\'t print at all',
            'Paper jam',
            'Poor print quality (faded, lines, smudges)',
            'Printer not connecting',
            'Printer printing blank receipts',
            'Error lights or messages',
            'Other issue'
        ]
    },
    {
        id: 'when-started',
        type: 'text',
        question: 'When did this problem start?',
        description: 'For example: "today", "after I moved the printer", "after a software update"',
        placeholder: 'Describe when the problem started...'
    },
    {
        id: 'changes',
        type: 'text',
        question: 'Has anything changed in your setup recently?',
        description: 'For example: moved equipment, changed internet, updated software, etc.',
        placeholder: 'Describe any recent changes...'
    },
    {
        id: 'basic-checks',
        type: 'checklist',
        question: 'Let\'s check the basics first',
        description: 'Please check each of these items. Check the box once you\'ve verified it:',
        items: [
            'Printer is plugged in and powered on',
            'Printer has paper loaded correctly',
            'All cables are securely connected',
            'Printer is compatible with Square POS',
            'A printer profile has been created in Square'
        ]
    },
    {
        id: 'quick-fixes',
        type: 'fixes',
        question: 'Try these quick fixes first',
        description: 'These basic steps resolve many printer issues. Try each one:',
        fixes: [
            {
                title: 'Power Cycle',
                steps: [
                    'Turn off the printer',
                    'Unplug the power cable',
                    'Wait 30 seconds',
                    'Plug it back in and turn it on',
                    'Try printing a test receipt'
                ]
            },
            {
                title: 'Check Connections',
                steps: [
                    'Unplug all cables from the printer',
                    'Check for any damage to cables',
                    'Plug everything back in firmly',
                    'Make sure cables are in the correct ports',
                    'Try printing a test receipt'
                ]
            },
            {
                title: 'Check Hardware Hub',
                steps: [
                    'Open Square POS app',
                    'Go to Settings > Hardware',
                    'Check if your printer shows as connected',
                    'If not connected, try reconnecting it',
                    'Try printing a test receipt'
                ]
            }
        ]
    },
    {
        id: 'quick-worked',
        type: 'choice',
        question: 'Did those quick fixes work?',
        description: 'Let us know if your printer is working now:',
        options: [
            'Yes! It\'s working now',
            'No, still having issues'
        ]
    },
    {
        id: 'network-speed-check',
        type: 'network-speed',
        question: 'Let\'s check your internet speed',
        description: 'For network printers to work properly, you need at least <strong>25 Mbps upload</strong> and <strong>25 Mbps download</strong> speed. You can test your speed at <a href="https://fast.com" target="_blank">fast.com</a> or <a href="https://speedtest.net" target="_blank">speedtest.net</a>.'
    },
    {
        id: 'specific-fixes',
        type: 'specific-fixes',
        question: 'Let\'s try specific solutions for your issue',
        description: 'Based on your problem, here are detailed troubleshooting steps:'
    },
    {
        id: 'worked',
        type: 'choice',
        question: 'Did any of those fixes work?',
        description: 'Let us know if your printer is working now:',
        options: [
            'Yes! My printer is working now',
            'No, still not working'
        ]
    },
    {
        id: 'summary',
        type: 'summary',
        question: 'Troubleshooting Summary',
        description: 'Here\'s a summary of what we tried. You can copy this and send it to Square Support for faster help.'
    }
];

// Initialize wizard
function initWizard() {
    renderStep(steps[state.currentStep]);
}

// Render current step
function renderStep(step) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step';
    
    // Question
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.textContent = step.question;
    stepDiv.appendChild(questionDiv);
    
    // Description (use innerHTML for network-speed step, textContent for others)
    if (step.description) {
        const descDiv = document.createElement('div');
        descDiv.className = 'description';
        if (step.type === 'network-speed') {
            descDiv.innerHTML = step.description;
        } else {
            descDiv.textContent = step.description;
        }
        stepDiv.appendChild(descDiv);
    }
    
    // Render based on type
    switch(step.type) {
        case 'info':
            renderInfo(stepDiv, step);
            break;
        case 'choice':
            renderChoice(stepDiv, step);
            break;
        case 'text':
            renderText(stepDiv, step);
            break;
        case 'checklist':
            renderChecklist(stepDiv, step);
            break;
        case 'fixes':
            renderFixes(stepDiv, step);
            break;
        case 'printer-help':
            renderPrinterHelp(stepDiv, step);
            break;
        case 'network-speed':
            renderNetworkSpeed(stepDiv, step);
            break;
        case 'specific-fixes':
            renderSpecificFixes(stepDiv, step);
            break;
        case 'summary':
            renderSummary(stepDiv, step);
            break;
    }
    
    content.appendChild(stepDiv);
    updateProgress();
}

// Render info step
function renderInfo(container, step) {
    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Get Started';
    btn.onclick = () => nextStep();
    
    btnGroup.appendChild(btn);
    container.appendChild(btnGroup);
}

// Render choice step
function renderChoice(container, step) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    
    step.options.forEach(option => {
        const optionBtn = document.createElement('div');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option;
        optionBtn.onclick = () => {
            state.answers[step.id] = option;
            nextStep();
        };
        optionsDiv.appendChild(optionBtn);
    });
    
    container.appendChild(optionsDiv);
    
    // Add back button on all choice steps except the very first step (welcome)
    if (step.id !== 'welcome') {
        addBackButton(container);
    }
}

// Render printer type help step
function renderPrinterHelp(container, step) {
    // If they already have a printer type selected (not "I'm not sure"), skip this step
    if (state.answers['printer-type'] && state.answers['printer-type'] !== 'I\'m not sure') {
        // We're on the help step but shouldn't be - go back to printer-type
        previousStep();
        return;
    }
    
    // Create info cards for each printer type
    const printerTypes = [
        {
            type: 'USB Printer',
            description: 'Connects with a cable directly to your Square device',
            identifiers: [
                'Has a square-shaped USB cable (USB-B) plugged into the printer',
                'Cable connects directly from printer to your Square device',
                'No Wi-Fi or Bluetooth indicators on the printer'
            ]
        },
        {
            type: 'Wi-Fi Printer',
            description: 'Connects wirelessly to your network',
            identifiers: [
                'Has a Wi-Fi symbol or indicator light on the printer',
                'No cables connecting to your Square device',
                'Can print from multiple devices on the same network',
                'You set it up by connecting it to your Wi-Fi network'
            ]
        },
        {
            type: 'Ethernet Printer',
            description: 'Connects to your router with an ethernet cable',
            identifiers: [
                'Has an ethernet cable (looks like a thick phone cable) plugged into the printer',
                'Cable connects from printer to your router or network switch',
                'Has blinking lights near the ethernet port'
            ]
        },
        {
            type: 'Bluetooth Printer',
            description: 'Connects wirelessly directly to your device',
            identifiers: [
                'Has a Bluetooth symbol on the printer',
                'No cables, and doesn\'t connect to Wi-Fi',
                'Usually portable/battery powered',
                'You paired it directly with your Square device'
            ]
        }
    ];
    
    printerTypes.forEach(printer => {
        const card = document.createElement('div');
        card.className = 'fix-card';
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.2s';
        
        card.onmouseover = () => {
            card.style.transform = 'scale(1.02)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        };
        card.onmouseout = () => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        };
        
        card.onclick = () => {
            state.answers['printer-type'] = printer.type;
            nextStep();
        };
        
        const title = document.createElement('h3');
        title.textContent = printer.type;
        title.style.color = '#3D4785';
        card.appendChild(title);
        
        const desc = document.createElement('p');
        desc.textContent = printer.description;
        desc.style.marginBottom = '10px';
        desc.style.fontStyle = 'italic';
        card.appendChild(desc);
        
        const label = document.createElement('strong');
        label.textContent = 'How to identify:';
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        card.appendChild(label);
        
        const ul = document.createElement('ul');
        ul.style.marginLeft = '20px';
        printer.identifiers.forEach(id => {
            const li = document.createElement('li');
            li.textContent = id;
            li.style.marginBottom = '5px';
            ul.appendChild(li);
        });
        card.appendChild(ul);
        
        const selectText = document.createElement('div');
        selectText.textContent = '👆 Click here if this matches your printer';
        selectText.style.marginTop = '10px';
        selectText.style.textAlign = 'center';
        selectText.style.color = '#3D4785';
        selectText.style.fontWeight = 'bold';
        card.appendChild(selectText);
        
        container.appendChild(card);
    });
    
    // Add back button
    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => previousStep();
    btnGroup.appendChild(backBtn);
    
    container.appendChild(btnGroup);
}

// Render text input step
function renderText(container, step) {
    const input = document.createElement('textarea');
    input.className = 'input-field';
    input.placeholder = step.placeholder || 'Type your answer here...';
    input.value = state.answers[step.id] || '';
    
    container.appendChild(input);
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    
    if (state.currentStep > 0) {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-secondary';
        backBtn.textContent = 'Back';
        backBtn.onclick = () => previousStep();
        btnGroup.appendChild(backBtn);
    }
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn';
    nextBtn.textContent = 'Continue';
    nextBtn.onclick = () => {
        state.answers[step.id] = input.value;
        nextStep();
    };
    btnGroup.appendChild(nextBtn);
    
    container.appendChild(btnGroup);
}

// Render checklist step
function renderChecklist(container, step) {
    const checklist = document.createElement('ul');
    checklist.className = 'checklist';
    
    step.items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'checklist-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `check-${index}`;
        
        const label = document.createElement('label');
        label.htmlFor = `check-${index}`;
        label.textContent = item;
        label.style.cursor = 'pointer';
        
        li.appendChild(checkbox);
        li.appendChild(label);
        checklist.appendChild(li);
    });
    
    container.appendChild(checklist);
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => previousStep();
    btnGroup.appendChild(backBtn);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn';
    nextBtn.textContent = 'Continue to Fixes';
    nextBtn.onclick = () => {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        const checked = Array.from(checkboxes).map((cb, i) => ({
            item: step.items[i],
            checked: cb.checked
        }));
        state.answers[step.id] = checked;
        nextStep();
    };
    btnGroup.appendChild(nextBtn);
    
    container.appendChild(btnGroup);
}

// Render network speed check step
function renderNetworkSpeed(container, step) {
    // Only show this step if it's a network-related issue with Wi-Fi or Ethernet printer
    const printerType = state.answers['printer-type'];
    const issueType = state.answers['issue-type'];
    const quickWorked = state.answers['quick-worked'];
    
    const isNetworkPrinter = printerType === 'Wi-Fi Printer' || printerType === 'Ethernet Printer';
    const isNetworkIssue = issueType === 'Printer not connecting' || issueType === 'Printer won\'t print at all';
    
    // Skip if not network-related or if quick fixes already worked
    if (!isNetworkPrinter || !isNetworkIssue || quickWorked === 'Yes! It\'s working now') {
        nextStep();
        return;
    }
    
    // Create input fields
    const inputContainer = document.createElement('div');
    inputContainer.style.marginTop = '20px';
    
    const uploadLabel = document.createElement('label');
    uploadLabel.textContent = 'Upload Speed (Mbps):';
    uploadLabel.style.display = 'block';
    uploadLabel.style.marginBottom = '5px';
    uploadLabel.style.fontWeight = 'bold';
    
    const uploadInput = document.createElement('input');
    uploadInput.type = 'number';
    uploadInput.className = 'input-field';
    uploadInput.placeholder = 'e.g., 50';
    uploadInput.min = '0';
    uploadInput.step = '0.1';
    uploadInput.value = state.answers['upload-speed'] || '';
    uploadInput.style.marginBottom = '15px';
    
    const downloadLabel = document.createElement('label');
    downloadLabel.textContent = 'Download Speed (Mbps):';
    downloadLabel.style.display = 'block';
    downloadLabel.style.marginBottom = '5px';
    downloadLabel.style.fontWeight = 'bold';
    
    const downloadInput = document.createElement('input');
    downloadInput.type = 'number';
    downloadInput.className = 'input-field';
    downloadInput.placeholder = 'e.g., 50';
    downloadInput.min = '0';
    downloadInput.step = '0.1';
    downloadInput.value = state.answers['download-speed'] || '';
    
    inputContainer.appendChild(uploadLabel);
    inputContainer.appendChild(uploadInput);
    inputContainer.appendChild(downloadLabel);
    inputContainer.appendChild(downloadInput);
    
    container.appendChild(inputContainer);
    
    // Warning message container (initially hidden)
    const warningDiv = document.createElement('div');
    warningDiv.className = 'alert alert-warning';
    warningDiv.style.display = 'none';
    warningDiv.style.marginTop = '15px';
    warningDiv.innerHTML = '<strong>⚠️ Low Internet Speed Detected</strong><br>Your internet speed is below the minimum requirement of 25 Mbps upload and 25 Mbps download. This may be causing your printer connection issues.<br><br><strong>Next Step:</strong> Contact your Internet Service Provider (ISP) to upgrade your internet plan or troubleshoot speed issues.';
    container.appendChild(warningDiv);
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => previousStep();
    btnGroup.appendChild(backBtn);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn';
    nextBtn.textContent = 'Continue';
    nextBtn.onclick = () => {
        const uploadSpeed = parseFloat(uploadInput.value) || 0;
        const downloadSpeed = parseFloat(downloadInput.value) || 0;
        
        if (uploadSpeed === 0 || downloadSpeed === 0) {
            alert('Please enter both upload and download speeds.');
            return;
        }
        
        state.answers['upload-speed'] = uploadSpeed;
        state.answers['download-speed'] = downloadSpeed;
        
        // Check if speeds meet minimum requirements
        if (uploadSpeed < 25 || downloadSpeed < 25) {
            state.answers['speed-below-threshold'] = true;
            warningDiv.style.display = 'block';
            nextBtn.textContent = 'Continue Anyway';
            nextBtn.onclick = () => nextStep();
        } else {
            state.answers['speed-below-threshold'] = false;
            nextStep();
        }
    };
    btnGroup.appendChild(nextBtn);
    
    container.appendChild(btnGroup);
}

// Render fixes step
function renderFixes(container, step) {
    step.fixes.forEach((fix, index) => {
        const fixCard = document.createElement('div');
        fixCard.className = 'fix-card';
        
        const title = document.createElement('h3');
        title.textContent = `Fix ${index + 1}: ${fix.title}`;
        fixCard.appendChild(title);
        
        const ol = document.createElement('ol');
        fix.steps.forEach(stepText => {
            const li = document.createElement('li');
            li.textContent = stepText;
            ol.appendChild(li);
        });
        fixCard.appendChild(ol);
        
        const checkbox = document.createElement('div');
        checkbox.style.marginTop = '10px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = `fix-${index}`;
        const label = document.createElement('label');
        label.htmlFor = `fix-${index}`;
        label.textContent = ' I tried this and it didn\'t work';
        label.style.marginLeft = '8px';
        checkbox.appendChild(cb);
        checkbox.appendChild(label);
        fixCard.appendChild(checkbox);
        
        container.appendChild(fixCard);
    });
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => previousStep();
    btnGroup.appendChild(backBtn);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn';
    nextBtn.textContent = 'Continue';
    nextBtn.onclick = () => {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        const tried = Array.from(checkboxes).map((cb, i) => ({
            fix: step.fixes[i].title,
            tried: cb.checked
        }));
        state.fixesTried = tried;
        nextStep();
    };
    btnGroup.appendChild(nextBtn);
    
    container.appendChild(btnGroup);
}

// Render specific fixes based on issue type
function renderSpecificFixes(container, step) {
    // Skip this step if quick fixes worked
    if (state.answers['quick-worked'] === 'Yes! It\'s working now') {
        nextStep();
        return;
    }
    
    const issueType = state.answers['issue-type'];
    const printerType = state.answers['printer-type'];
    
    // For paper jam and print quality issues, skip straight to the "worked" question
    // since we're just directing them to the manufacturer
    if (issueType === 'Paper jam' || issueType === 'Poor print quality (faded, lines, smudges)') {
        // Show manufacturer contact info directly
        const manufacturerCard = document.createElement('div');
        manufacturerCard.className = 'fix-card';
        
        const title = document.createElement('h3');
        title.textContent = 'Contact Printer Manufacturer';
        manufacturerCard.appendChild(title);
        
        const desc = document.createElement('p');
        if (issueType === 'Paper jam') {
            desc.textContent = 'Paper jams require printer-specific troubleshooting. Contact the manufacturer for assistance.';
        } else {
            desc.textContent = 'Print quality issues require printer-specific troubleshooting. Contact the manufacturer for assistance.';
        }
        desc.style.marginBottom = '10px';
        manufacturerCard.appendChild(desc);
        
        const ol = document.createElement('ol');
        const steps = [
            'Find your printer\'s make and model (usually on a label on the printer)',
            'If you have a Star Micronics printer (sold on Square Hardware site):',
            '  • Call Star Micronics Support: 1-800-782-7636',
            '  • Visit: https://www.starmicronics.com/support/',
            'For other printer brands:',
            '  • Visit the manufacturer\'s support website',
            issueType === 'Paper jam' ? '  • Look for paper jam troubleshooting guides' : '  • Look for print quality troubleshooting guides',
            '  • Contact their technical support',
            'Have your printer model number and serial number ready'
        ];
        
        if (issueType === 'Poor print quality (faded, lines, smudges)') {
            steps.push('Describe the specific quality issue (faded, lines, smudges, etc.)');
        }
        
        steps.forEach(stepText => {
            const li = document.createElement('li');
            li.textContent = stepText;
            ol.appendChild(li);
        });
        manufacturerCard.appendChild(ol);
        
        container.appendChild(manufacturerCard);
        
        // Add note that they should contact manufacturer
        const alert = document.createElement('div');
        alert.className = 'alert alert-info';
        alert.innerHTML = '<strong>Note:</strong> These issues are best handled by the printer manufacturer who can provide model-specific guidance.';
        container.appendChild(alert);
        
        // Skip to the "worked" question
        const btnGroup = document.createElement('div');
        btnGroup.className = 'button-group';
        
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-secondary';
        backBtn.textContent = 'Back';
        backBtn.onclick = () => previousStep();
        btnGroup.appendChild(backBtn);
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn';
        nextBtn.textContent = 'Continue';
        nextBtn.onclick = () => {
            // Record that we showed manufacturer info
            if (!state.fixesTried) state.fixesTried = [];
            state.fixesTried.push({
                fix: 'Contact Printer Manufacturer',
                tried: true
            });
            nextStep();
        };
        btnGroup.appendChild(nextBtn);
        
        container.appendChild(btnGroup);
        return;
    }
    
    const specificFixes = getSpecificFixes(issueType, printerType);
    
    if (specificFixes.length === 0) {
        nextStep();
        return;
    }
    
    // Show ISP warning if internet speed was below threshold
    if (state.answers['speed-below-threshold']) {
        const ispAlert = document.createElement('div');
        ispAlert.className = 'alert alert-warning';
        ispAlert.innerHTML = '<strong>⚠️ Internet Speed Issue Detected</strong><br>Your internet speed is below the minimum requirement. We recommend contacting your Internet Service Provider (ISP) to resolve this before trying additional fixes. However, you can still try the troubleshooting steps below.';
        container.appendChild(ispAlert);
    }
    
    specificFixes.forEach((fix, index) => {
        const fixCard = document.createElement('div');
        fixCard.className = 'fix-card';
        
        const title = document.createElement('h3');
        title.textContent = `${index + 1}. ${fix.title}`;
        fixCard.appendChild(title);
        
        if (fix.description) {
            const desc = document.createElement('p');
            desc.textContent = fix.description;
            desc.style.marginBottom = '10px';
            fixCard.appendChild(desc);
        }
        
        const ol = document.createElement('ol');
        fix.steps.forEach(stepText => {
            const li = document.createElement('li');
            li.textContent = stepText;
            ol.appendChild(li);
        });
        fixCard.appendChild(ol);
        
        const checkbox = document.createElement('div');
        checkbox.style.marginTop = '10px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = `specific-fix-${index}`;
        const label = document.createElement('label');
        label.htmlFor = `specific-fix-${index}`;
        label.textContent = ' I tried this and it didn\'t work';
        label.style.marginLeft = '8px';
        label.style.cursor = 'pointer';
        checkbox.appendChild(cb);
        checkbox.appendChild(label);
        fixCard.appendChild(checkbox);
        
        container.appendChild(fixCard);
    });
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => previousStep();
    btnGroup.appendChild(backBtn);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn';
    nextBtn.textContent = 'Continue';
    nextBtn.onclick = () => {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        const tried = Array.from(checkboxes).map((cb, i) => ({
            fix: specificFixes[i].title,
            tried: cb.checked
        }));
        if (!state.fixesTried) state.fixesTried = [];
        state.fixesTried = state.fixesTried.concat(tried);
        nextStep();
    };
    btnGroup.appendChild(nextBtn);
    
    container.appendChild(btnGroup);
}

// Get device-specific troubleshooting steps
function getDeviceTroubleshootingSteps(deviceType) {
    const deviceFixes = {
        'Square Register': {
            title: 'Troubleshoot Your Square Register',
            description: 'Check your Square Register for common issues.',
            steps: [
                'Restart your Square Register (hold power button, select Restart)',
                'Check that Square Register software is up to date (Settings > About)',
                'Make sure the printer is showing in Settings > Hardware',
                'Try removing and re-adding the printer',
                'Check if other hardware works (card reader, cash drawer)',
                'If only printer isn\'t working, the issue is likely with the printer itself'
            ]
        },
        'Square Stand': {
            title: 'Troubleshoot Your Square Stand & iPad',
            description: 'Check your iPad and Square Stand for common issues.',
            steps: [
                'Restart your iPad (hold power + volume button, slide to power off)',
                'Check that Square POS app is up to date (App Store > Updates)',
                'Make sure iPad iOS is up to date (Settings > General > Software Update)',
                'Force quit and reopen Square POS app',
                'Check if the printer shows in Square POS Settings > Hardware',
                'Try removing and re-adding the printer in Square POS',
                'If only printer isn\'t working, the issue is likely with the printer itself'
            ]
        },
        'Square Terminal': {
            title: 'Troubleshoot Your Square Terminal',
            description: 'Check your Square Terminal for common issues.',
            steps: [
                'Restart your Square Terminal (Settings > Device > Restart)',
                'Check that Terminal software is up to date (Settings > Device > About)',
                'Make sure the printer shows in Settings > Hardware > Printers',
                'Try removing and re-adding the printer',
                'Check Terminal battery level (low battery can cause connection issues)',
                'Try a different power outlet if plugged in',
                'If only printer isn\'t working, the issue is likely with the printer itself'
            ]
        },
        'Square Handheld': {
            title: 'Troubleshoot Your Square Handheld',
            description: 'Check your Square Handheld for common issues.',
            steps: [
                'Restart your Square Handheld (Settings > Device > Restart)',
                'Check that Handheld software is up to date (Settings > Device > About)',
                'Make sure the printer shows in Settings > Hardware > Printers',
                'Try removing and re-adding the printer',
                'Check Handheld battery level (low battery can cause connection issues)',
                'Try a different power outlet if plugged in',
                'If only printer isn\'t working, the issue is likely with the printer itself'
            ]
        },
        'iPad/iPhone': {
            title: 'Troubleshoot Your iPad/iPhone',
            description: 'Check your iOS device for common issues.',
            steps: [
                'Restart your iPad/iPhone (hold power + volume button, slide to power off)',
                'Check that Square POS app is up to date (App Store > Updates)',
                'Make sure iOS is up to date (Settings > General > Software Update)',
                'Force quit and reopen Square POS app (swipe up from bottom, swipe app away)',
                'Check if printer shows in Square POS Settings > Hardware',
                'For Bluetooth printers: Check Settings > Bluetooth is ON',
                'Try removing and re-adding the printer in Square POS',
                'If only printer isn\'t working, the issue is likely with the printer itself'
            ]
        },
        'Android device': {
            title: 'Troubleshoot Your Android Device',
            description: 'Check your Android device for common issues.',
            steps: [
                'Restart your Android device (hold power button, tap Restart)',
                'Check that Square POS app is up to date (Play Store > My Apps)',
                'Make sure Android OS is up to date (Settings > System > System Update)',
                'Force stop and reopen Square POS app (Settings > Apps > Square POS > Force Stop)',
                'Clear Square POS app cache (Settings > Apps > Square POS > Storage > Clear Cache)',
                'Check if printer shows in Square POS Settings > Hardware',
                'For Bluetooth printers: Check Settings > Bluetooth is ON',
                'Try removing and re-adding the printer in Square POS',
                'If only printer isn\'t working, the issue is likely with the printer itself'
            ]
        },
        'Other': {
            title: 'Troubleshoot Your Device',
            description: 'Check your device for common issues.',
            steps: [
                'Restart your device',
                'Check that Square POS app is up to date',
                'Make sure your device operating system is up to date',
                'Force quit and reopen Square POS app',
                'Check if printer shows in Square POS Settings > Hardware',
                'Try removing and re-adding the printer in Square POS',
                'If only printer isn\'t working, the issue is likely with the printer itself'
            ]
        }
    };
    
    return deviceFixes[deviceType] || deviceFixes['Other'];
}

// Get specific fixes based on issue type
function getSpecificFixes(issueType, printerType) {
    const fixes = [];
    const deviceType = state.answers['device'];
    
    switch(issueType) {
        case 'Printer won\'t print at all':
            fixes.push({
                title: 'Check Printer Profile Assignment',
                description: 'Make sure your printer is assigned to a printer profile.',
                steps: [
                    'Open Square POS app',
                    'Go to Settings > Hardware > Printers',
                    'Tap on your printer name',
                    'Make sure it\'s assigned to a profile (Receipts, Order Tickets, etc.)',
                    'If not assigned, tap "Assign to Profile" and select the appropriate one',
                    'Try printing a test receipt'
                ]
            });
            
            if (printerType === 'Wi-Fi Printer' || printerType === 'Ethernet Printer') {
                fixes.push({
                    title: 'Check Network Connection',
                    description: 'Verify your printer and device are on the same network.',
                    steps: [
                        'Check that your printer shows a solid (not blinking) Wi-Fi or network light',
                        'Print a network configuration page from your printer (check printer manual)',
                        'Verify the IP address is in the same range as your Square device',
                        'Make sure both devices are on the same network (not guest network)',
                        'Try printing a test receipt'
                    ]
                });
            }
            
            if (printerType === 'Bluetooth Printer') {
                fixes.push({
                    title: 'Re-pair Bluetooth Connection',
                    description: 'Remove and reconnect the Bluetooth connection.',
                    steps: [
                        'Go to your device Settings > Bluetooth',
                        'Find your printer and tap "Forget This Device"',
                        'Turn printer Bluetooth off and back on',
                        'In Square POS: Settings > Hardware > Printers',
                        'Tap "Connect to Bluetooth Printer"',
                        'Follow the pairing steps (PIN is usually 1234)',
                        'Try printing a test receipt'
                    ]
                });
            }
            
            fixes.push({
                title: 'Check Printer Settings in Square',
                description: 'Verify printer settings are configured correctly.',
                steps: [
                    'Open Square POS app',
                    'Go to Settings > Hardware > Printers',
                    'Tap Profiles',
                    'Select your printer profile',
                    'Make sure "Receipts" or "Order Tickets" is toggled ON',
                    'Check that the correct location is selected',
                    'Try printing a test receipt'
                ]
            });
            
            // Add device troubleshooting
            fixes.push(getDeviceTroubleshootingSteps(deviceType));
            
            // Add printer manufacturer escalation
            fixes.push({
                title: 'Contact Printer Manufacturer',
                description: 'If none of the above steps worked, the issue may be with the printer hardware itself.',
                steps: [
                    'Find your printer\'s make and model (usually on a label on the printer)',
                    'If you have a Star Micronics printer (sold on Square Hardware site):',
                    '  • Call Star Micronics Support: 1-800-782-7636',
                    '  • Visit: https://www.starmicronics.com/support/',
                    'For other printer brands:',
                    '  • Visit the manufacturer\'s support website',
                    '  • Look for troubleshooting guides specific to your printer model',
                    '  • Contact their technical support',
                    'Have your printer model number and serial number ready',
                    'Explain that you\'ve tried basic troubleshooting and the printer still won\'t print'
                ]
            });
            break;
            
        case 'Paper jam':
            fixes.push({
                title: 'Contact Printer Manufacturer',
                description: 'Paper jams require printer-specific troubleshooting. Contact the manufacturer for assistance.',
                steps: [
                    'Find your printer\'s make and model (usually on a label on the printer)',
                    'If you have a Star Micronics printer (sold on Square Hardware site):',
                    '  • Call Star Micronics Support: 1-800-782-7636',
                    '  • Visit: https://www.starmicronics.com/support/',
                    'For other printer brands:',
                    '  • Visit the manufacturer\'s support website',
                    '  • Look for paper jam troubleshooting guides',
                    '  • Contact their technical support',
                    'Have your printer model number and serial number ready'
                ]
            });
            break;
            
        case 'Poor print quality (faded, lines, smudges)':
            fixes.push({
                title: 'Contact Printer Manufacturer',
                description: 'Print quality issues require printer-specific troubleshooting. Contact the manufacturer for assistance.',
                steps: [
                    'Find your printer\'s make and model (usually on a label on the printer)',
                    'If you have a Star Micronics printer (sold on Square Hardware site):',
                    '  • Call Star Micronics Support: 1-800-782-7636',
                    '  • Visit: https://www.starmicronics.com/support/',
                    'For other printer brands:',
                    '  • Visit the manufacturer\'s support website',
                    '  • Look for print quality troubleshooting guides',
                    '  • Contact their technical support',
                    'Have your printer model number and serial number ready',
                    'Describe the specific quality issue (faded, lines, smudges, etc.)'
                ]
            });
            break;
            
        case 'Printer not connecting':
            if (printerType === 'Wi-Fi Printer') {
                fixes.push({
                    title: 'Reconnect to Wi-Fi Network',
                    description: 'Re-establish the Wi-Fi connection on your printer.',
                    steps: [
                        'Find your printer\'s Wi-Fi setup button (check manual)',
                        'Put printer in Wi-Fi setup mode',
                        'Connect to your Wi-Fi network using printer controls or app',
                        'Print a network status page to confirm connection',
                        'Make sure printer and Square device are on the same network',
                        'In Square POS: Settings > Hardware > reconnect the printer',
                        'Try printing a test receipt'
                    ]
                });
                
                fixes.push({
                    title: 'Check Router Settings',
                    description: 'Some router settings can block printer connections.',
                    steps: [
                        'Log into your router admin page',
                        'Check if "AP Isolation" or "Client Isolation" is enabled - turn it OFF',
                        'Make sure your printer isn\'t on a guest network',
                        'Check if MAC address filtering is blocking the printer',
                        'Restart your router',
                        'Wait 2 minutes for everything to reconnect',
                        'Try printing a test receipt'
                    ]
                });
            }
            
            if (printerType === 'Ethernet Printer') {
                fixes.push({
                    title: 'Check Ethernet Cable and Connection',
                    description: 'Verify physical network connection.',
                    steps: [
                        'Check that Ethernet cable is firmly plugged into printer and router/switch',
                        'Look for link lights on the Ethernet port (should be solid or blinking)',
                        'Try a different Ethernet cable',
                        'Try a different port on your router/switch',
                        'Print a network status page from the printer',
                        'Verify the printer has an IP address',
                        'Try printing a test receipt'
                    ]
                });
                
                fixes.push({
                    title: 'Set Up Static IP Address',
                    description: 'A static IP prevents connection issues.',
                    steps: [
                        'Print your printer\'s network configuration page',
                        'Note the current IP address',
                        'Log into your router and reserve/assign a static IP for the printer',
                        'Or configure static IP directly on the printer (check manual)',
                        'In Square POS: Settings > Hardware > Printers',
                        'Select "Advanced Printer Setup"',
                        'Enter the static IP address',
                        'Try printing a test receipt'
                    ]
                });
            }
            
            if (printerType === 'USB Printer') {
                fixes.push({
                    title: 'Check USB Connection',
                    description: 'Verify USB cable and ports are working.',
                    steps: [
                        'Unplug the USB cable from both printer and device',
                        'Check the cable for any damage',
                        'Make sure you\'re using a USB-B port on the printer (not USB-A)',
                        'Plug cable firmly back into printer first',
                        'Then plug into your Square device',
                        'Try a different USB cable if available',
                        'Try a different USB port on your device',
                        'Try printing a test receipt'
                    ]
                });
            }
            
            if (printerType === 'Bluetooth Printer') {
                fixes.push({
                    title: 'Reset Bluetooth Connection',
                    description: 'Clear and re-establish Bluetooth pairing.',
                    steps: [
                        'Turn off Bluetooth on your Square device',
                        'Turn off the printer',
                        'Wait 30 seconds',
                        'Turn printer back on',
                        'Turn Bluetooth back on',
                        'In Square POS: Settings > Hardware > Printers',
                        'Remove/forget the old printer connection',
                        'Connect to Bluetooth Printer and re-pair (PIN: 1234)',
                        'Try printing a test receipt'
                    ]
                });
            }
            
            // Add device troubleshooting
            fixes.push(getDeviceTroubleshootingSteps(deviceType));
            
            // Add printer manufacturer escalation
            fixes.push({
                title: 'Contact Printer Manufacturer',
                description: 'If the printer still won\'t connect after trying all the above steps, contact the printer manufacturer.',
                steps: [
                    'Find your printer\'s make and model (usually on a label on the printer)',
                    'If you have a Star Micronics printer (sold on Square Hardware site):',
                    '  • Call Star Micronics Support: 1-800-782-7636',
                    '  • Visit: https://www.starmicronics.com/support/',
                    'For other printer brands:',
                    '  • Visit the manufacturer\'s support website',
                    '  • Look for connection troubleshooting guides specific to your printer model',
                    '  • Check if there are firmware updates available for your printer',
                    '  • Contact their technical support',
                    'Have your printer model number and serial number ready',
                    'Explain that you\'ve tried basic troubleshooting and the printer still won\'t connect'
                ]
            });
            break;
            
        case 'Printer printing blank receipts':
            fixes.push({
                title: 'Check Paper Orientation',
                description: 'Thermal paper must be loaded with the correct side facing up.',
                steps: [
                    'Remove the paper roll from the printer',
                    'Scratch the paper with your fingernail',
                    'The side that turns dark is the thermal side',
                    'Reload paper with thermal side facing the print head',
                    'Usually this means thermal side faces UP or OUT',
                    'Check your printer manual for correct orientation',
                    'Try printing a test receipt'
                ]
            });
            
            fixes.push({
                title: 'Test the Paper',
                description: 'Make sure the thermal paper is working.',
                steps: [
                    'Take a piece of the paper',
                    'Scratch it with your fingernail or a coin',
                    'If it doesn\'t turn dark, the paper is bad or expired',
                    'Replace with fresh thermal paper',
                    'Make sure you\'re not using regular paper',
                    'Load correctly and try printing'
                ]
            });
            
            fixes.push({
                title: 'Clean the Print Head',
                description: 'A very dirty print head can cause blank prints.',
                steps: [
                    'Turn off the printer',
                    'Open the paper compartment',
                    'Use rubbing alcohol and a cotton swab',
                    'Gently clean the print head (dark bar across paper path)',
                    'Let dry for 2-3 minutes',
                    'Reload paper correctly',
                    'Try printing a test receipt'
                ]
            });
            break;
            
        case 'Error lights or messages':
            fixes.push({
                title: 'Identify the Error Code',
                description: 'Find out what the error means.',
                steps: [
                    'Note the pattern of blinking lights (how many blinks, what color)',
                    'Check if there\'s an error message on the printer display',
                    'Look up the error code in your printer manual',
                    'Search online: "[printer model] [error code/light pattern]"',
                    'Common errors: paper out, cover open, paper jam, overheating'
                ]
            });
            
            fixes.push({
                title: 'Clear Common Error Conditions',
                description: 'Fix the most common error causes.',
                steps: [
                    'Make sure paper is loaded correctly',
                    'Check that all covers and doors are fully closed',
                    'Clear any paper jams',
                    'If printer feels hot, turn it off and let it cool for 10 minutes',
                    'Check that cables are securely connected',
                    'Turn printer off and on to reset the error',
                    'Try printing a test receipt'
                ]
            });
            
            fixes.push({
                title: 'Reset the Printer',
                description: 'Perform a full reset of the printer.',
                steps: [
                    'Turn off the printer',
                    'Unplug the power cable',
                    'Wait 60 seconds',
                    'Plug back in and turn on',
                    'Wait for printer to fully initialize',
                    'Check if error is cleared',
                    'If error persists, check printer manual for factory reset procedure'
                ]
            });
            break;
            
        case 'Other issue':
            fixes.push({
                title: 'General Troubleshooting',
                description: 'Try these general solutions.',
                steps: [
                    'Restart both the printer and your Square device',
                    'Check all cable connections',
                    'Make sure printer firmware is up to date (check manufacturer website)',
                    'Try removing and re-adding the printer in Square POS',
                    'Check Square Status page for any known issues',
                    'Contact Square Support with details about your specific issue'
                ]
            });
            break;
    }
    
    return fixes;
}

// Render summary step
function renderSummary(container, step) {
    const summaryBox = document.createElement('div');
    summaryBox.className = 'summary-box';
    
    const title = document.createElement('h3');
    title.textContent = 'Your Troubleshooting Report';
    summaryBox.appendChild(title);
    
    const summaryContent = document.createElement('div');
    summaryContent.className = 'summary-content';
    summaryContent.textContent = generateSummary();
    summaryBox.appendChild(summaryContent);
    
    container.appendChild(summaryBox);
    
    // Support links
    const supportLinks = document.createElement('div');
    supportLinks.className = 'support-links';
    supportLinks.innerHTML = `
        <h4>📚 Helpful Square Support Articles:</h4>
        <a href="https://squareup.com/help/us/en/article/5515-printer-troubleshooting" target="_blank">→ Printer Troubleshooting Guide</a>
        <a href="https://squareup.com/help/us/en/article/8246-connect-a-printer-to-square" target="_blank">→ Connect a Printer to Square</a>
        <a href="https://squareup.com/help/us/en/article/8245-set-up-printer-profiles" target="_blank">→ Set Up Printer Profiles</a>
        <a href="https://squareup.com/help/us/en/article/6139-print-receipts" target="_blank">→ Print Receipts</a>
        <a href="https://squareup.com/help/us/en/article/5194-print-order-tickets" target="_blank">→ Print Order Tickets</a>
        <a href="https://squareup.com/help/us/en/article/7103-setting-up-static-ip" target="_blank">→ Setting Up Static IP</a>
        <a href="https://squareup.com/help/us/en/article/8232-connect-a-barcode-label-printer" target="_blank">→ Connect Barcode Label Printer</a>
    `;
    container.appendChild(supportLinks);
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-success';
    copyBtn.textContent = 'Copy to Clipboard';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(generateSummary());
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
    };
    btnGroup.appendChild(copyBtn);
    
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn btn-secondary';
    restartBtn.textContent = 'Start Over';
    restartBtn.onclick = () => {
        state.currentStep = 0;
        state.answers = {};
        state.fixesTried = [];
        initWizard();
    };
    btnGroup.appendChild(restartBtn);
    
    container.appendChild(btnGroup);
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-info';
    alert.innerHTML = '<strong>Need more help?</strong> Copy this summary and contact Square Support. This information will help them assist you faster!';
    container.appendChild(alert);
}

// Generate summary text
function generateSummary() {
    let summary = '=== SQUARE PRINTER TROUBLESHOOTING REPORT ===\n\n';
    summary += `Date: ${new Date().toLocaleString()}\n\n`;
    
    summary += '--- DEVICE INFORMATION ---\n';
    summary += `Device: ${state.answers['device'] || 'Not specified'}\n`;
    summary += `Printer Type: ${state.answers['printer-type'] || 'Not specified'}\n`;
    summary += `Worked Before: ${state.answers['worked-before'] || 'Not specified'}\n\n`;
    
    summary += '--- ISSUE DETAILS ---\n';
    summary += `Problem: ${state.answers['issue-type'] || 'Not specified'}\n`;
    summary += `When Started: ${state.answers['when-started'] || 'Not specified'}\n`;
    summary += `Recent Changes: ${state.answers['changes'] || 'None reported'}\n`;
    
    // Add internet speed info if checked
    if (state.answers['upload-speed'] || state.answers['download-speed']) {
        summary += `\nInternet Speed:\n`;
        summary += `  Upload: ${state.answers['upload-speed'] || 'Not tested'} Mbps\n`;
        summary += `  Download: ${state.answers['download-speed'] || 'Not tested'} Mbps\n`;
        if (state.answers['speed-below-threshold']) {
            summary += `  ⚠️ WARNING: Speed below minimum requirement (25 Mbps up/down)\n`;
            summary += `  Recommendation: Contact ISP to upgrade internet service\n`;
        }
    }
    summary += '\n';
    
    summary += '--- BASIC CHECKS COMPLETED ---\n';
    if (state.answers['basic-checks']) {
        state.answers['basic-checks'].forEach(check => {
            summary += `${check.checked ? '✓' : '✗'} ${check.item}\n`;
        });
    }
    summary += '\n';
    
    summary += '--- TROUBLESHOOTING STEPS ATTEMPTED ---\n';
    if (state.fixesTried && state.fixesTried.length > 0) {
        state.fixesTried.forEach(fix => {
            if (fix.tried) {
                summary += `✓ Tried: ${fix.fix}\n`;
            }
        });
    }
    summary += '\n';
    
    summary += `Result: ${state.answers['worked'] || 'Not specified'}\n\n`;
    
    summary += '--- NEXT STEPS ---\n';
    if (state.answers['worked'] === 'Yes! My printer is working now') {
        summary += 'Issue resolved! Printer is now working.\n';
    } else {
        summary += 'Issue not resolved. Please contact Square Support with this report.\n';
        summary += 'Square Support: https://squareup.com/help/contact\n';
    }
    
    return summary;
}

// Navigation functions
function nextStep() {
    if (state.currentStep < steps.length - 1) {
        state.currentStep++;
        renderStep(steps[state.currentStep]);
    }
}

function previousStep() {
    if (state.currentStep > 0) {
        state.currentStep--;
        renderStep(steps[state.currentStep]);
    }
}

function addBackButton(container) {
    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => previousStep();
    btnGroup.appendChild(backBtn);
    
    container.appendChild(btnGroup);
}

// Update progress bar
function updateProgress() {
    const progress = ((state.currentStep + 1) / steps.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Start wizard when page loads
document.addEventListener('DOMContentLoaded', initWizard);
