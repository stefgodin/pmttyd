(() => {
    if (window.$app) {
        return;
    }

    const defineComponent = async (componentName, classFactory) => {
        const component = await Promise.resolve(classFactory({ name: componentName }));

        if (customElements.get(componentName)) {
            console.warning(`Attempted to define component ${componentName} twice`);
            return;
        }

        customElements.define(componentName, component);
    };

    const throwWindowError = async (fn) => {
        const oldOnError = window.onerror;
        let windowError = null;
        window.onerror = (_msg, _url, _lineNo, _columnNo, error) => {
            windowError = error;
            return true;
        };
        try {
            await Promise.resolve(fn());
        } finally {
            window.onerror = oldOnError;
        }
        if (windowError) {
            throw windowError;
        }
    };

    const fixScriptElement = (scriptEl) => {
        const scriptCloneEl = document.createElement('script');
        scriptCloneEl.text = scriptEl.innerHTML;
        for (let attr of scriptEl.attributes) {
            scriptCloneEl.setAttribute(attr.name, attr.value);
        }
        scriptEl.replaceWith(scriptCloneEl);
    };

    const loadedComponents = {};
    const loadComponent = async (componentName) => {
        let componentUrl = `${encodeURIComponent(componentName)}.html`;
        if (!componentName.startsWith('/')) {
            componentUrl = `/components/${componentUrl}`;
        }

        const componentTag = componentUrl.split('/').reverse()[0].replace(/\..+/g, '');
        const componentContainerId = `component:${componentTag}`;

        if (componentTag in loadedComponents) {
            return loadedComponents[componentTag];
        }

        try {
            loadedComponents[componentTag] = fetch(componentUrl);
            const response = await loadedComponents[componentTag];
            const html = await response.text();
            if (document.getElementById(componentContainerId)) {
                return;
            }

            const componentContainer = document.createElement('div');
            componentContainer.style.display = 'none';
            componentContainer.id = componentContainerId;
            componentContainer.innerHTML = html;

            for (const scriptEl of componentContainer.querySelectorAll('script')) {
                fixScriptElement(scriptEl);
            }

            await throwWindowError(() => document.body.append(componentContainer));
        } catch (err) {
            if (err.response?.status === 404) {
                throw new Error(`Component ${componentTag} not found at ${componentUrl}`);
            }

            throw new Error(`An error occured while loading component ${componentTag}: ${err}`);
        }
    };

    const loadComponents = async (...components) => Promise.all(components.map(loadComponent));

    const mediaQueries = {
        sm: window.matchMedia("(min-width: 576px)"),
        md: window.matchMedia("(min-width: 768px)"),
        lg: window.matchMedia("(min-width: 992px)"),
        xl: window.matchMedia("(min-width: 1200px)"),
    };

    const data = {
        loadBadgesData: (() => {
            let badgesPromise = fetch('/assets/badges.json').then((r) => r.json());
            return async () => badgesPromise;
        })(),
        loadItemsData: (() => {
            let itemsPromise = fetch('/assets/items.json').then((r) => r.json())
                .then((items) => {
                    const itemAsIngredientMap = {};
                    for (let item of items) {
                        for (let recipe of item.recipes ?? []) {
                            for (let recipeItem of recipe.items) {
                                itemAsIngredientMap[recipeItem] ??= [];
                                if (!itemAsIngredientMap[recipeItem].includes(item.id)) {
                                    itemAsIngredientMap[recipeItem].push(item.id);
                                }
                            }
                        }
                    }

                    for (let itemId in itemAsIngredientMap) {
                        items[itemId - 1].usedIn = itemAsIngredientMap[itemId];
                    }

                    return items;
                });

            return async () => itemsPromise;
        })()
    };

    window.$app = { defineComponent, loadComponent, loadComponents, mediaQueries, data };
})();
