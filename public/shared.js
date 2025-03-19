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

        loadedComponents[componentTag] = fetch(componentUrl)
            .then((r) => r.text())
            .then((text) => {
                if (document.getElementById(componentContainerId)) {
                    return;
                }

                const el = document.createElement('div');
                el.style.display = 'none';
                el.id = componentContainerId;
                el.innerHTML = text;
            })
            .catch(err => {
                if (err.response.status === 404) {
                    throw new Error(`Component ${componentTag} not found at ${componentUrl}`);
                }

                throw err;
            });
    };

    const loadComponents = async (...components) => components.map(loadComponent);

    const mediaQueries = {
        sm: window.matchMedia("(min-width: 576px)"),
        md: window.matchMedia("(min-width: 768px)"),
        lg: window.matchMedia("(min-width: 992px)"),
        xl: window.matchMedia("(min-width: 1200px)"),
    };

    const data = {
        loadBadgesData: (() => {
            let badgesPromise = null;
            return async () => {
                if (badgesPromise === null) {
                    badgesPromise = fetch('/assets/badges.json').then((r) => r.json());
                }
                return badgesPromise;
            }
        })(),
        loadItemsData: (() => {
            let itemsPromise = null;
            return async () => {
                if (itemsPromise === null) {
                    itemsPromise = fetch('/assets/badges.json').then((r) => r.json())
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
                }
                return itemsPromise;
            }
        })()
    };

    window.$app = { defineComponent, loadComponent, loadComponents, mediaQueries, data };
})();
