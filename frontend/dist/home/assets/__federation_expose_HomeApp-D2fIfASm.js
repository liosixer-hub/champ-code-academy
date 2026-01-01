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

                function __federation_method_getRemote(remoteName, componentName) {
                    return __federation_method_ensure(remoteName).then((remote) => remote.get(componentName).then(factory => factory()));
                }

const {jsx,jsxs} = await importShared('react/jsx-runtime');

const __federation_var_sharedstore = await __federation_method_getRemote("shared" , "./store");
 let {useAppStore} = __federation_var_sharedstore;
function HomeApp({ onBackClick }) {
  useAppStore();
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Home" }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-6", children: /* @__PURE__ */ jsx("p", { className: "text-center text-gray-600", children: "This is the home application. Start building your features here." }) })
  ] }) });
}

export { HomeApp as default };
