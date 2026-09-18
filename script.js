// Animasi tulisan "Halo" dalam berbagai bahasa, bergerak acak dari satu
// ujung layar ke ujung lainnya. Jalankan pada halaman HTML di browser.

function startGreetingAnimation() {
	const start = () => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	document.body.style.cssText = "margin:0;overflow:hidden;background:#090b1a";
	document.body.appendChild(canvas);

	const greetings = [
		"Halo", "Hello", "Bonjour", "Hola", "Ciao", "Hallo", "Olá", "Привет",
		"你好", "こんにちは", "안녕하세요", "مرحبا", "สวัสดี", "नमस्ते", "שלום"
	];
	const colors = ["#ff6b6b", "#ffd166", "#06d6a0", "#4cc9f0", "#c77dff", "#f72585"];
	const items = [];

	function resize() {
		canvas.width = innerWidth * devicePixelRatio;
		canvas.height = innerHeight * devicePixelRatio;
		canvas.style.width = `${innerWidth}px`;
		canvas.style.height = `${innerHeight}px`;
		ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
	}

	function createGreeting() {
		const horizontal = Math.random() < 0.5;
		const size = 24 + Math.random() * 42;
		const text = greetings[Math.floor(Math.random() * greetings.length)];
		const direction = Math.random() < 0.5 ? 1 : -1;
		const item = {
			text, size, horizontal, direction,
			color: colors[Math.floor(Math.random() * colors.length)],
			progress: -0.2,
			speed: 0.00015 + Math.random() * 0.00022,
			fixed: Math.random() * (horizontal ? innerHeight : innerWidth),
			angle: (Math.random() - 0.5) * 0.12
		};
		items.push(item);
	}

	function animate(time) {
		ctx.clearRect(0, 0, innerWidth, innerHeight);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		for (let i = items.length - 1; i >= 0; i--) {
			const item = items[i];
			item.progress += item.speed * 16;
			const distance = item.progress * (horizontal ? innerWidth : innerHeight);
			const x = horizontal
				? (item.direction > 0 ? distance : innerWidth - distance)
				: item.fixed;
			const y = horizontal
				? item.fixed
				: (item.direction > 0 ? distance : innerHeight - distance);

			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(item.angle);
			ctx.font = `700 ${item.size}px system-ui, sans-serif`;
			ctx.shadowColor = item.color;
			ctx.shadowBlur = 18;
			ctx.fillStyle = item.color;
			ctx.fillText(item.text, 0, 0);
			ctx.restore();

			if (item.progress > 1.2) items.splice(i, 1);
		}

		if (items.length < 12 && Math.random() < 0.035) createGreeting();
		requestAnimationFrame(animate);
	}

	addEventListener("resize", resize);
	resize();
	for (let i = 0; i < 8; i++) {
		createGreeting();
		items[i].progress = Math.random();
	}
	requestAnimationFrame(animate);
};

	if (document.body) start();
	else document.addEventListener("DOMContentLoaded", start, { once: true });
}

startGreetingAnimation();
