# sakiko_controls_extracted

This package contains the page shell and front-end control logic extracted from the site's HAR capture.

Included:
- `index.original.html`: exact HTML captured from the page.
- `index.html`: cleaned HTML with browser-injected Kaspersky script/link removed.
- `src/`: Live2D runtime + site logic files.
- `assets/image/costumeBG.png`: background image used by the canvas.
- `sakiko_model_urls.txt`: URLs observed for the model package, not downloaded into this controls-only package.

Not included:
- `assets/live2d/sakiko/` model assets (moc, textures, expressions, motions, sounds). Those were excluded here because this package is focused on the page controls and logic.

Notes:
- The cleaned page still references the Sakiko model path from `src/LAppDefine.js`.
- To make it run locally, add the model assets under `assets/live2d/sakiko/`.
