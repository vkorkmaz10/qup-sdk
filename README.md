# @qupin/react-native

Qup live Q&A and polls inside your own React Native / Expo app (and its web build), dressed in your own theme and components.

**Start here:** [`KURULUM.md`](KURULUM.md) (Türkçe) or [`SETUP.md`](SETUP.md) (English) gives the work order for you and your AI coding assistant. The full technical guide, including your server side (organisation key, member and staff cards, management API), is [`llms.txt`](llms.txt). Everything is in this repository, so an assistant that can reach GitHub needs no other access.

## Install

```bash
npm install github:vkorkmaz10/qup-sdk#v0.1.4      # or: bun add github:vkorkmaz10/qup-sdk#v0.1.4
npx expo install @react-native-async-storage/async-storage react-native-svg
```

## Three screens

```tsx
import { QupModeration, QupRoom, QupStage, useQupModeration, useQupRoom, useQupStage } from '@qupin/react-native';

// Attendee: your server signs a member card for the signed-in user.
const room = useQupRoom({ code, getCard: () => myApi.memberCard(code), active: isFocused });
<QupRoom room={room} theme={theme} ui={{ Card: MyCard }} onBack={goBack} />;

// Moderation (your admin area): your server signs a staff card with the person's verified e-mail.
const mod = useQupModeration({ code, getStaffCard: () => myApi.staffCard(code), active: isFocused });
<QupModeration room={mod} theme={theme} onOpenStage={openStage} />;

// Stage (big screen in the hall): watches only, no card.
const stage = useQupStage({ code });
<QupStage room={stage} theme={theme} logo={require('./logo.png')} joinUrl={(c) => `https://your.app/qup/${c}`} />;
```

- `theme`: colours, radius, font (`QupTheme`). `ui`: your own `Card`, `Button`, `Avatar` (and `VoteButton`, best left as Qup's).
- `lang`: `'tr'` or `'en'`; `strings` overrides single texts.
- Lower level for fully custom screens: `useQupConnection`, `useQuestionList`, `useComposer`, `questionsFor`, `activePoll`, `canVote`, `canReport`.

See `ornek/KoyuTema.tsx` for a complete dark-themed example of all three screens.

## Updating

When Qup improves a screen, a new version is tagged in this repository (`v0.1.4`, …). Install the new tag the same way; apps that use the templates need no code change.
