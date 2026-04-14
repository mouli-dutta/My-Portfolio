// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing portfolio...');

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Typing Animation
const roles = ['AI/ML Enthusiast', 'Python Automation Expert', 'Security Engineer', 'Detection Engineer', 'Data Analytics Professional'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById('typed-text');

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeRole, typeSpeed);
}

typeRole();

// Load Skills from API
async function loadSkills() {
    console.log('loadSkills() called');
    const skillsContainer = document.getElementById('skills-container');
    
    if (!skillsContainer) {
        console.error('skills-container element not found!');
        return;
    }
    
    console.log('Found skills-container, loading...');
    skillsContainer.innerHTML = `
        <div class="col-span-full flex justify-center items-center py-8">
            <div class="animate-pulse text-gray-400">Loading skills...</div>
        </div>
    `;
    
    try {
        console.log('Fetching /api/skills...');
        const response = await fetch('/api/skills');
        const skills = await response.json();
        console.log('Skills data received:', skills);
        
        if (!response.ok) {
            throw new Error('Failed to load skills');
        }
        
        skillsContainer.innerHTML = '';
        
        Object.entries(skills).forEach(([category, techs]) => {
            const skillCard = document.createElement('div');
            skillCard.className = 'bg-dark-surface p-6 rounded-lg border border-dark-border hover:border-primary transition-all transform hover:scale-105';
            
            skillCard.innerHTML = `
                <h3 class="text-xl font-bold mb-4 text-primary">${category}</h3>
                <div class="flex flex-wrap gap-2">
                    ${techs.map(tech => `
                        <span class="px-3 py-1 bg-dark-bg text-sm rounded-full border border-dark-border hover:border-primary transition-colors">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
            `;
            
            skillsContainer.appendChild(skillCard);
        });
    } catch (error) {
        skillsContainer.innerHTML = `
            <div class="col-span-full text-red-400 text-center">
                Failed to load skills. Please refresh the page.
            </div>
        `;
        console.error('Skills loading error:', error);
    }
}

// Call the function to load skills
loadSkills();

// Load Projects from API
async function loadProjects() {
    console.log('loadProjects() called');
    const projectsContainer = document.getElementById('projects-container');
    
    if (!projectsContainer) {
        console.error('projects-container element not found!');
        return;
    }
    
    console.log('Found projects-container, loading...');
    projectsContainer.innerHTML = `
        <div class="col-span-full flex justify-center items-center py-8">
            <div class="animate-pulse text-gray-400">Loading projects...</div>
        </div>
    `;
    
    try {
        console.log('Fetching /api/projects...');
        const response = await fetch('/api/projects');
        const projects = await response.json();
        console.log('Projects data received:', projects);
        
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        
        projectsContainer.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'bg-dark-surface rounded-lg border border-dark-border overflow-hidden hover:border-primary transition-all transform hover:scale-105';
            
            // Generate placeholder image based on project title
            const placeholderText = encodeURIComponent(project.title.substring(0, 30));
            const defaultImage = `https://via.placeholder.com/400x250/1a1a1a/06b6d4?text=${placeholderText}`;
            const imageUrl = project.image || defaultImage;
            
            projectCard.innerHTML = `
                <img src="${imageUrl}" alt="${project.title}" class="w-full h-48 object-cover" onerror="this.src='${defaultImage}'">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                    <p class="text-gray-400 mb-4">${project.description}</p>
                    
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.tech.map(tech => `
                            <span class="px-2 py-1 bg-dark-bg text-xs rounded border border-dark-border">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                    
                    <div class="flex gap-4">
                        ${project.live_url ? `
                            <a href="${project.live_url}" target="_blank" class="flex-1 text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors">
                                Live Demo
                            </a>
                        ` : ''}
                        <a href="${project.github_url}" target="_blank" class="${project.live_url ? 'flex-1' : 'w-full'} text-center px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors">
                            ${project.live_url ? 'GitHub' : 'View on GitHub'}
                        </a>
                    </div>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        projectsContainer.innerHTML = `
            <div class="col-span-full text-red-400 text-center">
                Failed to load projects. Please refresh the page.
            </div>
        `;
        console.error('Projects loading error:', error);
    }
}

// Call the function to load projects
loadProjects();

// Fetch GitHub Stats
async function loadGitHubStats() {
    const githubStatsContainer = document.getElementById('github-stats');
    
    githubStatsContainer.innerHTML = `
        <div class="flex justify-center items-center py-8">
            <div class="animate-pulse text-gray-400">Loading GitHub stats...</div>
        </div>
    `;
    
    try {
        const response = await fetch('/api/github-stats');
        const data = await response.json();
        
        if (data.error || !response.ok) {
            githubStatsContainer.innerHTML = `
                <div class="text-yellow-400 text-sm">
                    <p class="font-bold mb-2">⚠️ GitHub Stats Unavailable</p>
                    <p class="text-gray-400">${data.error || 'Unable to fetch data'}</p>
                    <p class="text-gray-500 text-xs mt-2">Check console (F12) for details</p>
                </div>
            `;
            console.error('GitHub API Error:', data.error);
            return;
        }
        
        const hasLanguages = data.top_languages && Object.keys(data.top_languages).length > 0;
        
        githubStatsContainer.innerHTML = `
            <div class="flex justify-between items-center py-3 border-b border-dark-border">
                <span class="text-gray-400">Public Repositories</span>
                <span class="text-2xl font-bold text-primary">${data.public_repos || 0}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-dark-border">
                <span class="text-gray-400">Followers</span>
                <span class="text-2xl font-bold text-primary">${data.followers || 0}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-dark-border">
                <span class="text-gray-400">Total Stars</span>
                <span class="text-2xl font-bold text-primary">${data.total_stars || 0}</span>
            </div>
            ${hasLanguages ? `
                <div class="pt-3">
                    <span class="text-gray-400 block mb-2">Top Languages</span>
                    <div class="flex flex-wrap gap-2">
                        ${Object.entries(data.top_languages).map(([lang, count]) => `
                            <span class="px-3 py-1 bg-dark-bg text-sm rounded border border-dark-border">
                                ${lang} (${count})
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : '<div class="pt-3 text-gray-500 text-sm">No language data available</div>'}
        `;
    } catch (error) {
        githubStatsContainer.innerHTML = `
            <div class="text-red-400 text-sm">
                <p class="font-bold mb-2">❌ Connection Error</p>
                <p class="text-gray-400">Failed to connect to GitHub API</p>
                <p class="text-gray-500 text-xs mt-2">${error.message}</p>
            </div>
        `;
        console.error('GitHub Stats Error:', error);
    }
}

// Fetch LeetCode Stats
async function loadLeetCodeStats() {
    const leetcodeStatsContainer = document.getElementById('leetcode-stats');
    
    leetcodeStatsContainer.innerHTML = `
        <div class="flex justify-center items-center py-8">
            <div class="animate-pulse text-gray-400">Loading LeetCode stats...</div>
        </div>
    `;
    
    try {
        const response = await fetch('/api/leetcode-stats');
        const data = await response.json();
        
        if (data.error || !response.ok) {
            leetcodeStatsContainer.innerHTML = `
                <div class="text-yellow-400 text-sm">
                    <p class="font-bold mb-2">⚠️ LeetCode Stats Unavailable</p>
                    <p class="text-gray-400">${data.error || 'Unable to fetch data'}</p>
                    <p class="text-gray-500 text-xs mt-2">This may be due to LeetCode API restrictions</p>
                    <a href="https://leetcode.com/u/mouli_dutta/" target="_blank" class="text-primary hover:underline text-xs mt-2 block">
                        View profile on LeetCode →
                    </a>
                </div>
            `;
            console.error('LeetCode API Error:', data.error);
            return;
        }
        
        leetcodeStatsContainer.innerHTML = `
            <div class="flex justify-between items-center py-3 border-b border-dark-border">
                <span class="text-gray-400">Total Solved</span>
                <span class="text-2xl font-bold text-primary">${data.total || 0}</span>
            </div>
            
            ${data.ranking ? `
                <div class="flex justify-between items-center py-3 border-b border-dark-border">
                    <span class="text-gray-400">Ranking</span>
                    <span class="text-2xl font-bold text-primary">#${data.ranking.toLocaleString()}</span>
                </div>
            ` : ''}
            ${data.badges && data.badges.length > 0 ? `
                <div class="pt-3">
                    <span class="text-gray-400 block mb-3">Badges</span>
                    <div class="flex flex-wrap gap-2">
                        ${data.badges.map(badge => {
                            // Fix icon URL - prepend LeetCode domain if it's a relative path
                            let iconUrl = badge.icon;
                            if (iconUrl && !iconUrl.startsWith('http')) {
                                iconUrl = `https://leetcode.com${iconUrl}`;
                            }
                            return `
                            <div class="flex items-center gap-2 px-3 py-2 bg-dark-bg rounded-lg border border-dark-border">
                                ${iconUrl ? `<img src="${iconUrl}" alt="${badge.name}" class="w-6 h-6" onerror="this.style.display='none'">` : ''}
                                <span class="text-sm text-primary font-semibold">${badge.name}</span>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    } catch (error) {
        leetcodeStatsContainer.innerHTML = `
            <div class="text-red-400 text-sm">
                <p class="font-bold mb-2">❌ Connection Error</p>
                <p class="text-gray-400">Failed to connect to LeetCode API</p>
                <p class="text-gray-500 text-xs mt-2">${error.message}</p>
                <a href="https://leetcode.com/u/mouli_dutta/" target="_blank" class="text-primary hover:underline text-xs mt-2 block">
                    View profile on LeetCode →
                </a>
            </div>
        `;
        console.error('LeetCode Stats Error:', error);
    }
}

// Load stats on page load
loadGitHubStats();
loadLeetCodeStats();

// Contact Form
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Here you can add form submission logic (e.g., send to backend or email service)
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

}); // End of DOMContentLoaded
