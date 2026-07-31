import { REPO_OWNER, REPO_NAME, REPO_BRANCH } from "../config.js";

const LIST_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/content/tablets?ref=${REPO_BRANCH}`;

function rawUrl(filename) {
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/content/tablets/${filename}`;
}

// Every Tablet in the repo, in one array. Used to populate each hall's list.
export async function listTablets() {
  const res = await fetch(LIST_URL);
  if (!res.ok) throw new Error(`Could not list Tablets (status ${res.status})`);
  const files = (await res.json()).filter((f) => f.name.endsWith(".json"));

  const tablets = await Promise.all(
    files.map(async (file) => {
      const tablet = await (await fetch(rawUrl(file.name))).json();
      return { ...tablet, slug: file.name.replace(/\.json$/, "") };
    })
  );

  return tablets;
}

// A single Tablet by its filename (without .json), for the Tablet page.
export async function getTablet(slug) {
  const res = await fetch(rawUrl(`${slug}.json`));
  if (!res.ok) throw new Error(`Tablet not found (status ${res.status})`);
  return res.json();
}
