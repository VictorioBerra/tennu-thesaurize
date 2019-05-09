# tennu-thesaurize

A plugin for the [tennu](https://github.com/Tennu/tennu) irc framework.

Thesaurize text in previous messages.

## Examples
- 8:22 Havvy: Hello world
- 8:23 Ownix: t/world
- 8:24 Bot: Correction, <Havvy> **Hello planet**

### Configuration

```javascript
"thesaurize": {
    "lookBackLimit": 60, // memory usage caution, id keep this number reasonable.
},
```

### Installing Into Tennu

See Downloadable Plugins [here](https://tennu.github.io/plugins/).