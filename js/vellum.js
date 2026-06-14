// Render palette swatches from the JSON tokens file
(function () {
    fetch("js/vellum_design_tokens.json")
        .then((response) => response.json())
        .then((tokens) => {
            const container = document.getElementById("vellum-palette-render");
            const groupLabels = {
                neutrals: "Neutrals",
                surfaces: "Surfaces",
                accents: "Accents",
            };

            Object.entries(tokens.colors).forEach(function ([groupKey, group]) {
                const groupEl = document.createElement("div");
                groupEl.className = "vellum-palette-group";

                const label = document.createElement("p");
                label.className = "vellum-palette-group__label";
                label.textContent = groupLabels[groupKey] || groupKey;
                groupEl.appendChild(label);

                Object.entries(group).forEach(function ([key, color]) {
                    const row = document.createElement("div");
                    row.className = "vellum-swatch";

                    const block = document.createElement("div");
                    block.className = "vellum-swatch__block";
                    block.style.backgroundColor = color.value;

                    const name = document.createElement("span");
                    name.className = "vellum-swatch__name";
                    const raw = key.replace(/-/g, " ");
                    name.textContent =
                        raw.charAt(0).toUpperCase() + raw.slice(1);

                    const hex = document.createElement("span");
                    hex.className = "vellum-swatch__hex";
                    hex.textContent =
                        color.value + (color.css ? " · " + color.css : "");

                    const role = document.createElement("span");
                    role.className = "vellum-swatch__role";
                    role.textContent = color.role;

                    row.appendChild(block);
                    row.appendChild(name);
                    row.appendChild(hex);
                    row.appendChild(role);
                    groupEl.appendChild(row);
                });

                container.appendChild(groupEl);
            });
        })
        .catch((error) =>
            console.error("Failed to load design tokens:", error),
        );
})();

// Syntax highlighting
hljs.highlightAll();

// Nav hamburger
(function () {
    var btn = document.getElementById("navHamburger");
    var nav = document.getElementById("rightHandNav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
})();
