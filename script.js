const toggleBtn = document.getElementById("toggle-btn");
toggleBtn.addEventListener('click', () => {
	const sidebar = document.getElementById("sidebar");
	sidebar.classList.toggle("sidebar-hidden")
})