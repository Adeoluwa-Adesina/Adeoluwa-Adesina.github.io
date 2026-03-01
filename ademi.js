document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // --- Theme Toggle Logic ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- View Toggling and Search Logic ---
    const coursesBtn = document.getElementById('courses-btn');
    const topicsBtn = document.getElementById('topics-btn');
    const coursesGrid = document.getElementById('courses-grid');
    const topicsGrid = document.getElementById('topics-grid');
    const searchInput = document.getElementById('search-input');
    const noResultsMessage = document.getElementById('no-results-message');

    const toggleView = (view) => {
        // Update button active state
        coursesBtn.classList.toggle('active', view === 'courses');
        topicsBtn.classList.toggle('active', view === 'topics');

        // Toggle grid visibility and activate the correct one for search
        coursesGrid.classList.toggle('active', view === 'courses');
        topicsGrid.classList.toggle('active', view === 'topics');
        
        coursesGrid.style.display = view === 'courses' ? 'grid' : 'none';
        topicsGrid.style.display = view === 'topics' ? 'grid' : 'none';

        filterContent();
    };

    if (coursesBtn && topicsBtn) {
        coursesBtn.addEventListener('click', () => toggleView('courses'));
        topicsBtn.addEventListener('click', () => toggleView('topics'));
    }

    const filterContent = () => {
        const query = searchInput.value.toLowerCase().trim();
        const activeGrid = document.querySelector('.content-grid.active');
        
        if (!activeGrid) {
            noResultsMessage.style.display = 'block';
            return;
        }
        
        const cards = activeGrid.querySelectorAll('.course-card, .topic-card');
        let resultsFound = false;

        cards.forEach(card => {
            const title = card.dataset.title.toLowerCase();
            const isMatch = title.includes(query);
            
            if (isMatch) {
                card.classList.remove('hidden-card');
                resultsFound = true;
            } else {
                card.classList.add('hidden-card');
            }
        });

        noResultsMessage.style.display = resultsFound ? 'none' : 'block';
    };
    
    if (searchInput) {
        searchInput.addEventListener('input', filterContent);
    }

    // Set initial view and filter
    toggleView('courses');
});