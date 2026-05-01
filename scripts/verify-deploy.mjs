const baseUrl = process.env.DEPLOY_URL;
const password = process.env.APP_PASSWORD;

if (!baseUrl) {
  console.error("DEPLOY_URL is required");
  process.exit(1);
}

async function fetchWithCookies(url, init = {}) {
  return fetch(url, {
    redirect: "manual",
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers || {}),
    },
  });
}

async function main() {
  const loginPage = await fetchWithCookies(`${baseUrl}/login`);
  if (loginPage.status !== 200) {
    throw new Error(`/login returned ${loginPage.status}`);
  }

  let cookieHeader = "";
  if (password) {
    const login = await fetchWithCookies(`${baseUrl}/api/login`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (login.status !== 200) {
      throw new Error(`/api/login returned ${login.status}`);
    }

    const setCookie = login.headers.get("set-cookie");
    if (!setCookie || !setCookie.includes("sync-deck-auth=")) {
      throw new Error("Login did not return auth cookie");
    }
    cookieHeader = setCookie.split(";")[0];
  }

  const checks = ["/", "/login", "/api/health"];
  for (const route of checks) {
    const response = await fetchWithCookies(`${baseUrl}${route}`, {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    });

    if (response.status !== 200) {
      throw new Error(`${route} returned ${response.status}`);
    }

    if (route === "/" && password) {
      const body = await response.text();
      if (!body.includes("Sync Deck") || !body.includes("Needs David") || !body.includes("Needs Albert")) {
        throw new Error("Home page is up but missing expected Sync Deck UI");
      }
    }

    console.log(`ok ${route} -> ${response.status}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
