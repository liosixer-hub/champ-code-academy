import { importShared } from './__federation_fn_import-DUVrMs8x.js';

const {jsx} = await importShared('react/jsx-runtime');

function Button({ children, onClick, className = "", ...props }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      className: `px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`,
      ...props,
      children
    }
  );
}

export { Button as default };
