const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-nav]");
const progressBar = document.querySelector(".scroll-progress span");
const dialog = document.querySelector("[data-dialog]");
const dialogImage = document.querySelector("[data-dialog-image]");
const dialogClose = document.querySelector("[data-dialog-close]");

const updatePageState = () => {
	const scrollable = document.documentElement.scrollHeight - window.innerHeight;
	const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
	progressBar.style.width = `${Math.min(progress * 100, 100)}%`;
	header.classList.toggle("is-scrolled", window.scrollY > 20);
};

updatePageState();
window.addEventListener("scroll", updatePageState, { passive: true });

menuButton.addEventListener("click", () => {
	const isOpen = menuButton.getAttribute("aria-expanded") === "true";
	menuButton.setAttribute("aria-expanded", String(!isOpen));
	navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => {
		menuButton.setAttribute("aria-expanded", "false");
		navigation.classList.remove("is-open");
	});
});

const revealObserver = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) {
			return;
		}

		entry.target.classList.add("is-visible");
		observer.unobserve(entry.target);
	});
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const navLinks = [...navigation.querySelectorAll("a[href^='#']")];
const sectionObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) {
			return;
		}

		navLinks.forEach((link) => {
			link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
		});
	});
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

document.querySelectorAll("[data-image]").forEach((trigger) => {
	trigger.addEventListener("click", () => {
		dialogImage.src = trigger.dataset.image;
		dialogImage.alt = trigger.dataset.alt || "拡大画像";
		dialog.showModal();
	});
});

dialogClose.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
	if (event.target === dialog) {
		dialog.close();
	}
});
