const PAGES = ["landing", "reasons", "gallery", "letter", "games"];

function $(selector) {
	return document.querySelector(selector);
}

function $all(selector) {
	return Array.from(document.querySelectorAll(selector));
}

function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

function randomFrom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function setCurrentPage(pageId, { focus = true } = {}) {
	if (!PAGES.includes(pageId)) return;

	$all("[data-page]").forEach((page) => {
		page.classList.toggle("is-active", page.id === pageId);
	});

	$all(".nav-link").forEach((btn) => {
		btn.setAttribute("aria-current", btn.dataset.nav === pageId ? "page" : "false");
	});

	history.replaceState(null, "", `#${pageId}`);

	if (focus) {
		const page = document.getElementById(pageId);
		page?.querySelector("button, [href], input, textarea, select")?.focus?.();
	}

	// Lazy-start letter typing when you arrive.
	if (pageId === "letter") {
		startTypingLetter();
	}
}

function createClickHeart(x, y) {
	const heart = document.createElement("div");
	heart.className = "click-heart";
	heart.style.left = `${x}px`;
	heart.style.top = `${y}px`;
	const hue = 330 + Math.floor(Math.random() * 24);
	const fill = `hsl(${hue} 95% 70%)`;
	heart.innerHTML = `
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path fill="${fill}" d="M12 21s-7.2-4.35-9.6-8.55C.75 9.15 2.55 5.7 6.15 5.1c1.95-.33 3.75.54 4.95 1.95 1.2-1.41 3-2.28 4.95-1.95 3.6.6 5.4 4.05 3.75 7.35C19.2 16.65 12 21 12 21z"/>
		</svg>
	`.trim();
	document.body.appendChild(heart);
	window.setTimeout(() => heart.remove(), 1100);
}

// ---------- Background music ----------
function startBackgroundMusic() {
	const audio = $("#bg-music");
	if (!audio) return;

	if (!audio.src) {
		audio.src = "One_Direction_-_Little_Things_(mp3.pm).mp3";
	}

	// Requested default volume.
	audio.volume = 0.6;

	// Must be triggered by a user gesture (click/tap) to reliably play.
	void audio.play().catch(() => {
		// Ignore autoplay rejections; user can click again.
	});
}

// ---------- Reasons ----------
const REASONS = [
	"You make me smile in every way possible",
	"You appreciate every little thing about me",
	"You support my dreams (and I’ll always support yours)",
	"We silly frrr",
	"You’re my safe place <3",
	"SOBRANG ganda moooooo",
    "You smartt as helll",
    "You have the best taste in EVERYTHING",
    "You cooll as hell my idol :DD",
    "You make me want to be a better person",
];

let reasonIndex = 0;
function renderReason() {
	const indexEl = $("#reason-index");
	const textEl = $("#reason-text");
	if (!indexEl || !textEl) return;

	const displayIndex = clamp(reasonIndex + 1, 1, REASONS.length);
	indexEl.textContent = `Reason #${displayIndex}`;
	textEl.textContent = REASONS[reasonIndex] ?? "(no more reasons — but there are infinite)";
}

function revealNextReason() {
	reasonIndex = (reasonIndex + 1) % REASONS.length;
	renderReason();
}

function resetReasons() {
	reasonIndex = 0;
	const indexEl = $("#reason-index");
	const textEl = $("#reason-text");
	if (indexEl) indexEl.textContent = "Reason #1";
	if (textEl) textEl.textContent = "(click reveal)";
}

function makeHeartSVG(fill) {
	return `
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path fill="${fill}" d="M12 21s-7.2-4.35-9.6-8.55C.75 9.15 2.55 5.7 6.15 5.1c1.95-.33 3.75.54 4.95 1.95 1.2-1.41 3-2.28 4.95-1.95 3.6.6 5.4 4.05 3.75 7.35C19.2 16.65 12 21 12 21z"/>
		</svg>
	`.trim();
}

