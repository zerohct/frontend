const fs = require("fs");
const path = require("path");

const files = [
  "src/api/auth.ts",
  "src/api/events.ts",
  "src/components/Button/Button.tsx",
  "src/components/Button/Button.module.css",
  "src/components/Header/Header.tsx",
  "src/components/Header/Header.module.css",
  "src/components/Modal/Modal.tsx",
  "src/components/Modal/Modal.module.css",
  "src/constants/apiEndpoints.ts",
  "src/constants/routes.ts",
  "src/constants/roles.ts",
  "src/hooks/useAuth.ts",
  "src/hooks/useFetch.ts",
  "src/hooks/useEvent.ts",
  "src/layouts/AdminLayout/AdminLayout.tsx",
  "src/layouts/AdminLayout/AdminLayout.module.css",
  "src/layouts/UserLayout/UserLayout.tsx",
  "src/layouts/UserLayout/UserLayout.module.css",
  "src/pages/Home/Home.tsx",
  "src/pages/Home/Home.module.css",
  "src/pages/Login/Login.tsx",
  "src/pages/Login/Login.module.css",
  "src/pages/EventDetail/EventDetail.tsx",
  "src/pages/EventDetail/EventDetail.module.css",
  "src/pages/AdminDashboard/AdminDashboard.tsx",
  "src/pages/AdminDashboard/AdminDashboard.module.css",
  "src/routes/AppRoutes.tsx",
  "src/routes/ProtectedRoute.tsx",
  "src/styles/variables.css",
  "src/styles/global.css",
  "src/types/auth.d.ts",
  "src/types/event.d.ts",
  "src/types/index.d.ts",
  "src/utils/formatDate.ts",
  "src/utils/validateInput.ts",
  "src/utils/storage.ts",
  "src/App.tsx",
  "src/index.tsx",
];

files.forEach((file) => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "");
    console.log(`Created: ${file}`);
  }
});
