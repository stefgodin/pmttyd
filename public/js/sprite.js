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


    class ItemSprite extends HTMLElement {
        static get observedAttributes() {
            return ['index', 'src', 'size', 'scale'];
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
                (src !== '' ? `background: url(${src})` : ''),
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
            const scale = parseFloat(this.getAttribute('scale') ?? 1.0);
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
