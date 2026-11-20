# Qup package: release notes

What changed in each version of `@qupin/react-native` and what you need to do. Written for AI coding assistants; owners can read it too. Türkçe: `DEGISIKLIKLER.md`.

**How to update:** tell your assistant:

> Read CHANGELOG.md in https://github.com/vkorkmaz10/qup-sdk and update the Qup package to the newest version.

**Rules for the assistant:**

- Read the installed version from `package.json`; apply every section after it, in order.
- Install: `npm install github:vkorkmaz10/qup-sdk#v<version>` (or the project's package manager).
- If "What you need to do" is empty, installing the package is enough; no code change.
- Items that add a screen or change visuals follow the project's own rules (draft, approval, commit permission).
- Older versions keep working. If an update ever becomes required, it is announced with a date at the top of this file.
- Server-side fixes (marked "Qup server" below) arrive by themselves; nothing to install.

## 0.1.3 (20 November 2026)

**What changed**

- Fonts by weight: `theme.fonts { regular, medium, semibold, bold }`. With fonts loaded as one family per weight (Expo Google Fonts and similar), bold text no longer falls back to the system font.
- The `QupStage` logo can be a local file: `logo={require('./assets/logo.png')}`. The same logo is drawn in the middle of the QR.
- `QupModeration` takes a new `joinUrl`: "Share" hands out your own link.
- On an expired event the stage screen says the session has ended.
- Qup server: on a closed session that has not expired, the stage screen stays up (CLOSED label and the last questions).
- Qup server: new `GET /api/v1/account` (plan, limits, brand) and `PUT /api/v1/brand` (logo and page colour). Details in `llms.txt` A1.

**What you need to do**

- If your font is loaded as one family per weight, give `fonts` in the theme instead of `fontFamily`.
- Optional: `joinUrl` on moderation, a local logo on the stage screen.
- Optional: account information and logo and colour entry in your own admin panel.

## 0.1.2 (20 November 2026)

- The package and guides install from the public GitHub repository. No code change.

## 0.1.1 (20 November 2026)

- The text shown to someone without staff rights was corrected (people join the team by invitation link). No code change.

## 0.1.0 (20 November 2026)

- First version: `QupRoom`, `QupModeration`, `QupStage`.