function seedFloatingHearts() {
	const field = $("#heart-field");
	if (!field) return;

	field.innerHTML = "";
	const count = 10;
	for (let i = 0; i < count; i += 1) {
		const heart = document.createElement("button");
		heart.type = "button";
		heart.className = "float-heart";
		heart.setAttribute("aria-label", "Heart message");

		const hue = 330 + Math.floor(Math.random() * 24);
		const fill = `hsl(${hue} 95% 70%)`;
		heart.innerHTML = makeHeartSVG(fill);

		const x = 8 + Math.random() * 84;
		const y = 20 + Math.random() * 65;
		heart.style.left = `${x}%`;
		heart.style.top = `${y}%`;
		heart.style.animationDelay = `${Math.random() * 1.5}s`;
		heart.style.animationDuration = `${3.0 + Math.random() * 2.2}s`;

		heart.addEventListener("click", (e) => {
			e.stopPropagation();
			const message = randomFrom(REASONS);
			const indexEl = $("#reason-index");
			const textEl = $("#reason-text");
			if (indexEl) indexEl.textContent = "Heart says";
			if (textEl) textEl.textContent = message;
		});

		field.appendChild(heart);
	}
}

// ---------- Gallery ----------
// Gallery photos (these files already exist in this folder).
// You can swap captions or add more entries anytime.
const GALLERY = [
	"6ca63154-0a95-43b7-9e1c-24f06f3ee0ef.jpg",
	"a26a0c2b-7f7e-43b9-b36c-731c00cd5153.jpg",
	"e60de52d-2a7e-4324-98da-738364f16597.jpg",
	"f410dd59-da14-4c73-9776-593e3ad9beeb.jpg",
	"fc365ca1-698c-4408-a5dd-5a80841c925e.jpg",
	"IMG_0708.jpg",
	"IMG_5767.jpg",
	"IMG_5781.jpg",
	"IMG_5893.jpg",
	"IMG_5940.jpg",
	"IMG_5945.jpg",
	"IMG_6024.jpg",
	"IMG_6025.jpg",
];

let galleryIndex = 0;
function renderGallery() {
	const img = $("#gallery-image");
	const dots = $("#gallery-dots");
	if (!img || !dots) return;

	const src = GALLERY[galleryIndex] ?? "";
	img.src = src;
	img.alt = `Gallery photo ${galleryIndex + 1}`;

	dots.innerHTML = "";
	GALLERY.forEach((_, i) => {
		const dot = document.createElement("button");
		dot.type = "button";
		dot.className = `dot${i === galleryIndex ? " is-active" : ""}`;
		dot.setAttribute("aria-label", `Go to photo ${i + 1}`);
		dot.addEventListener("click", () => {
			galleryIndex = i;
			renderGallery();
		});
		dots.appendChild(dot);
	});
}

function nextPhoto() {
	galleryIndex = (galleryIndex + 1) % GALLERY.length;
	renderGallery();
}

function prevPhoto() {
	galleryIndex = (galleryIndex - 1 + GALLERY.length) % GALLERY.length;
	renderGallery();
}

function setLightboxVisible(isVisible) {
	const lb = $("#lightbox");
	if (!lb) return;
	lb.classList.toggle("is-visible", isVisible);
	lb.setAttribute("aria-hidden", String(!isVisible));
}

function openLightbox() {
	const lbImg = $("#lightbox-image");
	const src = GALLERY[galleryIndex] ?? "";
	if (lbImg) {
		lbImg.src = src;
		lbImg.alt = `Expanded gallery photo ${galleryIndex + 1}`;
	}
	setLightboxVisible(true);
}

function closeLightbox() {
	setLightboxVisible(false);
}

// ---------- Love letter typing ----------
const LETTER_BODY =
    "I cant believe its our 2ND VALENTINES DAYYY ALREADYY. Ambilis ng panahon. \n" + 
	"Thank you for being my favorite person, my comfort, and my happiness.\n " +
	"Thank you for being understanding with me, Esp. on the days when I dont even understand myself.\n" +
	"Thank you for being patient with me, even if I u all the time :PPP, but most importantly, when I get quiet and struggle to explain what im feeling :) \n" +
    "Thank you for being you, and for loving me. I love youuuu soooo soo so so soooo muchhh. \n"; 
    


