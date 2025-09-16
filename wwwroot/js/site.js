// Professional JavaScript for Assistance Management System
// Enhanced UI interactions and animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initializeLoadingScreen();
    
    // Sidebar functionality
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.getElementById('mainContent');

    // Toggle sidebar on mobile
    function toggleSidebar() {
        if (window.innerWidth <= 1024) {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('show');
        }
    }

    // Close sidebar when clicking overlay
    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
    }

    // Event listeners
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', toggleSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(event.target) && 
                !mobileSidebarToggle.contains(event.target) && 
                sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
        }
    });

    // Set active navigation link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Auto-hide alerts
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (alert.classList.contains('alert-dismissible')) {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        }
    });

    // Search functionality
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.content-section').querySelector('table');
            
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    });

    // Filter functionality
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const filterValue = this.value;
            const table = this.closest('.content-section').querySelector('table');
            
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    if (filterValue === '' || row.dataset.filter === filterValue) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    });

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            // Focus on first input
            const firstInput = this.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        });
    });

    // Table row click functionality
    const tableRows = document.querySelectorAll('tbody tr[data-href]');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            const href = this.dataset.href;
            if (href) {
                window.location.href = href;
            }
        });
        
        row.style.cursor = 'pointer';
    });

    // Confirm delete functionality
    const deleteButtons = document.querySelectorAll('[data-confirm-delete]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const message = this.dataset.confirmDelete || 'هل أنت متأكد من الحذف؟';
            if (confirm(message)) {
                const form = this.closest('form');
                if (form) {
                    form.submit();
                } else {
                    window.location.href = this.href;
                }
            }
        });
    });

    // Loading states
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.form && this.form.checkValidity()) {
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
            }
        });
    });

    // Number formatting
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                this.value = parseFloat(this.value).toFixed(2);
            }
        });
    });

    // Date formatting
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });

    // Copy to clipboard functionality
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.dataset.copy;
            navigator.clipboard.writeText(text).then(() => {
                // Show success message
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    });

    // Print functionality
    const printButtons = document.querySelectorAll('[data-print]');
    printButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.dataset.print;
            const element = document.querySelector(target);
            if (element) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>طباعة</title>
                            <style>
                                body { font-family: 'Cairo', sans-serif; direction: rtl; }
                                table { width: 100%; border-collapse: collapse; }
                                th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                                th { background-color: #f2f2f2; }
                            </style>
                        </head>
                        <body>
                            ${element.innerHTML}
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        });
    });

    // Export functionality
    const exportButtons = document.querySelectorAll('[data-export]');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.export;
            const table = this.closest('.content-section').querySelector('table');
            
            if (table) {
                if (format === 'csv') {
                    exportToCSV(table);
                } else if (format === 'excel') {
                    exportToExcel(table);
                }
            }
        });
    });

    // Helper functions
    function exportToCSV(table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        const csv = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            return cells.map(cell => `"${cell.textContent.trim()}"`).join(',');
        }).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'export.csv';
        link.click();
    }

    function exportToExcel(table) {
        // Simple Excel export using HTML table
        const html = table.outerHTML;
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'export.xls';
        link.click();
    }

    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        initializeCharts();
    }

    // Initialize dashboard animations
    initializeDashboardAnimations();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize notifications
    initializeNotifications();
});

// Loading screen functionality
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Hide loading screen after page load
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }, 1000);
        });
    }
}

// Dashboard animations
function initializeDashboardAnimations() {
    // Animate statistics cards on scroll
    const statCards = document.querySelectorAll('.stat-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0s';
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, { threshold: 0.1 });

    statCards.forEach(card => {
        observer.observe(card);
    });

    // Add hover effects to cards
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Enhanced search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.trim();
            
            if (searchTerm.length > 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(searchTerm);
                }, 300);
            } else {
                clearSearchResults();
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    performSearch(searchTerm);
                }
            }
        });
    }
}

// Search implementation
function performSearch(term) {
    // Implement global search functionality
    console.log('Searching for:', term);
    
    // Show search results dropdown
    showSearchResults([
        { title: 'مستفيد: أحمد محمد', type: 'beneficiary', url: '/Beneficiaries/Details/1' },
        { title: 'مساعدة: مساعدة طبية', type: 'assistance', url: '/Assistances/Details/1' },
        { title: 'مؤسسة: جمعية الخير', type: 'organization', url: '/Organizations/Details/1' }
    ]);
}

// Show search results
function showSearchResults(results) {
    // Create or update search results dropdown
    let dropdown = document.querySelector('.search-results-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'search-results-dropdown';
        document.querySelector('.search-container').appendChild(dropdown);
    }
    
    dropdown.innerHTML = results.map(result => `
        <div class="search-result-item" onclick="window.location.href='${result.url}'">
            <i class="fas fa-${getResultIcon(result.type)}"></i>
            <span>${result.title}</span>
        </div>
    `).join('');
    
    dropdown.style.display = 'block';
}

// Get icon for search result type
function getResultIcon(type) {
    const icons = {
        beneficiary: 'user',
        assistance: 'hand-holding-heart',
        organization: 'building',
        project: 'project-diagram'
    };
    return icons[type] || 'search';
}

// Clear search results
function clearSearchResults() {
    const dropdown = document.querySelector('.search-results-dropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

// Notifications functionality
function initializeNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        // Mark notifications as read
        notificationBtn.addEventListener('click', function() {
            markNotificationsAsRead();
        });
        
        // Auto-refresh notifications
        setInterval(updateNotifications, 30000); // Every 30 seconds
    }
}

// Mark notifications as read
function markNotificationsAsRead() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.display = 'none';
    }
}

// Update notifications
function updateNotifications() {
    // Implement real-time notification updates
    console.log('Updating notifications...');
}

// Chart initialization
function initializeCharts() {
    // Initialize dashboard charts
    const chartElements = document.querySelectorAll('[data-chart]');
    
    chartElements.forEach(element => {
        const chartType = element.dataset.chart;
        const chartData = JSON.parse(element.dataset.chartData || '{}');
        
        switch (chartType) {
            case 'doughnut':
                createDoughnutChart(element, chartData);
                break;
            case 'line':
                createLineChart(element, chartData);
                break;
            case 'bar':
                createBarChart(element, chartData);
                break;
        }
    });
}

// Create doughnut chart
function createDoughnutChart(element, data) {
    new Chart(element, {
        type: 'doughnut',
        data: {
            labels: data.labels || ['المدفوع', 'المعلق', 'المعتمد'],
            datasets: [{
                data: data.values || [30, 20, 50],
                backgroundColor: [
                    '#10b981',
                    '#f59e0b',
                    '#3b82f6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

// Create line chart
function createLineChart(element, data) {
    new Chart(element, {
        type: 'line',
        data: {
            labels: data.labels || ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
            datasets: [{
                label: 'المساعدات',
                data: data.values || [12, 19, 3, 5, 2, 3],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create bar chart
function createBarChart(element, data) {
    new Chart(element, {
        type: 'bar',
        data: {
            labels: data.labels || ['طبية', 'أيتام', 'أرامل', 'تعليمية'],
            datasets: [{
                label: 'عدد المساعدات',
                data: data.values || [12, 19, 3, 5],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Utility functions
window.AMS = {
    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP'
        }).format(amount);
    },

    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Show toast notification
    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(toast);
            bsAlert.close();
        }, 5000);
    },

    // Confirm action
    confirm: function(message, callback) {
        if (confirm(message)) {
            callback();
        }
    }
};