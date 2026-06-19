/* ============================================================ 
   Zeeshan Ali — Live GitHub integration 
   Fetches profile + most-recently-updated repos from the GitHub 
   REST API and renders them. Degrades gracefully on rate-limit 
   or network error by linking to the profile. 
   ============================================================ */
(function () {
    'use strict';

    var USER = 'zeeshaaaan';
    // Curated, hand-picked repos shown in this exact order. 
    var FEATURED = ['AngularAuthUI', 'Node-js', 'MeanStack-Auth', 'devTinder', 'projSetup',
        'Contact-Manager-App'];

    var grid = document.getElementById('repoGrid');
    var profileEl = document.getElementById('ghProfile');
    var avatarEl = document.getElementById('ghAvatar');
    var nameEl = document.getElementById('ghName');
    var statsEl = document.getElementById('ghStats');
    if (!grid) return;

    /* Common GitHub language colors */
    var LANG_COLORS = {
        TypeScript: '#3178c6', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c',
        SCSS: '#c6538c', Java: '#b07219', Python: '#3572A5', Go: '#00ADD8', Rust: '#dea584',
        Shell: '#89e051', Vue: '#41b883', Dart: '#00B4AB', 'C#': '#178600', PHP: '#4F5D95',
        Ruby: '#701516', Kotlin: '#A97BFF', Swift: '#F05138'
    };

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function relativeTime(iso) {
        var then = new Date(iso).getTime();
        var diff = Date.now() - then;
        var day = 86400000;
        var days = Math.floor(diff / day);
        if (days < 1) return 'today';
        if (days === 1) return 'yesterday';
        if (days < 30) return days + ' days ago';
        var months = Math.floor(days / 30);
        if (months < 12) return months + (months === 1 ? ' month ago' : ' months ago');
        var years = Math.floor(months / 12);
        return years + (years === 1 ? ' year ago' : ' years ago');
    }

    function prettyName(name) {
        // turn "MeanStack-Auth" / "node_js" into something readable but keep it recognizable 
        return name;
    }

    var REPO_ICON = '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">' +
        '<path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 13.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>';

    function renderRepo(repo) {
        var color = LANG_COLORS[repo.language] || '#8a8a98';
        var desc = repo.description
            ? esc(repo.description)
            : (repo.language ? 'A ' + esc(repo.language) + ' project.' : 'Personal project.');

        var stars = repo.stargazers_count > 0
            ? '<span class="repo__stars">★ ' + repo.stargazers_count + '</span>' : '';
        var lang = repo.language
            ? '<span class="repo__lang"><i style="background:' + color + '"></i>' +
            esc(repo.language) + '</span>' : '';

        return '<a class="repo" href="' + esc(repo.html_url) + '" target="_blank" rel="noopener">'
            +
            '<div class="repo__top">' + REPO_ICON +
            '<span class="repo__name">' + esc(prettyName(repo.name)) + '</span></div>' +
            '<p class="repo__desc">' + desc + '</p>' +
            '<div class="repo__meta">' + lang + stars +
            '<span class="repo__updated">Updated ' + relativeTime(repo.updated_at) + '</span>' +
            '</div></a>';
    }

    function showError() {
        grid.innerHTML = '<div class="gh-error">Couldn\'t load repos right now (GitHub rate limit or offline). ' +
            '<a href="https://github.com/' + USER + '" target="_blank" rel="noopener">View them on GitHub ↗</a></div>';
    }

    /* ---- Profile ---- */
    fetch('https://api.github.com/users/' + USER)
        .then(function (r) { if (!r.ok) throw new Error('profile'); return r.json(); })
        .then(function (u) {
            if (u.avatar_url && avatarEl) avatarEl.style.backgroundImage = 'url(' + u.avatar_url + ')';
            if (nameEl) nameEl.textContent = u.name || ('@' + USER);
            if (statsEl) {
                statsEl.innerHTML =
                    '<span><b>' + (u.public_repos || 0) + '</b> repos</span>' +
                    '<span><b>' + (u.followers || 0) + '</b> followers</span>' +
                    '<span><b>' + (u.following || 0) + '</b> following</span>';
            }
        })
        .catch(function () { /* keep static fallbacks already in the HTML */ });

    /* ---- Repos ---- */
    fetch('https://api.github.com/users/' + USER + '/repos?sort=updated&per_page=100')
        .then(function (r) { if (!r.ok) throw new Error('repos'); return r.json(); })
        .then(function (repos) {
            if (!Array.isArray(repos) || !repos.length) { showError(); return; }
            // index repos by lowercased name for robust matching 
            var byName = {};
            repos.forEach(function (r) { byName[r.name.toLowerCase()] = r; });
            // keep only the featured repos, in the order specified 
            var top = FEATURED
                .map(function (name) { return byName[name.toLowerCase()]; })
                .filter(Boolean);
            if (!top.length) { showError(); return; }
            grid.innerHTML = top.map(renderRepo).join('');
        })
        .catch(showError);
})();