const LETTER_FROM = "Love,\nKerooo";

let typingTimer = 0;
let hasTypedOnce = false;
function stopTyping() {
	window.clearInterval(typingTimer);
	typingTimer = 0;
}

function typeInto(el, text, { speed = 22, onDone } = {}) {
	if (!el) return;
	el.textContent = "";
	let i = 0;
	stopTyping();
	typingTimer = window.setInterval(() => {
		i += 1;
		el.textContent = text.slice(0, i);
		if (i >= text.length) {
			stopTyping();
			onDone?.();
		}
	}, speed);
}

function showLetterInstant() {
	stopTyping();
	const bodyEl = $("#letter-body");
	const fromEl = $("#letter-from");
	if (bodyEl) bodyEl.textContent = LETTER_BODY;
	if (fromEl) fromEl.textContent = LETTER_FROM;
	hasTypedOnce = true;
}

function startTypingLetter({ force = false } = {}) {
	if (hasTypedOnce && !force) return;
	const bodyEl = $("#letter-body");
	const fromEl = $("#letter-from");
	if (!bodyEl || !fromEl) return;

	fromEl.textContent = "";
	typeInto(bodyEl, LETTER_BODY, {
		speed: 18,
		onDone: () => {
			typeInto(fromEl, LETTER_FROM, { speed: 22 });
			hasTypedOnce = true;
		},
	});
}

// ---------- Quiz ----------
const QUIZ = [
	{
		q: "Whats My Fav Color?",
		options: ["Red", "Purple", "Green"],
		answer: 2,
	},
	{
		q: "My Fav Fragrance? (Owned)",
		options: ["Afnan 9pm", "Hawas Ice", "Vulcan Feu"],
		answer: 1,
	},
	{
		q: "My Fav Game?",
		options: ["Roblox", "Valorant", "Gta V"],
		answer: 2,
	},
	{
		q: "Who loves the other more? >:)",
		options: ["ME", "YOU"],
		answer: 2,
	},
];

function renderQuiz() {
	const root = $("#quiz");
	if (!root) return;
	root.innerHTML = "";

	QUIZ.forEach((item, i) => {
		const block = document.createElement("div");
		block.className = "q";
		block.innerHTML = `
			<p class="q-title">${i + 1}. ${item.q}</p>
			<div class="q-options"></div>
		`.trim();
		const opts = block.querySelector(".q-options");
		item.options.forEach((label, j) => {
			const id = `q${i}_o${j}`;
			const row = document.createElement("label");
			row.setAttribute("for", id);
			row.innerHTML = `
				<input id="${id}" type="radio" name="q${i}" value="${j}" />
				<span>${label}</span>
			`.trim();
			opts?.appendChild(row);
		});
		root.appendChild(block);
	});
}

function scoreQuiz() {
	function getCorrectIndex(item) {
		const optionsCount = Array.isArray(item.options) ? item.options.length : 0;
		const ans = Number(item.answer);
		if (!Number.isFinite(ans) || optionsCount <= 0) return -1;

		// Most people write answers as 1-based (1 = first option).
		// Still accept 0 as a valid 0-based answer.
		if (ans === 0) return 0;
		const oneBasedIndex = ans - 1;
		if (oneBasedIndex >= 0 && oneBasedIndex < optionsCount) return oneBasedIndex;

		// Fallback: if someone used 0-based indices (0..n-1).
		if (ans >= 0 && ans < optionsCount) return ans;
		return -1;
	}

	let score = 0;
	QUIZ.forEach((item, i) => {
		const chosen = document.querySelector(`input[name="q${i}"]:checked`);
		if (!chosen) return;
		const correctIndex = getCorrectIndex(item);
		if (Number(chosen.value) === correctIndex) score += 1;
	});

	const result = $("#quiz-result");
	if (!result) return;

	if (score === QUIZ.length) {
		result.textContent = `Perfect! ${score}/${QUIZ.length}. Okay wow… marry me.`;
	} else if (score >= Math.ceil(QUIZ.length * 0.6)) {
		result.textContent = `So close! ${score}/${QUIZ.length}. Still obsessed with you.`;
	} else {
		result.textContent = `${score}/${QUIZ.length}. That’s fine… I’ll just kiss you until you remember.`;
	}
}

