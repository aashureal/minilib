// src/index.js
/**
 * bokx v2.0 - A Meta-Framework for Building Modular, Scalable JS Libraries
 * Features:
 *  - Scoped modules (no global by default)
 *  - Plugin system with lifecycle hooks
 *  - Dependency Injection
 *  - Middleware support (pre-method hooks)
 *  - Optional global attachment with versioning & namespaces
 */

const bokx = (() => {
  // Internal plugin registry
  const _plugins = [];

  /**
   * Register a global plugin for bokx modules
   * @param {string} name - Plugin name
   * @param {Function} pluginFn - Receives (module, metadata) => void
   */
  function use(name, pluginFn) {
    if (typeof name !== "string" || typeof pluginFn !== "function") {
      throw new Error("bokx.use: expected (name: string, pluginFn: Function)");
    }
    _plugins.push({ name, pluginFn });
  }

  /**
   * Create or initialize a bokx module
   * @param {Object} config
   * @param {string} config.name - Module name
   * @param {string} [config.namespace] - Optional namespace
   * @param {string} [config.version] - Optional version
   * @param {string[]} [config.inject] - Dependencies by name
   * @param {Function|Object} config.methods - Methods map or factory(deps)
   * @param {Function[]} [config.middlewares] - Pre-method middleware array
   * @param {boolean} [config.attachToGlobal=false] - Attach module globally
   * @returns {Object} module API
   */
  function create(config) {
    // Basic validation
    if (!config || typeof config.name !== "string") {
      throw new Error("bokx.create: `name` (string) is required.");
    }
    const {
      name,
      namespace,
      version,
      inject = [],
      methods,
      middlewares = [],
      attachToGlobal = false,
    } = config;

    // Prevent global conflicts if attaching
    if (attachToGlobal) {
      const globalObj = typeof window !== "undefined" ? window : global;
      if (globalObj[name]) {
        throw new Error(`bokx.create: Global name "${name}" already exists.`);
      }
    }

    // Resolve dependencies
    const deps = {};
    inject.forEach((depName) => {
      if (!bokx._modules[depName]) {
        throw new Error(`bokx.create: Dependency "${depName}" not found.`);
      }
      deps[depName] = bokx._modules[depName];
    });

    // Build method map
    let api = {};
    if (typeof methods === "function") {
      api = methods(deps);
    } else if (typeof methods === "object") {
      api = { ...methods };
    } else {
      throw new Error(
        "bokx.create: `methods` must be an object or factory function"
      );
    }

    // Attach metadata
    const metadata = { name, namespace, version };
    api._meta = metadata;

    // Apply plugins
    _plugins.forEach(({ pluginFn }) => pluginFn(api, metadata));

    // Wrap with middlewares only if defined
    if (middlewares.length > 0) {
      Object.keys(api).forEach((key) => {
        if (key === "_meta") return;
        const fn = api[key];
        if (typeof fn === "function") {
          api[key] = async function (...args) {
            for (const mw of middlewares) {
              await mw({ method: key, args, meta: metadata });
            }
            return fn.apply(this, args);
          };
        }
      });
    }

    // Cache module
    bokx._modules[name] = api;

    // Attach globally if needed
    if (attachToGlobal) {
      const globalObj = typeof window !== "undefined" ? window : global;
      globalObj[name] = api;
    }

    return api;
  }

  /**
   * Internal storage of created modules
   */
  const _modules = Object.create(null);

  return {
    use,
    create,
    _modules,
  };
})();

export default bokx;
