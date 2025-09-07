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
        <img src="${data.imgSrc}" alt="${data.alt}" class="screenshot">
      </div>
    `).join('');

    const outputDataHTML = project.outputData.map(data => `
      <div class="data-card">
        <div class="data-title">
          <i class="${data.icon}"></i> ${data.title}
        </div>
        <img src="${data.imgSrc}" alt="${data.alt}" class="screenshot">
      </div>
    `).join('');

    return `
      <div class="project-card">
        <div class="project-category">${project.category}</div>
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p>${project.description}</p>
          <p>Tools: ${project.tools}</p>
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

  try {
    // Загрузка JSON из корня репозитория
    const response = await fetch('data/projects-data.json');
    if (!response.ok) throw new Error('Failed to load projects data');
    const projectsData = await response.json();

    // Перемешиваем и выбираем первые NUM_DISPLAY
    const shuffledProjects = shuffleArray([...projectsData]);
    const selectedProjects = shuffledProjects.slice(0, NUM_DISPLAY);

    // Генерируем и вставляем HTML
    const projectsHTML = selectedProjects.map(generateProjectCard).join('');
    projectsContainer.innerHTML = projectsHTML;
  } catch (error) {
    console.error(error);
    projectsContainer.innerHTML = '<p>Error loading projects. Please try refreshing the page.</p>';
  }
});
