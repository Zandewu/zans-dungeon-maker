import kaplay from "kaplay";

export async function initGame() {
  // tunggu DOM siap sepenuhnya
  await new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });

  // cari canvas, kalau belum ada, buat
  let canvas = document.getElementById("mycanvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "mycanvas";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.display = "block";
    canvas.style.background = "black";
    document.body.innerHTML = ""; // bersihkan isi sebelumnya
    document.body.appendChild(canvas);
  }

  // inisialisasi kaplay
  const k = kaplay({
    canvas: canvas,
    width: window.innerWidth,
    height: window.innerHeight,
    background: [10, 0, 20],
  });

  // contoh scene
  k.scene("main", () => {
    k.add([
      k.text("🎮 Kaplay Berhasil Dimulai!", { size: 32 }),
      k.pos(k.center()),
      k.anchor("center"),
      k.color(255, 255, 255),
    ]);
  });

  // mulai
  k.go("main");
}
