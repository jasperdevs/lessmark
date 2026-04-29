import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";

const root = process.cwd();
const allowDirty = process.env.LESSMARK_RELEASE_ALLOW_DIRTY === "1";

if (!allowDirty) {
  const status = spawnSync("git", ["status", "--short"], { cwd: root, encoding: "utf8" });
  if (status.status !== 0) {
    process.stderr.write(status.stderr || "git status failed\n");
    process.exit(status.status ?? 1);
  }
  if (status.stdout.trim() !== "") {
    console.error("release check requires a clean git tree; set LESSMARK_RELEASE_ALLOW_DIRTY=1 for local rehearsal");
    process.exit(1);
  }
}

const commands = [
  ["npm", ["run", "check"]],
  ["npm", ["audit", "--omit=dev"]],
  ["npm", ["pack", "--workspace", "lessmark", "--dry-run"]],
  ["cargo", ["package", "--manifest-path", "crates/lessmark/Cargo.toml", ...(allowDirty ? ["--allow-dirty"] : [])]],
  ["python", ["-m", "build", "--sdist", "--wheel", "packages/python"]],
  ["site-clean-install", []],
  ["npx", ["--yes", "@vscode/vsce", "package"], { cwd: join(root, "editors/vscode") }],
];

function quoteCmd(value) {
  return /[\s"]/u.test(value) ? `"${value.replaceAll('"', '\\"')}"` : value;
}

function run(command, args, options = {}) {
  console.log(`\n$ ${[command, ...args].join(" ")}`);
  const commandArgs = process.platform === "win32"
    ? ["/d", "/s", "/c", [command, ...args].map(quoteCmd).join(" ")]
    : args;
  const result = spawnSync(process.platform === "win32" ? process.env.ComSpec || "cmd.exe" : command, commandArgs, {
    cwd: options.cwd ?? root,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

for (const [command, args, options] of commands) {
  if (command === "site-clean-install") {
    verifySiteCleanInstall();
    continue;
  }
  run(command, args, options);
}

for (const path of [
  "packages/python/build",
  "packages/python/dist",
  "site/dist",
]) {
  const absolute = join(root, path);
  if (existsSync(absolute)) {
    console.log(`kept generated output for inspection: ${path}`);
  }
}

console.log("\nrelease check ok: packages build, audits pass, site builds, and VSIX packages");

function verifySiteCleanInstall() {
  const tempRoot = mkdtempSync(join(tmpdir(), "lessmark-site-ci-"));
  try {
    console.log("\n$ npm ci --ignore-scripts (isolated site copy)");
    copyForCleanInstall("site", tempRoot);
    copyForCleanInstall(join("packages", "lessmark"), tempRoot);
    const siteRoot = join(tempRoot, "site");
    run("npm", ["ci", "--ignore-scripts"], { cwd: siteRoot });
    run("npm", ["audit", "--omit=dev"], { cwd: siteRoot });
    run("npm", ["run", "build"], { cwd: siteRoot });
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function copyForCleanInstall(relativePath, tempRoot) {
  const source = join(root, relativePath);
  const target = join(tempRoot, relativePath);
  const blocked = [
    join(root, "site", "node_modules"),
    join(root, "site", "dist"),
    join(root, "packages", "lessmark", "node_modules")
  ];
  cpSync(source, target, {
    recursive: true,
    filter: (path) => !blocked.some((blockedPath) => path === blockedPath || path.startsWith(`${blockedPath}${sep}`))
  });
}
