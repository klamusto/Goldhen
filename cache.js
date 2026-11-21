/* PS4 GoldHen - offline cache installer shared by cache*.html */
(function () {
    "use strict";

    var msgs = document.getElementById("msgs");
    var bar = document.getElementById("bar");
    var wrap = document.getElementById("barWrap");
    var vid = document.getElementById("bgVideo");
    var tapHint = document.getElementById("tapHint");
    var reload = document.getElementById("reloadBtn");
    var leaving = false;

    function say(html) { if (msgs) msgs.innerHTML = html; }
    function setBar(p) { if (bar) bar.style.width = p + "%"; }

    function startVideo() {
        if (!vid) return;
        try {
            vid.muted = true;
            vid.loop = true;
        } catch (e) {}
        var p = null;
        try { p = vid.play(); } catch (e) {}
        if (p && p.then) {
            p.then(function () {
                if (tapHint) tapHint.hidden = true;
            }).catch(function () {
                if (tapHint) tapHint.hidden = false;
            });
        }
    }

    if (vid) {
        vid.addEventListener("ended", function () {
            try { vid.currentTime = 0; vid.play(); } catch (e) {}
        }, false);
        vid.addEventListener("playing", function () {
            if (tapHint) tapHint.hidden = true;
        }, false);
        vid.addEventListener("canplay", startVideo, false);
        vid.addEventListener("error", function () {
            try { vid.style.display = "none"; } catch (e) {}
        }, false);

        startVideo();
        setTimeout(function () {
            if (vid && vid.paused && tapHint) tapHint.hidden = false;
        }, 2200);

        var kick = function () {
            startVideo();
            document.removeEventListener("click", kick, false);
            document.removeEventListener("touchstart", kick, false);
            document.removeEventListener("keydown", kick, false);
        };
        document.addEventListener("click", kick, false);
        document.addEventListener("touchstart", kick, false);
        document.addEventListener("keydown", kick, false);
        document.addEventListener("visibilitychange", function () {
            if (!document.hidden) startVideo();
        }, false);
    }

    if (reload) {
        reload.addEventListener("click", function () {
            location.reload();
        }, false);
    }

    function leave() {
        if (leaving) return;
        leaving = true;
        location.href = "index.html";
    }

    function done(text) {
        if (wrap) wrap.hidden = false;
        setBar(100);
        say(text);
        setTimeout(leave, 1600);
    }

    function fail(text) {
        say(text);
    }

    var ac = window.applicationCache;
    if (!ac) {
        fail("This browser does not support the offline cache. Press Reload to try again.");
        return;
    }

    if (wrap) wrap.hidden = false;
    setBar(0);
    say("Checking offline cache&hellip;");

    ac.addEventListener("checking", function () {
        say("Checking offline cache&hellip;");
    }, false);

    ac.addEventListener("downloading", function () {
        say("Downloading offline files&hellip;");
    }, false);

    ac.addEventListener("progress", function (e) {
        if (e && e.total) {
            var p = Math.round((e.loaded / e.total) * 100);
            setBar(p);
            say("Installing offline cache: " + p + "%");
        } else {
            say("Installing offline cache&hellip;");
        }
    }, false);

    ac.addEventListener("cached", function () {
        done("Offline cache installed. Starting&hellip;");
    }, false);

    ac.addEventListener("updateready", function () {
        try { ac.swapCache(); } catch (e) {}
        done("Offline cache updated. Starting&hellip;");
    }, false);

    ac.addEventListener("noupdate", function () {
        done("Offline cache is ready. Starting&hellip;");
    }, false);

    ac.addEventListener("error", function () {
        fail("Cache error &mdash; check the connection, then press Reload.");
    }, false);

    try {
        ac.update();
    } catch (e) {}
})();
