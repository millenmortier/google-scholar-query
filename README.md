# Google Scholar query

A tiny library to ease making requests to Google Scholar.

# Installation

```bash
npm i @millenmortier/google-scholar-query
```

## Usage

The main file exports two mechanisms:

### Promise-based

```js
import { queryAsPromise } from '@millenmortier/google-scholar-query';

(async () => {
  const results = await queryAsPromise('YOUR_GOOGLE_SCHOLAR_QUERY_HERE');
})();
```

### Event-based

```js
import { queryAsEvent } from '@millenmortier/google-scholar-query';

const emitter = queryAsEvent('YOUR_GOOGLE_SCHOLAR_QUERY_HERE');

const allData = [];
emitter.on('data', (newResults) => {
  // newResults will be a new page of articles
  allData = allData.concat(newResults);
});

emitter.on('end', () => {
  // all results have been fetched
});

emitter.on('error', (err) => {
  // An error occurred
});

emitter.on('tooManyRequests', () => {
  // Google is rate-limiting us, so it's best to try again after a while
});
```
