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
        saveSettings();
      },
    },
    {
      name: "CRT Effect",
      values: ["ON", "OFF"],
      index: 0,
      apply: (value) => {
        if (value === "OFF") {
          document.body.classList.add("no-crt-effect");
        } else {
          document.body.classList.remove("no-crt-effect");
        }
        saveSettings();
      },
    },
  ];

  let selectedIndex = 0;
  let active = false;
  let settingsStartLine = -1;

    function loadSettings() {
      const savedSettings = localStorage.getItem('terminalSettings');
      if (savedSettings) {
          try {
              const parsed = JSON.parse(savedSettings);
              settings.forEach(setting => {
                  const savedSetting = parsed[setting.name];
                  if (savedSetting) {
                      setting.index = savedSetting.index;
                      setting.apply(savedSetting.value);
                  }
              });
          } catch (e) {
              console.error("Failed to load settings:", e);
          }
      }
  }

  function saveSettings() {
      const settingsToSave = {};
      settings.forEach(setting => {
          settingsToSave[setting.name] = {
              index: setting.index,
              value: setting.values[setting.index]
          };
      });
      localStorage.setItem('terminalSettings', JSON.stringify(settingsToSave));
  }

  loadSettings();

  function showOptions() {
    const lines = terminal.innerHTML.split("\n");
    const preSettingsLines = settingsStartLine === -1 
      ? lines 
      : lines.slice(0, settingsStartLine);
    
    const newLines = [
      ...preSettingsLines,
      "=== SETTINGS ===",
      ...settings.map((s, i) => {
        const selected = i === selectedIndex ? ">>" : "  ";
        const activeClass = i === selectedIndex ? "settings-active-line" : "";
        return `<span class="${activeClass}">${selected} ${s.name}: ${s.values[s.index]}</span>`;
      }),
      "",
      "(Use ↑↓ to navigate, ←→ to adjust, press Q or any key to exit)"
    ];
    
    settingsStartLine = preSettingsLines.length;
    terminal.innerHTML = newLines.join("\n");
    terminal.scrollTop = terminal.scrollHeight;
  }

  function clearActiveStyles() {
    const activeElements = terminal.querySelectorAll('.settings-active-line');
    activeElements.forEach(el => {
        el.classList.remove('settings-active-line');
    });
}

  function updateDisplay() {
    clearActiveStyles();
    
    const lines = terminal.innerHTML.split("\n");
    for (let i = 0; i < settings.length; i++) {
        const s = settings[i];
        const selected = i === selectedIndex ? ">>" : "  ";
        const activeClass = i === selectedIndex ? "settings-active-line" : "";
        lines[settingsStartLine + 1 + i] = `<span class="${activeClass}">${selected} ${s.name}: ${s.values[s.index]}</span>`;
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

    clearActiveStyles();
    active = false;
    settingsStartLine = -1;

    document.removeEventListener('keydown', handleOutsideInteraction);

    terminal.innerHTML += reason === "user_exit"
      ? "\nExited settings.\n"
      : "\nSettings closed.\n";

    addInputField();
    terminal.scrollTop = terminal.scrollHeight;
  }

      function handleOutsideInteraction(e) {
        if (!active) return;
        
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Q', 'q', 'Enter'].includes(e.key)) {
            exitOptions('auto_close');
        }
    }

    return {
        enter: () => {
            active = true;
            selectedIndex = 0;
            document.addEventListener('keydown', handleOutsideInteraction);
            showOptions();
        },
        handleKey,
        isActive: () => active,
        exitOptions,
    };
})();