// Data storage and initialization
        let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
        let currentCategory = 'push';
        let editingExerciseId = null;

        // DOM Elements
        const exercisesContainer = document.getElementById('exercisesContainer');
        const currentCategoryElement = document.getElementById('currentCategory');
        const themeToggle = document.getElementById('themeToggle');
        const addExerciseBtn = document.getElementById('addExerciseBtn');
        const exerciseModal = document.getElementById('exerciseModal');
        const historyModal = document.getElementById('historyModal');
        const exerciseForm = document.getElementById('exerciseForm');
        const modalTitle = document.getElementById('modalTitle');
        const cancelBtn = document.getElementById('cancelBtn');
        const closeHistoryBtn = document.getElementById('closeHistoryBtn');

        // Initialize the application
        function init() {
            // Add some sample data if none exists
            if (exercises.length === 0) {
                exercises = [
                    {
                        id: '1',
                        name: 'Bench Press',
                        category: 'push',
                        currentWeight: 70,
                        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJlbmNoJTIwcHJlc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
                        history: [
                            { date: '2023-08-01', weight: 65 },
                            { date: '2023-08-08', weight: 67.5 },
                            { date: '2023-08-15', weight: 70 }
                        ],
                        lastUpdated: '2023-08-15'
                    },
                    {
                        id: '2',
                        name: 'Squat',
                        category: 'legs',
                        currentWeight: 100,
                        image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNxdWF0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
                        history: [
                            { date: '2023-08-02', weight: 90 },
                            { date: '2023-08-09', weight: 95 },
                            { date: '2023-08-16', weight: 100 }
                        ],
                        lastUpdated: '2023-08-16'
                    },
                    {
                        id: '3',
                        name: 'Deadlift',
                        category: 'pull',
                        currentWeight: 120,
                        image: 'https://images.unsplash.com/photo-1634224143532-6347d4fad4c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRlYWRsaWZ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
                        history: [
                            { date: '2023-08-03', weight: 110 },
                            { date: '2023-08-10', weight: 115 },
                            { date: '2023-08-17', weight: 120 }
                        ],
                        lastUpdated: '2023-08-17'
                    }
                ];
                localStorage.setItem('exercises', JSON.stringify(exercises));
            }
            
            renderExercises();
            setupEventListeners();
            updateChart();
        }

        // Set up event listeners
        function setupEventListeners() {
            // Theme toggle
            themeToggle.addEventListener('click', toggleTheme);
            
            // Category tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    currentCategory = tab.dataset.category;
                    currentCategoryElement.textContent = `${capitalizeFirstLetter(currentCategory)} Exercises`;
                    renderExercises();
                });
            });
            
            // Add exercise button
            addExerciseBtn.addEventListener('click', () => {
                editingExerciseId = null;
                modalTitle.textContent = 'Add New Exercise';
                exerciseForm.reset();
                document.getElementById('exerciseCategory').value = currentCategory;
                exerciseModal.style.display = 'flex';
            });
            
            // Form submission
            exerciseForm.addEventListener('submit', handleExerciseSubmit);
            
            // Modal buttons
            cancelBtn.addEventListener('click', () => exerciseModal.style.display = 'none');
            closeHistoryBtn.addEventListener('click', () => historyModal.style.display = 'none');
            
            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === exerciseModal) exerciseModal.style.display = 'none';
                if (e.target === historyModal) historyModal.style.display = 'none';
            });
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
        }

        // Render exercises for the current category
        function renderExercises() {
            const categoryExercises = exercises.filter(ex => ex.category === currentCategory);
            
            if (categoryExercises.length === 0) {
                exercisesContainer.innerHTML = `
                    <div class="no-exercises">
                        <p>No exercises found for ${currentCategory} day.</p>
                        <p>Click "Add Exercise" to get started!</p>
                    </div>
                `;
                return;
            }
            
            exercisesContainer.innerHTML = categoryExercises.map(exercise => `
                <div class="exercise-card">
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
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => editExercise(e.target.closest('.edit-btn').dataset.id));
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => deleteExercise(e.target.closest('.delete-btn').dataset.id));
            });
            
            document.querySelectorAll('.history-btn').forEach(btn => {
                btn.addEventListener('click', (e) => showHistory(e.target.closest('.history-btn').dataset.id));
            });
            
            document.querySelectorAll('.update-weight-btn').forEach(btn => {
                btn.addEventListener('click', (e) => updateWeightPrompt(e.target.closest('.update-weight-btn').dataset.id));
            });
        }

        // Handle exercise form submission
        function handleExerciseSubmit(e) {
            e.preventDefault();
            
            const name = document.getElementById('exerciseName').value;
            const category = document.getElementById('exerciseCategory').value;
            const weight = parseFloat(document.getElementById('exerciseWeight').value);
            const image = document.getElementById('exerciseImage').value;
            
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
            updateChart();
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
            
            // Select the correct image option if it exists
            const imageSelect = document.getElementById('exerciseImage');
            for (let i = 0; i < imageSelect.options.length; i++) {
                if (imageSelect.options[i].value === exercise.image) {
                    imageSelect.selectedIndex = i;
                    break;
                }
            }
            
            exerciseModal.style.display = 'flex';
        }

        // Delete an exercise
        function deleteExercise(id) {
            if (confirm('Are you sure you want to delete this exercise?')) {
                exercises = exercises.filter(ex => ex.id !== id);
                localStorage.setItem('exercises', JSON.stringify(exercises));
                renderExercises();
                updateChart();
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
            updateChart();
        }

        // Update the progress chart
        function updateChart() {
            const ctx = document.getElementById('progressChart').getContext('2d');
            
            // Prepare data for chart
            const pushExercises = exercises.filter(ex => ex.category === 'push');
            const pullExercises = exercises.filter(ex => ex.category === 'pull');
            const legsExercises = exercises.filter(ex => ex.category === 'legs');
            
            const data = {
                labels: ['Push', 'Pull', 'Legs'],
                datasets: [{
                    label: 'Total Weight Lifted',
                    data: [
                        pushExercises.reduce((sum, ex) => sum + ex.currentWeight, 0),
                        pullExercises.reduce((sum, ex) => sum + ex.currentWeight, 0),
                        legsExercises.reduce((sum, ex) => sum + ex.currentWeight, 0)
                    ],
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(6, 182, 212, 0.7)',
                        'rgba(236, 72, 153, 0.7)'
                    ],
                    borderColor: [
                        'rgb(139, 92, 246)',
                        'rgb(6, 182, 212)',
                        'rgb(236, 72, 153)'
                    ],
                    borderWidth: 1
                }]
            };
            
            const config = {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Total Weight by Category'
                        }
                    }
                },
            };
            
            // Destroy previous chart if it exists
            if (window.progressChartInstance) {
                window.progressChartInstance.destroy();
            }
            
            // Create new chart
            window.progressChartInstance = new Chart(ctx, config);
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