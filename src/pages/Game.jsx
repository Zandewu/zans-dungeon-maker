import { useEffect } from "react";
import { initGame } from "../game/initGame.js";

export default function Game() {
  useEffect(() => {
    const startGame = async () => {
      try {
        // tunggu DOM siap
        await new Promise((r) => setTimeout(r, 100));

        // jalankan game async
        await initGame();
      } catch (err) {
        console.error("Gagal memulai game:", err);
      }
    };

    startGame();
  }, []);

  return <></>;
}
