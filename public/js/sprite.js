(() => {
    const spritesheetPromises = {};
    const getSpritesheetWidth = async (src) => {
        if (spritesheetPromises[src] !== undefined) {
            return spritesheetPromises[src];
        }

        return spritesheetPromises[src] = new Promise((res, rej) => {
            const img = new Image();
            img.src = src;
            img.onload = () => res(img.width);
            img.onerror = (e) => {
                delete spritesheetPromises[src];
                rej(e);
            };
        });
    }

    const mediaQueries = {
        sm: window.matchMedia("(min-width: 576px)"),
        md: window.matchMedia("(min-width: 768px)"),
        lg: window.matchMedia("(min-width: 992px)"),
        xl: window.matchMedia("(min-width: 1200px)"),
    };

    class ItemSprite extends HTMLElement {
        static get observedAttributes() {
            return ['index', 'src', 'size', 'scale', 'scale-sm', 'scale-md', 'scale-lg', 'scale-xl'];
        }

        attributeChangedCallback() {
            this.update();
        }

        connectedCallback() {
            this.update();
        }

        async update() {
            const index = this.index;
            const size = this.size;
            const src = this.src;
            const scale = this.scale;

            const spritesheetWidth = await getSpritesheetWidth(src);

            const styleRules = [
                (src !== '' ? `background-image: url(${src})` : ''),
                `background-color: transparent`,
                `background-position: -${index * size * scale}px 0px`,
                `background-size: ${scale * spritesheetWidth}px`,
                `width: ${size * scale}px`,
                `height: ${size * scale}px`,
            ];
            this.innerHTML = `<div style="${styleRules.join(';')}">`;
        }

        get index() {
            const index = parseInt(this.getAttribute('index') ?? 0);
            if (isNaN(index) || index < 0) {
                return 0;
            }
            return index;
        }

        get size() {
            const size = parseInt(this.getAttribute('size') ?? 0);
            if (isNaN(size) || size < 0) {
                return 0;
            }
            return size;
        }

        get scale() {
            let scale = this.getAttribute('scale') ?? 1.0;
            for (let code in mediaQueries) {
                if (mediaQueries[code].matches && this.hasAttribute(`scale-${code}`)) {
                    scale = this.getAttribute(`scale-${code}`);
                }
            }

            scale = parseFloat(scale);
            if (isNaN(scale)) {
                return 1.0;
            }
            return scale;
        }

        get src() {
            return this.getAttribute('src') ?? '';
        }
    }

    window.customElements.define('item-sprite', ItemSprite);
})();
