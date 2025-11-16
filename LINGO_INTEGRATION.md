# Lingo.dev Integration Guide

## Overview

GlobeSoS integrates Lingo.dev for comprehensive multilingual support, real-time translation, and AI-powered emergency classification across the platform.

## Setup

### Environment Variables

Add the following to your `.env.local`:

```bash
LINGO_API_KEY=your_lingo_api_key_here
NEXT_PUBLIC_LINGO_API_KEY=your_lingo_api_key_here
```

### Configuration

The `.lingorc` file contains:

```json
{
  "locales": ["en", "es", "fr", "de", "hi", "zh", "ja", "ru", "ar"],
  "defaultLocale": "en",
  "apiKey": "${LINGO_API_KEY}",
  "fallbackLocale": "en",
  "cache": {
    "enabled": true,
    "ttl": 3600000
  },
  "nlp": {
    "intentClasses": ["fire", "medical", "disaster", "security", "general"]
  }
}
```

### Dependencies

```bash
npm install @lingo/dev @lingo/react
```

## Frontend Integration

### Translation Hook

Use the `useTranslation` hook for UI translations:

```tsx
import { useTranslation } from '@/hooks/useTranslation'

function MyComponent() {
  const { t, currentLang, changeLanguage } = useTranslation()

  return (
    <div>
      <p>{t('Welcome to GlobeSoS')}</p>
      <select value={currentLang} onChange={(e) => changeLanguage(e.target.value)}>
        {/* language options */}
      </select>
    </div>
  )
}
```

### Language Detection

Automatic language detection for user inputs:

```tsx
const { detectLanguage } = useTranslation()

const handleUserInput = async (text: string) => {
  const lang = await detectLanguage(text)
  // Process based on detected language
}
```

## Backend Integration

### Translation API

POST `/api/ai/translate`

```json
{
  "text": "Help! There's a fire!",
  "targetLang": "es",
  "sourceLang": "en"
}
```

Response:

```json
{
  "originalText": "Help! There's a fire!",
  "translatedText": "¡Ayuda! ¡Hay un incendio!",
  "sourceLang": "en",
  "targetLang": "es",
  "confidence": 0.95
}
```

### Classification API

POST `/api/ai/classify`

```json
{
  "message": "There's a fire in the building!"
}
```

Response:

```json
{
  "type": "fire",
  "severity": "high",
  "keywords": ["fire", "building"]
}
```

### Alert Processing

Alerts are automatically processed with:

- Language detection
- Translation to English for storage
- Emergency classification
- Metadata storage with `language_code`

## Chat Integration

Real-time chat messages are translated between users:

```tsx
// In chat interface
const translatedMessage = await translate(message, targetLang)
```

## Admin Dashboard

### Translation Logs

View translation history and accuracy metrics.

### Verification Tools

Manually verify and flag inaccurate translations.

### Statistics

- Most used languages
- Translation latency
- Success rates

## Performance

- Translation requests: < 500ms average
- Local caching reduces API calls
- Fallback to original text on failures

## Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Hindi (hi)
- Chinese (zh)
- Japanese (ja)
- Russian (ru)
- Arabic (ar)

## Error Handling

- Exponential backoff for failed requests
- Fallback to original text
- Logging of translation failures

## Testing

Run localization tests:

```bash
npm run test:localization
```

Test multilingual conversations by switching languages in the UI.