# OpenHire

Open-source AI interviewing platform. Self-hosted.

> ⚠️ This project is in early alpha. Expect breaking changes.

## Features

- **AI Question Generation** - paste a job description or upload a PDF and get tailored interview questions instantly
- **Voice Interviews** - candidates complete interviews via a real-time AI voice call, no human needed
- **Custom AI Interviewers** - choose from built-in interviewer personas, each with different communication styles
- **Automated Scoring** - every response is analyzed for communication skills, soft skills, and overall fit
- **Shareable Interview Links** - send candidates a one-time link, no scheduling or account required
- **Candidate Pipeline** - manage candidate status (Selected, Potential, Not Selected) from the dashboard
- **Integrity Monitoring** - detects tab switching during interviews
- **Interview Analytics** - track completion rates, sentiment distribution, and average duration per interview

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 + shadcn/ui
- Drizzle ORM + Neon (Postgres) / PostgreSQL
- Better Auth
- Retell AI
- OpenAI + LangChain

## Documentation

- [Run Locally](./docs/run-locally.md) - set up your local dev environment
- [Deploy](./docs/deploy.md) - self-host on your own server

## Contributing

All contributions are welcome. Read the [contributing guide](./CONTRIBUTING.md) before submitting a PR.

- Found a bug? [Open an issue](https://github.com/brijeshmarch16/openhire/issues)
- Have a feature idea? [Open an issue](https://github.com/brijeshmarch16/openhire/issues) first before building
- Stars are appreciated!

## License

Licensed under the [MIT license](./LICENSE).

---
Inspired by [FoloUp](https://github.com/FoloUp/FoloUp).
