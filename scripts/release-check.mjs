import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

if (process.env.LESSMARK_RELEASE_ALLOW_DIRTY !== "1") {
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
  ["cargo", ["package", "--manifest-path", "crates/lessmark/Cargo.toml"]],
  ["python", ["-m", "build", "--sdist", "--wheel", "packages/python"]],
  ["npm", ["ci"], { cwd: join(root, "site") }],
  ["npm", ["audit", "--omit=dev"], { cwd: join(root, "site") }],
  ["npm", ["run", "build"], { cwd: join(root, "site") }],
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
