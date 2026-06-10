# xBuild

Simple Node.js wrapper for MoleBuild Mobile Legends counter data.

## Installation

```bash
npm install xbuild
```

## Usage

```js
import xBuild from "xbuild";

const ml = new xBuild();

const result = await ml.counter("Zetian");

console.log(result);
```

## Search Hero

```js
const heroes = await ml.searchHero("zet");

console.log(heroes);
```

## Get Hero Counters

```js
const data = await ml.counter("Fanny");

console.log(data);
```

## Get Countered Heroes

```js
const data = await ml.counteredBy("Fanny");

console.log(data);
```

## Example Output

```json
{
  "status": true,
  "hero": "Zetian",
  "totalVotes": 61,
  "counters": [
    {
      "hero": "Kadita",
      "votes": 28
    }
  ]
}
```

## Available Data

- Hero Name
- Hero Roles
- Hero Image
- Counter Heroes
- Total Votes
- Vote Count
- Counter Reasons

## Suitable For

- WhatsApp Bots
- Telegram Bots
- Discord Bots
- Mobile Legends Websites
- CLI Tools
- Node.js Projects

## Community

Join WhatsApp Channel:

https://whatsapp.com/channel/0029VbCWwrR3gvWdm7Cizm3N

## License

MIT

## Maintainer

KYXZZ
