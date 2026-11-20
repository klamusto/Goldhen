# PS4 GoldHen

A complete PlayStation 4 exploit host built from the open-source GoldHEN host chain,
re-skinned by **Abdellah (@klamust)**.

- Firmwares: `5.05` `5.07` `7.00 - 8.52` `9.00 - 9.60` `10.00 - 11.02` `11.50 - 14.02`
- Auto firmware detection, automatic exploit selection
- Offline cache (ApplicationCache) so the console runs without internet after the first install
- Looping animated background (`media/background.mp4`)

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | Main host: detects firmware, installs cache or runs the exploit |
| `cache*.html` | Offline-cache installers per firmware family |
| `fw505/`, `700/`, `900/`, `css/`, `slopkit/` | Exploit sources |
| `505.manifest` … `slopkit.manifest` | ApplicationCache manifests |
| `media/` | Background video + poster |
| `style.css` | Shared theme |
| `vercel.json` | Correct `text/cache-manifest` MIME + cache headers |

The old single-firmware hosts (`505/`, `672/`, `672goldhen/`, `900goldhen/`, `900v3/`, `restore/`)
are kept and share the new theme.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New… → Project → Import** the repository.
3. Framework preset: **Other**. Root directory: `./`. Build command: none. Output directory: `./`.
4. Deploy.

`vercel.json` already makes Vercel serve `*.manifest` as `text/cache-manifest`, which the PS4
browser needs for the offline cache to install.

## Use on the console

1. Open the deployed URL in the PS4 web browser.
2. First visit: the matching cache page installs all files. Keep it open until it finishes.
3. Close the browser, reopen it — the console can now run GoldHEN without internet.
   The "Resume wallpaper" button restarts the background video after the exploit runs.

## Credits

- Host chain and payloads: the PS4 homebrew scene (GoldHEN, psfree, lapse, slopkit and contributors).
- Interface, branding and offline packaging: **Abdellah — @klamust**.
- Live wallpaper source: MoeWalls ("Sasuke X Aoda"). Replace `media/background.mp4` if you
  want a different animation.
