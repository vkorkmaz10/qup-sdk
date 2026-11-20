# Qup setup (Enterprise plan)

This file is for the developer of an organisation adding Qup to its own app, and for that developer's AI assistant. It is the same for every organisation on the Enterprise plan. Turkish version: KURULUM.md. This file, the technical guide (`llms.txt`) and the SDK itself are in the same public repository: https://github.com/vkorkmaz10/qup-sdk (copies at qupin.app/setup.md, /kurulum.md, /llms.txt).

The developer gives the assistant just this:

> Read SETUP.md in the https://github.com/vkorkmaz10/qup-sdk repository and set up Qup in this project following its steps.

---

## Work order for the assistant

1. **Read the project's own rules** (`CLAUDE.md`, `AGENTS.md`, `README` and similar). They come before this file. If one of them conflicts with this file, ask the project owner and record the decision in the project's decision log.
2. **Read the technical guide:** `llms.txt` in the same repository (clone it or read it on GitHub; once the package is installed it is also at `node_modules/@qupin/react-native/llms.txt`). Not being able to reach `qupin.app` is not a blocker; everything is on GitHub. Every endpoint, card format, screen, error code and the test checklist are there.
3. **Choose the path:**
   - React Native / Expo project → **path A**: the Qup SDK, in the organisation's own theme and components.
   - Anything else → **path B**: the embedded page (iframe or WebView).
4. **Build:** the server first (member card, staff card, event management), then the app (attendee, moderation, stage screens).
5. **Run the test checklist** at the end of the guide. If your environment cannot reach `qupin.app`, leave the live steps to the project owner (on a phone or the deployed site) and note it in the feedback file.
6. **Fill in the feedback file** (below). This step is required.

## What to ask the project owner for

- **The organisation key:** the owner creates it in the Qup panel (Account › Enterprise integration) and **enters it themselves** into the server's secret settings as `QUP_SECRET`.
  - Never ask for the key in chat. If it is pasted to you, do not use it; tell the owner to create a new one.
  - If it is not set yet, tell the owner where to create it and where to enter it. Keep writing the code meanwhile; the tests that need the key wait.
- **Moderators are not needed for setup; do not ask about them.** The owner can give someone the Moderator or Manager role at any time, also after setup, in the Qup panel (Account › Team): they send the person an invitation link and the person accepts it by signing in to Qup once. Qup matches by the e-mail of that Qup account, so it has to be the same e-mail your app has verified for the person (this also applies to the owner's own account). Your code only sends the verified e-mail of the person opening the moderation screen to Qup in the staff card; if the e-mail is in the team, Qup applies the role, otherwise the screen says they have no access. Do not keep a separate permission list in the app.
- **App link:** the address the QR on the stage screen opens: a link that opens the app on that event's attendee screen (a universal link or app link). Propose the format; the owner approves it.
- **Where event codes live:** agree with the owner which record in the organisation's database holds each event code, and which screen of the app opens it.

## Connection rule

- The organisation key and card signing stay on the organisation's server only. The key never goes into the app, a web page or a repository.
- The live stream (questions, votes, polls) comes over a persistent connection (WebSocket) that the app opens directly to `qupin.app`. It **cannot be routed** through the organisation's server: serverless hosting (such as Vercel) cannot hold a persistent connection, and if it could, it would cost money all the time.
- The rule may be worded differently. These all count: "the phone never calls an upstream source directly", "data always comes from our own server", "all third-party calls go through our backend", "no direct calls to external APIs from the client".
- If the project has no rule like "the app never connects to outside services directly", this point does not concern you; ask nothing.
- If it has one, do not break it on your own. Ask the project owner **exactly** this (do not guess the answer):

  > Qup's live Q&A screen connects from the app directly to qupin.app (the way ready-made services such as Firebase do). The connection does not pass through your server and adds no cost there. What goes to Qup: the member's display name, their profile photo address, the questions they ask and their votes. Your member id becomes an id in Qup that cannot be turned back. The phone and the web build use the same connection. Do you allow an exception to "the app never connects to outside services directly" for this one connection only?

  - **If yes:** record the decision in the project's decision log (only `qupin.app`, only while Qup screens are open; the rule stays for everything else) and continue.
  - **If no:** stop the setup and write the situation into the feedback file. Do not try to route the connection through the server.
- The embedded page (path B) also connects to `qupin.app`, just inside a web view.

## Do not

- If the project already has a similar feature (for example an older Q&A module), do not remove or change it unless the owner explicitly asks. Replacing it is a separate decision.
- Do not re-implement Qup's rules in the app (sorting, limits, who may vote). Use the SDK's screens or helpers.
- Commit, push and release follow the project's own rules. If there are none, ask the owner first.

## Feedback (required)

Keep `QUP-GERI-BILDIRIM.md` in the root of the project, in Turkish, and update it while you work, not only at the end. Write in it:

- every place you got stuck,
- everything missing, wrong or unclear in this file or the guide,
- every error,
- every workaround.

If everything worked, say so too. The owner sends the file to the Qup team; we improve the SDK and the guide from it. Use the layout in KURULUM.md ("Geri bildirim") or the "Feedback" section of llms.txt.
