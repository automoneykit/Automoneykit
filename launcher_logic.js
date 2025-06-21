// launcher_logic.js

let tierDropdown = document.getElementById('tier');
let categoryDropdown = document.getElementById('category');
let styleDropdown = document.getElementById('style');
let step3aInput = document.getElementById('step3a');
let step3bInput = document.getElementById('step3b');
let step3cInput = document.getElementById('step3c');
let step4aInput = document.getElementById('step4a');
let step4bInput = document.getElementById('step4b');
let step5cInput = document.getElementById('step5c');

let step3aWrapper = document.getElementById('step3aWrapper');
let step3bWrapper = document.getElementById('step3bWrapper');
let step3cWrapper = document.getElementById('step3cWrapper');
let step4aWrapper = document.getElementById('step4aWrapper');
let step4bWrapper = document.getElementById('step4bWrapper');
let step5cWrapper = document.getElementById('step5cWrapper');

let promptBox = document.getElementById('promptBox');
let promptText = document.getElementById('promptText');
let copiedMessage = document.getElementById('copiedMessage');
let showMoreLink = document.getElementById('showMore');
let morePromptsDiv = document.getElementById('morePrompts');
let actionButtons = document.getElementById('actionButtons');

let promptData = {};
let selectedPrompts = [];

tierDropdown.addEventListener('change', () => {
  categoryDropdown.disabled = !tierDropdown.value;
  resetBelow('category');
});

categoryDropdown.addEventListener('change', () => {
  resetBelow('style');
  if (categoryDropdown.value) {
    styleDropdown.innerHTML = `<option value="">Select a Style</option>`;
    for (let i = 1; i <= 5; i++) {
      styleDropdown.innerHTML += `<option value="style${i}">Style ${i}</option>`;
    }
    document.getElementById('styleWrapper').style.display = 'block';
  } else {
    document.getElementById('styleWrapper').style.display = 'none';
  }
});

styleDropdown.addEventListener('change', () => {
  resetBelow('step3a');
  if (styleDropdown.value) {
    step3aWrapper.style.display = 'block';
    step3bWrapper.style.display = 'block';
    step3cWrapper.style.display = 'block';
  }
});

[step3aInput, step3bInput, step3cInput, step4aInput, step4bInput, step5cInput].forEach(input => {
  input.addEventListener('input', tryGeneratePrompt);
});

function resetBelow(field) {
  const resetOrder = ['category', 'style', 'step3a', 'step3b', 'step3c', 'step4a', 'step4b', 'step5c'];
  let resetFlag = false;
  resetOrder.forEach(f => {
    if (f === field) resetFlag = true;
    else if (resetFlag) {
      if (f.startsWith('step')) {
        document.getElementById(f + 'Wrapper').style.display = 'none';
        document.getElementById(f).value = '';
      }
    }
  });
  promptBox.style.display = 'none';
  showMoreLink.style.display = 'none';
  morePromptsDiv.innerHTML = '';
  actionButtons.style.display = 'none';
}

function tryGeneratePrompt() {
  if (!step3aInput.value || !step3bInput.value || !step3cInput.value) return;
  if (tierDropdown.value === 'Master') {
    if (!step4aInput.value || !step4bInput.value || !step5cInput.value) return;
  }

  loadPromptFile();
}

function loadPromptFile() {
  const tier = tierDropdown.value.toLowerCase();
  const category = categoryDropdown.value;
  const style = styleDropdown.value;

  const filename = `automoneykit_${category}_${tier}_prompts.json`;

  fetch(filename)
    .then(res => res.json())
    .then(data => {
      const prompts = data[category][style][tier];
      selectedPrompts = prompts.map(template =>
        template
          .replace('[Step 3a – PRODUCT]', step3aInput.value)
          .replace('[Step 3b – OUTCOME]', step3bInput.value)
          .replace('[Step 3c – ANGLE SLOT]', step3cInput.value)
          .replace('[Step 4a – VISUAL OUTCOME SLOT]', step4aInput.value || '')
          .replace('[Step 4b – EMOTION SLOT]', step4bInput.value || '')
          .replace('[Step 5c – DOPAMINE CTA]', step5cInput.value || '')
      );
      displayPrompt(selectedPrompts);
    });
}

function displayPrompt(prompts) {
  promptText.textContent = prompts[0];
  promptBox.style.display = 'block';

  if (prompts.length > 1) {
    showMoreLink.style.display = 'block';
  }
  actionButtons.style.display = 'block';
}

function copyPrompt() {
  navigator.clipboard.writeText(promptText.textContent);
  copiedMessage.style.display = 'inline';
  setTimeout(() => copiedMessage.style.display = 'none', 1500);
}

function showMore() {
  morePromptsDiv.innerHTML = '';
  selectedPrompts.forEach((p, i) => {
    let box = document.createElement('div');
    box.className = 'prompt-variation';
    box.textContent = p;
    box.onclick = () => {
      promptText.textContent = p;
      promptBox.scrollIntoView({ behavior: 'smooth' });
      copyPrompt();
    };
    morePromptsDiv.appendChild(box);
  });
  showMoreLink.style.display = 'none';
}
