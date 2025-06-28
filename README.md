# bokx

**Version:** 1.0.0  
**Author:** [Aashutosh Uikey](https://github.com/aashureal)  
**License:** MIT  
**NPM:** [bokx on npm](https://www.npmjs.com/package/bokx)

---

## ✨ What is bokx?

`bokx` is a **meta-framework** for building modular, plugin-friendly JavaScript libraries. It offers:

- ✅ Scoped modules (no globals unless you choose)
- 🔌 Plugin support with lifecycle hooks
- 💉 Dependency injection between modules
- 🧩 Middleware for method interception
- 🌍 Optional global exposure with versioning
- ⚡ Lightweight and framework-agnostic

---

## 🚀 Installation

### Using npm

```bash
npm install bokx
```

```js
import bokx from 'bokx';
```

### Using CDN (via unpkg)

```html
<script src="https://unpkg.com/bokx/dist/bokx.umd.js"></script>
<script>
  const math = bokx.create({
    name: 'math',
    methods: {
      add: (a, b) => a + b,
    },
  });
  console.log(math.add(2, 3));
</script>
```

---

## 📦 Features

### ✅ `bokx.create(config)`
Creates a new isolated module.

**Config fields:**

| Field            | Type               | Required | Description                                   |
|------------------|--------------------|----------|-----------------------------------------------|
| `name`           | `string`           | ✅       | Module name                                   |
| `namespace`      | `string`           | ❌       | Optional grouping namespace                   |
| `version`        | `string`           | ❌       | Semantic version                              |
| `methods`        | `object` or `fn`   | ✅       | Methods directly or via a factory             |
| `inject`         | `string[]`         | ❌       | Other bokx module names to inject             |
| `middlewares`    | `function[]`       | ❌       | Middleware functions called before methods    |
| `attachToGlobal` | `boolean`          | ❌       | Expose on global window/globalThis if true   |

---

### ✅ `bokx.use(name, pluginFn)`
Registers a global plugin that applies to all future modules.

```js
bokx.use("logger", (module, meta) => {
  console.log(`Module created: ${meta.name}`);
});
```

---

### ✅ Middleware Example
Intercept method calls before execution.

```js
const logger = ({ method, args, meta }) => {
  console.log(`[${meta.name}] ${method} called with`, args);
};

bokx.create({
  name: "math",
  methods: {
    add: (a, b) => a + b,
  },
  middlewares: [logger],
});
```

---

### ✅ Dependency Injection Example

```js
// Module A
bokx.create({
  name: "config",
  methods: { base: () => 10 }
});

// Module B depends on A
bokx.create({
  name: "math",
  inject: ["config"],
  methods: ({ config }) => ({
    scale: (x) => x * config.base()
  })
});

console.log(math.scale(5)); // 50
```

---

## 🔧 Folder Structure

```
bokx/
├── src/               # Source code
│   └── index.js
├── dist/              # Bundled output
│   └── bokx.umd.js
│   └── bokx.esm.js
├── package.json
├── rollup.config.js
└── README.md
```

---

## 📄 License

MIT © Aashutosh Uikey

<!-- ---

## 🙋 Feedback or Questions?

- Open an issue: [GitHub Issues](https://github.com/aashureal/bokx/issues)
- Reach out on social or contribute directly! -->
