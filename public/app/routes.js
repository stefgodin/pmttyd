(() => {
    if (window.$routes) {
        return;
    }

    const ROUTES = [
        {
            resolve: (segments) => segments[0] === 'badges',
            component: 'app-badges',
            change: (segments, el) => {
                el.setAttribute('badge', segments[1] ?? '');
            }
        },
        {
            resolve: (segments) => segments[0] === 'recipes',
            component: 'app-recipes',
            change: (segments, el) => {
                el.setAttribute('item', segments[1] ?? '');
            }
        },
        {
            resolve: (segments) => segments[0] === 'starpieces',
            component: 'app-starpieces'
        },
        {
            resolve: (segments) => segments[0] === 'shinesprites',
            component: 'app-shinesprites'
        },
        {
            resolve: (segments) => segments[0] === 'tattlelog',
            component: 'app-tattlelog'
        },
        {
            // Catch all route
            resolve: () => true,
            change: () => window.location.hash = '#!/badges'
        },
    ];

    window.$routes = ROUTES;
})();
