# ACE Media: Photo Frenzy

A complete, browser-based Phaser 3 arcade photography game. You are ACE Media's student photographer during a fictional ACE Leadership High School passing period. Chase unpredictable moments, capture actual game scenes, and choose your three best photographs for the yearbook.

## Play in your browser

**[▶ PLAY PHOTO FRENZY](https://educatorramsey.github.io/PhotoFrenzy/)**

This is the game website; the GitHub repository holds its source code. Click **LET’S SHOOT** once the game loads. No download or account is needed.

If the website is not available yet, open [Settings → Pages](https://github.com/EducatorRamsey/PhotoFrenzy/settings/pages) and set **Source → GitHub Actions**. Then open [Actions → Publish playable game](https://github.com/EducatorRamsey/PhotoFrenzy/actions/workflows/pages.yml) and check the latest run, or choose **Run workflow → main → Run workflow**. The website becomes available after the deployment succeeds.

## Play locally

No build, account, API key, package install, or backend is required. Phaser 3.90.0 is bundled locally.

1. Download or clone this project.
2. In its folder, run `python3 -m http.server 4173` (or `npm run dev`).
3. Open **http://localhost:4173** in Chrome, Edge, or Firefox.
4. Click **LET'S SHOOT**. Sound starts with that gesture.

Use a static HTTP server: opening `index.html` as a `file://` URL can block JavaScript modules. On a Chromebook, use the hosted game or a static hosting provider; students do not need to install anything. If using school filtering, allow the hosting domain. There are no external runtime requests, fonts, image APIs, trackers, or CDNs.

## Controls

| Control | Action |
| --- | --- |
| WASD / arrows | Move |
| Mouse / trackpad | Aim the viewfinder |
| Left click / Space | Take a photo |
| I J K L / Shift + arrows | Aim with the keyboard (I/up, J/left, K/down, L/right) |
| E | Talk to nearby students or investigate a classroom, fountain, or window |
| Tab | Open / close the album during a round |
| Escape | Pause / resume / close a dialog |
| Tab / Shift+Tab / Enter | Navigate menus and select buttons |
| Sound button | Mute / unmute effects |

The camera reaches 315 game pixels from the photographer. Walk toward distant events. The player wears a yellow cap and has a **YOU** label. Menu and album screens pause the timer; switching tabs or leaving the browser window also pauses automatically.

## Hallway Havoc

- **90 seconds, 12 photographs, target 1,500 points.** The explicit level settings in the brief take priority over the general 10–15 minute attempt note. A 10–15 minute classroom session can include several rounds, album curation, and high-score attempts.
- Capture a paper airplane, synchronized jump, photobomb, spilled backpack, dance break, and rare Sasquatch.
- Yellow cues announce an event before the action. Timing and locations change on replay. The first airplane gives new players an immediate opportunity; the next four event types are shuffled so every round offers all five regular stories.
- Sasquatch may appear randomly after 20 seconds. Investigating the window also attracts one secret visitor per round. The visitor stays briefly: keep your camera ready.
- Photos are actual 3:2 crops of the Phaser canvas after rendering, saved as PNG data URLs for the current session. The viewfinder and website HUD are separate overlays and do not appear in captured images.

### Scoring

The event's animated bounds must overlap the viewfinder. A full action gets approximately 42% timing, 25% framing, 23% story, and 10% discovery points. Centering and keeping the entire subject in frame improve the result. A clipped subject earns 25 points; shooting before the action earns a modest scouting reward. Ordinary well-framed portraits earn 35. Empty frames earn zero. Repeating the same event instance earns 40% of its reward, and only the first discovery of an event type earns discovery points. For the synchronized jump, both students must be airborne.

At the editor's desk, choose three photos (or all available if you took fewer). Each successful pick earns 15% of its photo score, up to 75 points. Select the strongest shots before submitting. The summary shows your total, photos, successful shots, best shot, unique events, and secret discovery. Ratings: **Rookie Photographer**, **Hallway Reporter** (750), **Photo Pro** (1,500), **Yearbook Legend** (2,500).

The top ten personal attempts are stored in `localStorage` under `ace-photo-frenzy-scores-v1`. No pictures or student information are persisted or uploaded. Scores are specific to this browser and device; clearing browser data clears them. Restricted storage does not prevent play. Reloading clears the current album.

## Deploy to GitHub Pages

This is a static site with relative paths, so it works at both a root domain and a repository subpath. The included `.github/workflows/pages.yml` checks the game and publishes its static assets on every push to `main`.

1. Keep the project files in the repository root, including `index.html`, `src`, and `assets`.
2. Open **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. Push a commit to `main`, or open **Actions → Publish playable game → Run workflow** and select `main`.
5. Wait for the run to finish successfully, then open **https://educatorramsey.github.io/PhotoFrenzy/**. The run's `github-pages` environment also links to the deployed website.

For a copy of this repository, update the Play link to your own `https://USERNAME.github.io/REPOSITORY/` URL.

As an alternative to the workflow, select **Deploy from a branch → main → /(root) → Save** in Pages settings. The project does not require a build. The `.nojekyll` file disables Jekyll processing. Keep `assets/vendor`, which contains the local Phaser runtime. `.openai/hosting.json` is optional Sites metadata and is not needed by GitHub Pages.

## Project structure

```text
index.html                Entry point, accessible menus, HUD and dialogs
styles.css                Responsive arcade shell and photo album
src/
  levels.js               Level configuration and six event definitions
  art.js                  Original procedural pixel environment and sprites
  game.js                 Phaser scene, input, events, animation, capture
  scoring.js              Bounds-based evaluation, editor bonus and ratings
  audio.js                Original Web Audio effects
  app.js                  Menus, HUD, album, yearbook selection, local scores
assets/vendor/
  phaser.min.js           Phaser 3.90.0, bundled for offline runtime use
  PHASER-LICENSE.md       Phaser MIT license
 tests/scoring.test.js    Scoring and curation regression checks
```

Major systems are commented in source. Future levels can supply new configuration and event definitions in `levels.js`, a new environment in `art.js`, and scene event handlers in `game.js`. Additional levels are intentionally not implemented.

## Validation

Run `npm test` for scoring regressions and `npm run check` for JavaScript syntax. No project dependencies are needed. Browser QA covers startup, movement, pointer and keyboard aiming, actual image capture, all six event hit regions, album pause/resume, film and timer exhaustion, yearbook curation, score persistence, restarting, and narrow layouts.

A desktop keyboard and mouse/trackpad are the primary controls. Touch movement is not included. Phaser uses the Canvas renderer at a fixed 1000×520 game resolution with pixel rendering and lightweight generated art, intended for school Chromebooks. No camera hardware or webcam permission is requested.

## Credits and licensing

Game code, pixel art, dialogue, and synthesized effects are original to this project and released under the MIT License in `LICENSE`. Phaser is copyright Richard Davey / Photon Storm Ltd and its contributors, distributed under its included MIT license. No third-party images, music, or fonts are required. This is a fictionalized school setting.