function resetQuiz() {
	$all("#quiz input[type='radio']").forEach((input) => {
		input.checked = false;
	});
	const result = $("#quiz-result");
	if (result) result.textContent = "";
}


// ---------- Forever button ----------
function foreverYes() {
	const note = $("#forever-note");
	if (note) note.textContent = "YAYYYYY. Locked in forever. 💗";

	// Tiny celebration: spawn a few click-hearts.
	const cx = window.innerWidth / 2;
	const cy = window.innerHeight / 2;
	for (let i = 0; i < 18; i += 1) {
		window.setTimeout(() => {
			const dx = (Math.random() - 0.5) * 220;
			const dy = (Math.random() - 0.5) * 140;
			createClickHeart(cx + dx, cy + dy);
		}, i * 40);
	}
}

// ---------- Wire-up ----------
document.addEventListener("DOMContentLoaded", () => {
	// Navigate
	$("#start-btn")?.addEventListener("click", () => {
		startBackgroundMusic();
		setCurrentPage("reasons");
	});
	$("#skip-btn")?.addEventListener("click", () => setCurrentPage("reasons"));

	$all("[data-next]").forEach((btn) => {
		btn.addEventListener("click", () => setCurrentPage(btn.dataset.next, { focus: true }));
	});

	$all(".nav-link").forEach((btn) => {
		btn.addEventListener("click", () => setCurrentPage(btn.dataset.nav, { focus: true }));
	});

	const initial = location.hash?.replace("#", "");
	if (initial && PAGES.includes(initial)) {
		setCurrentPage(initial, { focus: false });
	} else {
		setCurrentPage("landing", { focus: false });
	}

	// Click hearts on background
	document.addEventListener("click", (e) => {
		// Don't spawn hearts for UI interactions.
		const target = e.target;
		if (!(target instanceof HTMLElement)) return;
		if (target.closest("button, input, label")) return;
		if (target.closest("#gallery-image")) return;
		createClickHeart(e.clientX, e.clientY);
	});

	// Reasons
	resetReasons();
	$("#reveal-reason")?.addEventListener("click", () => {
		if ($("#reason-text")?.textContent === "(click reveal)") {
			renderReason();
		} else {
			revealNextReason();
		}
	});
	$("#reset-reasons")?.addEventListener("click", resetReasons);
	seedFloatingHearts();

	// Gallery
	renderGallery();
	$("#next-photo")?.addEventListener("click", nextPhoto);
	$("#prev-photo")?.addEventListener("click", prevPhoto);
	$("#gallery-image")?.addEventListener("click", openLightbox);
	$("#lightbox-close")?.addEventListener("click", closeLightbox);
	$("#lightbox")?.addEventListener("click", (e) => {
		if (e.target && e.target.id === "lightbox") closeLightbox();
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeLightbox();
		const galleryPage = document.getElementById("gallery");
		const galleryActive = galleryPage?.classList.contains("is-active");
		if (e.key === "ArrowRight" && galleryActive) nextPhoto();
		if (e.key === "ArrowLeft" && galleryActive) prevPhoto();
	});

	// Letter
	$("#retype-letter")?.addEventListener("click", () => {
		hasTypedOnce = false;
		startTypingLetter({ force: true });
	});
	$("#instant-letter")?.addEventListener("click", showLetterInstant);

	// Quiz
	renderQuiz();
	$("#submit-quiz")?.addEventListener("click", scoreQuiz);
	$("#reset-quiz")?.addEventListener("click", resetQuiz);

	// Forever
	$("#forever-btn")?.addEventListener("click", foreverYes);

});
