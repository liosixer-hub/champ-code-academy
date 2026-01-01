import { importShared } from './__federation_fn_import-DUVrMs8x.js';
import Button from './__federation_expose_Button-BX1kaGVJ.js';
import Header from './__federation_expose_Header-CN5wgNTM.js';
import { useAppStore } from './__federation_expose_Store-Dnu8MyTI.js';

const {jsx,jsxs} = await importShared('react/jsx-runtime');
function SharedApp() {
  const { user, isAuthenticated, setUser, logout } = useAppStore();
  const handleLoginDemo = () => {
    setUser({ name: "Demo User", email: "demo@example.com" });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-100", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 sm:px-0", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Shared Components Demo" }),
      /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg mb-6", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Button Component" }),
        /* @__PURE__ */ jsx(Button, { onClick: () => alert("Button clicked!"), children: "Click Me" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg mb-6", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "Store Demo" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mb-4", children: [
          "Authentication Status: ",
          isAuthenticated ? "Logged In" : "Not Logged In"
        ] }),
        user && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-900", children: [
            "Name: ",
            user.name
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-900", children: [
            "Email: ",
            user.email
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-x-2", children: [
          /* @__PURE__ */ jsx(Button, { onClick: handleLoginDemo, children: "Demo Login" }),
          /* @__PURE__ */ jsx(Button, { onClick: logout, children: "Logout" })
        ] })
      ] }) })
    ] }) })
  ] });
}

export { SharedApp as default };
