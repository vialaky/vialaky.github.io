document.addEventListener('DOMContentLoaded', async () => {
  const projectsContainer = document.querySelector('.projects');
  if (!projectsContainer) return;

  const NUM_DISPLAY = 3; // Сейчас 3 карточки; измените на 6, 9 или 12 по мере роста коллекции

  // Функция для перемешивания массива (Fisher-Yates)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Генерация HTML для одной карточки
  function generateProjectCard(project) {
    const inputDataHTML = project.inputData.map(data => `
      <div class="data-card">
        <div class="data-title">
          <i class="${data.icon}"></i> ${data.title}
        </div>
        <img src="${data.imgSrc}" alt="${data.alt}" class="screenshot" data-fullsize="${data.imgSrc}">
      </div>
    `).join('');

    const outputDataHTML = project.outputData.map(data => `
      <div class="data-card">
        <div class="data-title">
          <i class="${data.icon}"></i> ${data.title}
        </div>
        <img src="${data.imgSrc}" alt="${data.alt}" class="screenshot" data-fullsize="${data.imgSrc}">
      </div>
    `).join('');

    return `
      <div class="project-card">
        <div class="project-category">${project.category}</div>
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-content-description">${project.description}</p>
          <p class="project-content-tools">Tools: ${project.tools}</p>
          <div class="data-section">
            <h4>Input Data</h4>
            <div class="data-container">${inputDataHTML}</div>
          </div>
          <div class="data-section">
            <h4>Output Data</h4>
            <div class="data-container">${outputDataHTML}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Функция для создания и показа модального окна
  function showModal(imageSrc, altText) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
      <span class="modal-close"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="#1a2a57" d="M18 6L6 18M6 6l12 12" stroke="#1a2a57" stroke-width="2" stroke-linecap="round"/></svg></span>
        <img src="${imageSrc}" alt="${altText}" class="modal-image">
      </div>
    `;
    document.body.appendChild(modal);

    // Закрытие модального окна
    const closeModal = () => {
      modal.remove();
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  try {
    // Загрузка JSON
    const response = await fetch('data/projects-data.json');
    if (!response.ok) throw new Error('Failed to load projects data');
    const projectsData = await response.json();

    // Перемешиваем и выбираем первые NUM_DISPLAY
    const shuffledProjects = shuffleArray([...projectsData]);
    const selectedProjects = shuffledProjects.slice(0, NUM_DISPLAY);

    // Генерируем и вставляем HTML
    const projectsHTML = selectedProjects.map(generateProjectCard).join('');
    projectsContainer.innerHTML = projectsHTML;

    // Добавляем обработчик кликов для скриншотов
    projectsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('screenshot')) {
        const imageSrc = e.target.dataset.fullsize;
        const altText = e.target.alt;
        showModal(imageSrc, altText);
      }
    });
  } catch (error) {
    console.error(error);
    projectsContainer.innerHTML = '<p>Error loading projects. Please try refreshing the page.</p>';
  }
});
