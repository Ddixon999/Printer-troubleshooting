// Troubleshooting Wizard State
const state = {
    currentStep: 0,
    answers: {},
    fixes Tried: []
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
            'iPad/iPhone',
            'Android device',
            'Other'
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
        question: 'Try these quick fixes',
        description: 'These steps resolve most printer issues. Try each one and check the box if it didn\'t work:',
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
            },
            {
                title: 'Restart Your Device',
                steps: [
                    'Close the Square POS app',
                    'Turn off your Square device',
                    'Wait 30 seconds',
                    'Turn it back on',
                    'Open Square POS and try printing'
                ]
            }
        ]
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
    
    // Description
    if (step.description) {
        const descDiv = document.createElement('div');
        descDiv.className = 'description';
        descDiv.textContent = step.description;
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
    
    if (state.currentStep > 0) {
        addBackButton(container);
    }
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
    summary += `Recent Changes: ${state.answers['changes'] || 'None reported'}\n\n`;
    
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
