const { execSync } = require("child_process");
const fs = require("fs");

const expectedReactVersion = "19.1.0";
const expectedReactDOMVersion = "19.1.0";

function getInstalledVersion(pkg) {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(`node_modules/${pkg}/package.json`, "utf-8")
    );
    return packageJson.version;
  } catch {
    return null;
  }
}

function installVersion(pkg, version) {
  console.log(`🔧 Instalando ${pkg}@${version}...`);
  execSync(`npm install ${pkg}@${version}`, { stdio: "inherit" });
}

console.log("🔍 Verificando versões de React e React-DOM...");

const currentReact = getInstalledVersion("react");
const currentReactDOM = getInstalledVersion("react-dom");

if (currentReact !== expectedReactVersion) {
  console.log(`React atual: ${currentReact}, esperado: ${expectedReactVersion}`);
  installVersion("react", expectedReactVersion);
} else {
  console.log("React está na versão correta ✅");
}

if (currentReactDOM !== expectedReactDOMVersion) {
  console.log(`React-DOM atual: ${currentReactDOM}, esperado: ${expectedReactDOMVersion}`);
  installVersion("react-dom", expectedReactDOMVersion);
} else {
  console.log("React-DOM está na versão correta ✅");
}

try {
  console.log("🔄 Rodando npm install para garantir dependências...");
  execSync("npm install", { stdio: "inherit" });
} catch {
  console.log("⚠️ Conflito de dependências detectado! Tentando --legacy-peer-deps...");
  execSync("npm install --legacy-peer-deps", { stdio: "inherit" });
}

console.log("✅ Dependências verificadas e corrigidas!");

