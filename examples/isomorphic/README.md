# Isomorphic App built with Nito

An example how to build a Node.js Isomorphic App with Nito.

```
git clone https://github.com/morris/nito.git
cd nito/examples/isomorphic
npm install -g browserify
npm install
browserify src/client.js -o js/bundle.js
node src/server.js
```

Open http://localhost:3000 in browser.
