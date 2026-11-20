/* PS4 GoldHen - offline cache installer shared by cache*.html */
(function () {
    "use strict";

    var msgs = document.getElementById("msgs");
    var bar = document.getElementById("bar");
    var wrap = document.getElementById("barWrap");
    var cont = document.getElementById("continue");
    var vid = document.getElementById("bgVideo");
    var bgBtn = document.getElementById("bgBtn");

    function say(html) { if (msgs) msgs.innerHTML = html; }
    function setBar(p) { if (bar) bar.style.width = p + "%"; }

    function done(text) {
        if (wrap) wrap.hidden = false;
        setBar(100);
        say(text);
        if (cont) cont.hidden = false;
        document.body.classList.remove("running");
    }

    function fail(text) {
        say(text);
    }

    function tryPlay() {
        if (!vid) return;
        vid.muted = true;
        var p = vid.play();
        if (p && p.then) {
            p.then(function () { if (bgBtn) bgBtn.hidden = true; })
             .catch(function () { if (bgBtn) bgBtn.hidden = false; });
        }
    }

    if (vid) {
        vid.addEventListener("ended", function () {
            try { vid.currentTime = 0; vid.play(); } catch (e) {}
        });
        vid.addEventListener("error", function () {
            try { vid.style.display = "none"; } catch (e) {}
        });
        tryPlay();
    }

    if (bgBtn) {
        bgBtn.addEventListener("click", function () {
            if (!vid) return;
            vid.play();
            bgBtn.hidden = true;
        });
    }

    if (cont) {
        cont.addEventListener("click", function () {
            location.href = "index.html";
        });
    }

    var ac = window.applicationCache;
    if (!ac) {
        if (cont) cont.hidden = false;
        fail("This browser does not support offline cache installation. You can still use the host while online.");
        return;
    }

    if (wrap) wrap.hidden = false;
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
        done("Offline cache installed successfully.");
    }, false);

    ac.addEventListener("updateready", function () {
        try { ac.swapCache(); } catch (e) {}
        done("Offline cache updated successfully.");
    }, false);

    ac.addEventListener("noupdate", function () {
        done("Offline cache is already installed.");
    }, false);

    ac.addEventListener("error", function () {
        fail("Cache error &mdash; clear the browser data, then open this page again.");
    }, false);

    try {
        if (ac.status === ac.UNCACHED) ac.update();
    } catch (e) {}
})();
