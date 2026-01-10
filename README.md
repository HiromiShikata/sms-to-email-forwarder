# SMS to Email Forwarder

Android application that forwards received SMS messages to a specified email address via Gmail SMTP.

## Features

- Listens for incoming SMS messages in background
- Forwards SMS content to a specified email address via Gmail SMTP
- Simple configuration UI for email settings
- Built with React Native + TypeScript following DDD and Clean Architecture principles

## Prerequisites

- Node.js >= 20
- Android SDK
- Gmail account with App Password enabled

## Installation

### Using Pre-built APK (Recommended)
1. Download the latest `app-release.apk` from [GitHub Actions artifacts](https://github.com/HiromiShikata/sms-to-email-forwarder/actions)
2. Install the APK on your Android device
3. Grant SMS permissions when prompted

### Building from Source
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Build release APK:
   ```bash
   cd android && ./gradlew assembleRelease
   ```
4. Install `android/app/build/outputs/apk/release/app-release.apk` on your device

## Configuration

1. Enable 2-Step Verification on your Gmail account
2. Create a Gmail App Password at https://myaccount.google.com/apppasswords
3. Enter your Gmail address, App Password, and recipient email in the app
4. Grant SMS permissions when prompted
5. Click "Start Listening" to begin forwarding SMS messages

## Architecture

```
src/
├── domain/          # Domain layer (entities)
│   └── entities/
│       └── SmsMessage.ts
├── adapter/         # Adapter layer (infrastructure implementations)
│   ├── NativeSmsReceiverAdapter.ts
│   ├── SmtpEmailSenderAdapter.ts
│   └── AsyncStorageAdapter.ts
└── presentation/    # Presentation layer (UI)
    ├── components/
    ├── hooks/
    └── screens/
```

## Development

- Run tests: `npm test`
- Run linter: `npm run lint`
- Type check: `npm run typecheck`

## License

MIT
