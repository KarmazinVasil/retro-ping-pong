const SettingsManager = (function () {
    const settings = [
      {
        name: "Background sound",
        values: ["OFF", "25%", "50%", "75%", "100%"],
        index: 2,
        apply: (value) => {
          const bg = document.getElementById("bgNoise");
          if (!bg) return;
          if (value === "OFF") {
            bg.pause();
          } else {
            bg.volume = parseInt(value) / 100;
            bg.loop = true;
            bg.play().catch(() => {});
          }
        },
      },
    ];
  
    let selectedIndex = 0;
    let active = false;
  
    function showOptions() {
      terminal.innerHTML += `\n=== SETTINGS ===\n`;
      settings.forEach((s, i) => {
        const selected = i === selectedIndex ? ">>" : "  ";
        terminal.innerHTML += `${selected} ${s.name}: ${s.values[s.index]}\n`;
      });
      terminal.innerHTML += `\n(Use ↑↓ to navigate, ←→ to adjust, Q to exit)\n`;
      terminal.scrollTop = terminal.scrollHeight;
    }
  
    function updateDisplay() {
      const lines = terminal.innerHTML.split("\n");
      const base = lines.findIndex((line) => line.includes("=== SETTINGS ==="));
      if (base === -1) return;
  
      for (let i = 0; i < settings.length; i++) {
        const s = settings[i];
        const selected = i === selectedIndex ? ">>" : "  ";
        lines[base + 1 + i] = `${selected} ${s.name}: ${s.values[s.index]}`;
      }
  
      terminal.innerHTML = lines.join("\n");
      terminal.scrollTop = terminal.scrollHeight;
    }
  
    function handleKey(key) {
      if (!active) return false;
  
      switch (key) {
        case "ArrowUp":
          selectedIndex = (selectedIndex - 1 + settings.length) % settings.length;
          updateDisplay();
          return true;
  
        case "ArrowDown":
          selectedIndex = (selectedIndex + 1) % settings.length;
          updateDisplay();
          return true;
  
        case "ArrowLeft":
          changeValue(-1);
          return true;
  
        case "ArrowRight":
          changeValue(1);
          return true;

        case "Q":
          exitOptions("user_exit");
          return true;

        case "q":
          exitOptions("user_exit");
          return true;
      }
  
      return false;
    }
  
    function changeValue(direction) {
      const setting = settings[selectedIndex];
      setting.index = (setting.index + direction + setting.values.length) % setting.values.length;
      setting.apply(setting.values[setting.index]);
      updateDisplay();
    }
  
    function exitOptions(reason) {
      if (!active) return;
      active = false;
  
      terminal.innerHTML += reason === "user_exit"
        ? "\nExited settings.\n"
        : "\nSettings closed.\n";
  
      addInputField();
      terminal.scrollTop = terminal.scrollHeight;
    }
  
    return {
      enter: () => {
        active = true;
        selectedIndex = 0;
        showOptions();
      },
      handleKey,
      isActive: () => active,
      exitOptions,
    };
  })();
  