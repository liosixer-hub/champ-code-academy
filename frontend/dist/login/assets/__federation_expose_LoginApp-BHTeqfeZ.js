import { importShared } from './__federation_fn_import--c_ssHJ1.js';

const remotesMap = {
'shared':{url:'http://localhost:5001/assets/remoteEntry.js',format:'esm',from:'vite'}
};
                const currentImports = {};

                function get(name, remoteFrom) {
                    return __federation_import(name).then(module => () => {
                        return module
                    })
                }
                
                function merge(obj1, obj2) {
                  const mergedObj = Object.assign(obj1, obj2);
                  for (const key of Object.keys(mergedObj)) {
                    if (typeof mergedObj[key] === 'object' && typeof obj2[key] === 'object') {
                      mergedObj[key] = merge(mergedObj[key], obj2[key]);
                    }
                  }
                  return mergedObj;
                }

                const wrapShareModule = remoteFrom => {
                  return merge({
                    'react':{'undefined':{get:()=>get(new URL('__federation_shared_react-Dl2e77_C.js', import.meta.url).href), loaded:1}},'react-dom':{'undefined':{get:()=>get(new URL('__federation_shared_react-dom-CFMRiUlt.js', import.meta.url).href), loaded:1}},'react/jsx-runtime':{'undefined':{get:()=>get(new URL('__federation_shared_react/jsx-runtime-DOkVwsuO.js', import.meta.url).href), loaded:1}},'zustand':{'undefined':{get:()=>get(new URL('__federation_shared_zustand-CtTFrDI0.js', import.meta.url).href), loaded:1}}
                  }, (globalThis.__federation_shared__ || {})['default'] || {});
                };

                async function __federation_import(name) {
                    currentImports[name] ??= import(name);
                    return currentImports[name]
                }

                async function __federation_method_ensure(remoteId) {
                    const remote = remotesMap[remoteId];
                    if (!remote.inited) {
                        if (['esm', 'systemjs'].includes(remote.format)) {
                            // loading js with import(...)
                            return new Promise((resolve, reject) => {
                                const getUrl = () => Promise.resolve(remote.url);
                                getUrl().then(url => {
                                    import(/* @vite-ignore */ url).then(lib => {
                                        if (!remote.inited) {
                                            const shareScope = wrapShareModule();
                                            lib.init(shareScope);
                                            remote.lib = lib;
                                            remote.lib.init(shareScope);
                                            remote.inited = true;
                                        }
                                        resolve(remote.lib);
                                    }).catch(reject);
                                });
                            })
                        }
                    } else {
                        return remote.lib;
                    }
                }

                function __federation_method_unwrapDefault(module) {
                    return (module?.__esModule || module?.[Symbol.toStringTag] === 'Module') ? module.default : module
                }

                function __federation_method_getRemote(remoteName, componentName) {
                    return __federation_method_ensure(remoteName).then((remote) => remote.get(componentName).then(factory => factory()));
                }

const {jsx,jsxs} = await importShared('react/jsx-runtime');

const {useState} = await importShared('react');

const __federation_var_sharedstore = await __federation_method_getRemote("shared" , "./store");
 let {useAppStore} = __federation_var_sharedstore;
const __federation_var_sharedButton = await __federation_method_getRemote("shared" , "./Button");
 let Button = __federation_method_unwrapDefault(__federation_var_sharedButton); 
function LoginApp({ onBackClick }) {
  const storeState = useAppStore();
  const setUser = storeState.setUser || (() => {
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const user = await response.json();
        setUser(user);
      } else {
        setError("Invalid credentials");
      }
    } catch (error2) {
      console.error("Login error:", error2);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Sign in to your account" }) }),
    /* @__PURE__ */ jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleLogin, children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "sr-only", children: "Email address" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "email",
              name: "email",
              type: "email",
              required: true,
              className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
              placeholder: "Email address",
              value: email,
              onChange: (e) => setEmail(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "sr-only", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password",
              name: "password",
              type: "password",
              required: true,
              className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
              placeholder: "Password",
              value: password,
              onChange: (e) => setPassword(e.target.value)
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm", children: error }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Signing in..." : "Sign in" }),
        onBackClick && /* @__PURE__ */ jsx(Button, { onClick: onBackClick, className: "w-full", children: "Back to Home" })
      ] })
    ] })
  ] }) });
}

export { LoginApp as default };
