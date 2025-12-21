// Inserts the current year into any element with id 'year'
// Used in footers for ensuring up-to-date copyright text
document.getElementById('year').textContent = new Date().getFullYear();