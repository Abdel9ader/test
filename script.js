        // Data storage and initialization
        let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
        let currentCategory = 'push';
        let editingExerciseId = null;
        let uploadedImage = null;

        // DOM Elements
        const mainPage = document.getElementById('mainPage');
        const pushPage = document.getElementById('pushPage');
        const pullPage = document.getElementById('pullPage');
        const legsPage = document.getElementById('legsPage');
        
        const exercisesContainerPush = document.getElementById('exercisesContainerPush');
        const exercisesContainerPull = document.getElementById('exercisesContainerPull');
        const exercisesContainerLegs = document.getElementById('exercisesContainerLegs');
        
        const themeToggle = document.getElementById('themeToggle');
        const exerciseModal = document.getElementById('exerciseModal');
        const historyModal = document.getElementById('historyModal');
        const exerciseForm = document.getElementById('exerciseForm');
        const modalTitle = document.getElementById('modalTitle');
        const cancelBtn = document.getElementById('cancelBtn');
        const closeHistoryBtn = document.getElementById('closeHistoryBtn');
        const uploadImageBtn = document.getElementById('uploadImageBtn');
        const imageUpload = document.getElementById('exerciseImageUpload');
        const imagePreview = document.getElementById('imagePreview');

        // Initialize the application
        function init() {
            // No default exercises - start with empty array
            if (exercises.length === 0) {
                localStorage.setItem('exercises', JSON.stringify(exercises));
            }
            
            renderExercises();
            setupEventListeners();
            updateCharts();
        }

        // Set up event listeners
        function setupEventListeners() {
            // Theme toggle
            themeToggle.addEventListener('click', toggleTheme);
            
            // Category tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const category = tab.dataset.category;
                    showCategoryPage(category);
                });
            });
            
            // Back buttons
            document.getElementById('backBtnPush').addEventListener('click', () => showPage('mainPage'));
            document.getElementById('backBtnPull').addEventListener('click', () => showPage('mainPage'));
            document.getElementById('backBtnLegs').addEventListener('click', () => showPage('mainPage'));
            
            // Add exercise buttons
            document.getElementById('addExerciseBtnPush').addEventListener('click', () => openAddExerciseModal('push'));
            document.getElementById('addExerciseBtnPull').addEventListener('click', () => openAddExerciseModal('pull'));
            document.getElementById('addExerciseBtnLegs').addEventListener('click', () => openAddExerciseModal('legs'));
            
            // Form submission
            exerciseForm.addEventListener('submit', handleExerciseSubmit);
            
            // Modal buttons
            cancelBtn.addEventListener('click', () => exerciseModal.style.display = 'none');
            closeHistoryBtn.addEventListener('click', () => historyModal.style.display = 'none');
            
            // Image upload
            uploadImageBtn.addEventListener('click', () => imageUpload.click());
            imageUpload.addEventListener('change', handleImageUpload);
            
            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === exerciseModal) exerciseModal.style.display = 'none';
                if (e.target === historyModal) historyModal.style.display = 'none';
            });
        }

        // Show specific page
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
        }

        // Show category page
        function showCategoryPage(category) {
            currentCategory = category;
            if (category === 'push') {
                showPage('pushPage');
            } else if (category === 'pull') {
                showPage('pullPage');
            } else if (category === 'legs') {
                showPage('legsPage');
            }
            renderExercises();
            updateCharts();
        }

        // Open add exercise modal
        function openAddExerciseModal(category) {
            editingExerciseId = null;
            modalTitle.textContent = 'Add New Exercise';
            exerciseForm.reset();
            document.getElementById('exerciseCategory').value = category;
            imagePreview.innerHTML = '<span>Image preview will appear here</span>';
            uploadedImage = null;
            exerciseModal.style.display = 'flex';
        }

        // Handle image upload
        function handleImageUpload(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.type.match('image.*')) {
                alert('Please select an image file.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadedImage = event.target.result;
                imagePreview.innerHTML = `<img src="${uploadedImage}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }

        // Toggle between light and dark themes
        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            const text = themeToggle.querySelector('span');
            
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
                text.textContent = 'Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Dark Mode';
            }
            
            // Update charts after theme change
            updateCharts();
        }

        // Render exercises for all categories
        function renderExercises() {
            renderExercisesForCategory('push', exercisesContainerPush);
            renderExercisesForCategory('pull', exercisesContainerPull);
            renderExercisesForCategory('legs', exercisesContainerLegs);
        }

        // Render exercises for a specific category
        function renderExercisesForCategory(category, container) {
            const categoryExercises = exercises.filter(ex => ex.category === category);
            
            if (categoryExercises.length === 0) {
                container.innerHTML = `
                    <div class="no-exercises">
                        <p>No exercises found for ${category} day.</p>
                        <p>Click "Add Exercise" to get started!</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = categoryExercises.map(exercise => `
                <div class="exercise-card ${exercise.category}">
                    <div class="exercise-image">
                        <img src="${exercise.image}" alt="${exercise.name}">
                    </div>
                    <div class="exercise-header">
                        <h3>${exercise.name}</h3>
                        <div class="exercise-actions">
                            <button class="action-btn edit-btn" data-id="${exercise.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn history-btn" data-id="${exercise.id}">
                                <i class="fas fa-history"></i>
                            </button>
                            <button class="action-btn delete-btn" data-id="${exercise.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="exercise-weight">${exercise.currentWeight} kg</div>
                    <button class="btn update-weight-btn" data-id="${exercise.id}">
                        <i class="fas fa-plus"></i> Update Weight
                    </button>
                    <div class="weight-history">
                        <div class="history-item">
                            <span>Last updated:</span>
                            <span>${formatDate(exercise.lastUpdated)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners to exercise buttons
            container.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => editExercise(e.target.closest('.edit-btn').dataset.id));
            });
            
            container.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => deleteExercise(e.target.closest('.delete-btn').dataset.id));
            });
            
            container.querySelectorAll('.history-btn').forEach(btn => {
                btn.addEventListener('click', (e) => showHistory(e.target.closest('.history-btn').dataset.id));
            });
            
            container.querySelectorAll('.update-weight-btn').forEach(btn => {
                btn.addEventListener('click', (e) => updateWeightPrompt(e.target.closest('.update-weight-btn').dataset.id));
            });
        }

        // Handle exercise form submission
        function handleExerciseSubmit(e) {
            e.preventDefault();
            
            const name = document.getElementById('exerciseName').value;
            const category = document.getElementById('exerciseCategory').value;
            const weight = parseFloat(document.getElementById('exerciseWeight').value);
            
            // Use uploaded image or a placeholder if none was uploaded
            const image = uploadedImage || `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM4YjVjZjYiIG9wYWNpdHk9IjAuMiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4YjVjZjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjM1ZW0iPkV4ZXJjaXNlIEltYWdlPC90ZXh0Pjwvc3ZnPg==`;
            
            if (editingExerciseId) {
                // Update existing exercise
                const index = exercises.findIndex(ex => ex.id === editingExerciseId);
                if (index !== -1) {
                    exercises[index] = {
                        ...exercises[index],
                        name,
                        category,
                        image,
                        currentWeight: weight
                    };
                }
            } else {
                // Add new exercise
                const newExercise = {
                    id: Date.now().toString(),
                    name,
                    category,
                    image,
                    currentWeight: weight,
                    history: [],
                    lastUpdated: new Date().toISOString().split('T')[0]
                };
                
                exercises.push(newExercise);
            }
            
            // Save to localStorage and update UI
            localStorage.setItem('exercises', JSON.stringify(exercises));
            exerciseModal.style.display = 'none';
            renderExercises();
            updateCharts();
        }

        // Edit an existing exercise
        function editExercise(id) {
            const exercise = exercises.find(ex => ex.id === id);
            if (!exercise) return;
            
            editingExerciseId = id;
            modalTitle.textContent = 'Edit Exercise';
            
            document.getElementById('exerciseName').value = exercise.name;
            document.getElementById('exerciseCategory').value = exercise.category;
            document.getElementById('exerciseWeight').value = exercise.currentWeight;
            
            // Set image preview
            uploadedImage = exercise.image;
            imagePreview.innerHTML = `<img src="${exercise.image}" alt="Preview">`;
            
            exerciseModal.style.display = 'flex';
        }

        // Delete an exercise
        function deleteExercise(id) {
            if (confirm('Are you sure you want to delete this exercise?')) {
                exercises = exercises.filter(ex => ex.id !== id);
                localStorage.setItem('exercises', JSON.stringify(exercises));
                renderExercises();
                updateCharts();
            }
        }

        // Show weight history for an exercise
        function showHistory(id) {
            const exercise = exercises.find(ex => ex.id === id);
            if (!exercise) return;
            
            const historyContent = document.getElementById('historyContent');
            historyContent.innerHTML = '';
            
            if (exercise.history && exercise.history.length > 0) {
                exercise.history.forEach(entry => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = `
                        <span>${formatDate(entry.date)}</span>
                        <span>${entry.weight} kg</span>
                    `;
                    historyContent.appendChild(historyItem);
                });
            } else {
                historyContent.innerHTML = '<p>No weight history available for this exercise.</p>';
            }
            
            document.getElementById('historyTitle').textContent = `Weight History - ${exercise.name}`;
            historyModal.style.display = 'flex';
        }

        // Prompt to update weight for an exercise
        function updateWeightPrompt(id) {
            const exercise = exercises.find(ex => ex.id === id);
            if (!exercise) return;
            
            const newWeight = prompt(`Enter new weight for ${exercise.name} (kg):`, exercise.currentWeight);
            if (newWeight === null) return;
            
            const weightValue = parseFloat(newWeight);
            if (isNaN(weightValue) || weightValue < 0) {
                alert('Please enter a valid weight value.');
                return;
            }
            
            // Update exercise weight and history
            exercise.currentWeight = weightValue;
            exercise.history = exercise.history || [];
            exercise.history.unshift({
                date: new Date().toISOString().split('T')[0],
                weight: weightValue
            });
            
            exercise.lastUpdated = new Date().toISOString().split('T')[0];
            
            // Limit history to last 10 entries
            if (exercise.history.length > 10) {
                exercise.history = exercise.history.slice(0, 10);
            }
            
            localStorage.setItem('exercises', JSON.stringify(exercises));
            renderExercises();
            updateCharts();
        }

        // Update all charts
        function updateCharts() {
            updateChart('push', 'progressChartPush');
            updateChart('pull', 'progressChartPull');
            updateChart('legs', 'progressChartLegs');
        }

        // Update a specific chart
        function updateChart(category, chartId) {
            const ctx = document.getElementById(chartId).getContext('2d');
            const categoryExercises = exercises.filter(ex => ex.category === category);
            
            // Prepare data for chart
            const labels = categoryExercises.map(ex => ex.name);
            const data = categoryExercises.map(ex => ex.currentWeight);
            
            const backgroundColor = category === 'push' ? 'rgba(139, 92, 246, 0.7)' : 
                                  category === 'pull' ? 'rgba(6, 182, 212, 0.7)' : 
                                  'rgba(236, 72, 153, 0.7)';
            
            const borderColor = category === 'push' ? 'rgb(139, 92, 246)' : 
                              category === 'pull' ? 'rgb(6, 182, 212)' : 
                              'rgb(236, 72, 153)';
            
            const chartData = {
                labels: labels,
                datasets: [{
                    label: 'Weight (kg)',
                    data: data,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1
                }]
            };
            
            const config = {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: `${capitalizeFirstLetter(category)} Exercises Progress`
                        }
                    }
                },
            };
            
            // Destroy previous chart if it exists
            if (window[`${chartId}Instance`]) {
                window[`${chartId}Instance`].destroy();
            }
            
            // Create new chart
            window[`${chartId}Instance`] = new Chart(ctx, config);
        }

        // Helper function to capitalize first letter
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        // Format date to be more readable
        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }

        // Initialize the app when the DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
