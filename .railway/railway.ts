import { defineRailway, github, project, service } from "railway/iac";
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "web";
export default defineRailway(() => {
  const web = service("web", {
    source: github("Braden-Long/uva-cs4971-hoos-helping", {
      branch: "main",
      checkSuites: false,
    }),
    build: {
      buildEnvironment: "V3",
      builder: "DOCKERFILE",
      dockerfilePath: "Dockerfile",
    },
    // Same command as the Dockerfile CMD. It must be set here: a start command
    // stored on the service overrides CMD, and it still held the old
    // `npx next start`, which keeps ~2x the memory resident.
    start: "node .next/standalone/server.js",
    healthcheck: "/api/health",
    healthcheckTimeout: 120,
    preDeploy: "npx prisma migrate deploy",
    replicas: { "us-east4-eqdc4a": 1 },
    domains: ["hooshelping.com", "www.hooshelping.com"],
  });

  return project("hoos-helping", {
    variables: { managed: false },
    resources: [web],
  });
});
