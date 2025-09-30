#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const { Project, SyntaxKind, Node } = require("ts-morph");

// Parse CLI arguments
const args = process.argv.slice(2);
const stageArg = args.find(arg => arg.startsWith('--stage='));
const requestedStage = stageArg ? stageArg.split('=')[1] : 'all';

const STAGES = {
  CONVERT_EXPORTS: 'convert-exports',
  UPDATE_IMPORTS: 'update-imports',
  REMOVE_BARRELS: 'remove-barrels',
};

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, "../tsconfig.json"),
});

const SOURCE_GLOBS = [
  "src/**/*.{ts,tsx,js,jsx}",
  "playwright/**/*.{ts,tsx,js,jsx}",
];

console.log(`\n${'='.repeat(60)}`);
console.log(`Running stage: ${requestedStage}`);
console.log(`${'='.repeat(60)}\n`);

const sourceFiles = project.getSourceFiles(SOURCE_GLOBS);

console.log(`Found ${sourceFiles.length} source files to process`);

const defaultExportNameByPath = new Map();

function toPascalCase(value) {
  return value
    .replace(/[^A-Za-z0-9]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function ensureValidIdentifier(text) {
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(text)) {
    return `Identifier${text.replace(/[^A-Za-z0-9_$]/g, "")}`;
  }
  return text;
}

function getFallbackName(sourceFile) {
  const filePath = sourceFile.getFilePath();
  const base = path.basename(filePath, path.extname(filePath));
  const directoryName = path.basename(path.dirname(filePath));
  const candidate = base.toLowerCase() === "index" ? directoryName : base;
  const pascal = toPascalCase(candidate) || "ExportedValue";
  return ensureValidIdentifier(pascal);
}

function isNameInUse(sourceFile, name) {
  return sourceFile
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .some((identifier) => identifier.getText() === name);
}

function getUniqueName(sourceFile, baseName) {
  let candidate = baseName;
  let counter = 1;
  while (isNameInUse(sourceFile, candidate)) {
    candidate = `${baseName}${counter}`;
    counter += 1;
  }
  return candidate;
}

function convertDefaultDeclaration(sourceFile, declaration) {
  if (Node.isFunctionDeclaration(declaration)) {
    let name = declaration.getName();
    if (!name) {
      name = getUniqueName(sourceFile, getFallbackName(sourceFile));
      declaration.setName(name);
    }
    declaration.setIsDefaultExport(false);
    declaration.setIsExported(true);
    return name;
  }

  if (Node.isClassDeclaration(declaration)) {
    let name = declaration.getName();
    if (!name) {
      name = getUniqueName(sourceFile, getFallbackName(sourceFile));
      declaration.setName(name);
    }
    declaration.setIsDefaultExport(false);
    declaration.setIsExported(true);
    return name;
  }

  if (Node.isInterfaceDeclaration(declaration)) {
    let name = declaration.getName();
    if (!name) {
      name = getUniqueName(sourceFile, getFallbackName(sourceFile));
      declaration.setName(name);
    }
    declaration.setIsDefaultExport(false);
    declaration.setIsExported(true);
    return name;
  }

  if (Node.isEnumDeclaration(declaration)) {
    let name = declaration.getName();
    if (!name) {
      name = getUniqueName(sourceFile, getFallbackName(sourceFile));
      declaration.setName(name);
    }
    declaration.setIsDefaultExport(false);
    declaration.setIsExported(true);
    return name;
  }

  if (Node.isExportAssignment(declaration)) {
    const expression = declaration.getExpression();
    if (!expression) {
      return null;
    }

    if (Node.isIdentifier(expression)) {
      const identifierName = expression.getText();
      declaration.replaceWithText(`export { ${identifierName} };`);
      return identifierName;
    }

    const fallback = getUniqueName(sourceFile, getFallbackName(sourceFile));
    const initializerText = expression.getText();
    declaration.replaceWithText(
      `export const ${fallback} = ${initializerText};`
    );
    return fallback;
  }

  return null;
}

function ensureDefaultExportName(sourceFile, stack = new Set()) {
  const filePath = sourceFile.getFilePath();
  if (defaultExportNameByPath.has(filePath)) {
    return defaultExportNameByPath.get(filePath);
  }

  if (stack.has(filePath)) {
    defaultExportNameByPath.set(filePath, null);
    return null;
  }

  stack.add(filePath);

  const defaultSymbol = sourceFile.getDefaultExportSymbol();
  if (defaultSymbol) {
    const declarations = defaultSymbol.getDeclarations();
    for (const declaration of declarations) {
      const exportName = convertDefaultDeclaration(sourceFile, declaration);
      if (exportName) {
        defaultExportNameByPath.set(filePath, exportName);
        stack.delete(filePath);
        return exportName;
      }
    }
  }

  for (const exportDeclaration of sourceFile.getExportDeclarations()) {
    for (const specifier of exportDeclaration.getNamedExports()) {
      const nameNode = specifier.getNameNode();
      if (!nameNode || nameNode.getText() !== "default") {
        continue;
      }
      const moduleSource = exportDeclaration.getModuleSpecifierSourceFile();
      if (!moduleSource) {
        continue;
      }
      const replacement = ensureDefaultExportName(moduleSource, stack);
      if (!replacement) {
        continue;
      }
      specifier.setName(replacement);
      defaultExportNameByPath.set(filePath, replacement);
      stack.delete(filePath);
      return replacement;
    }
  }

  defaultExportNameByPath.set(filePath, null);
  stack.delete(filePath);
  return null;
}

// Stage 1: Convert default exports to named exports
if (requestedStage === 'all' || requestedStage === STAGES.CONVERT_EXPORTS) {
  console.log("\n[Stage 1/3] Converting default exports to named exports...");
  let convertedCount = 0;
  for (const sourceFile of sourceFiles) {
    const name = ensureDefaultExportName(sourceFile);
    if (name) {
      convertedCount++;
      if (convertedCount <= 5) {
        console.log(`  - ${sourceFile.getFilePath()}: ${name}`);
      }
    }
  }
  console.log(`Converted ${convertedCount} default exports`);

  console.log("Saving changes...");
  project.saveSync();
  console.log("✓ Stage 1 complete\n");

  if (requestedStage === STAGES.CONVERT_EXPORTS) process.exit(0);
}

// Stage 2: Update default imports to named imports
if (requestedStage === 'all' || requestedStage === STAGES.UPDATE_IMPORTS) {
  console.log("[Stage 2/3] Updating default imports to named imports...");
  let updatedImportsCount = 0;
  for (const sourceFile of sourceFiles) {
    for (const importDeclaration of sourceFile.getImportDeclarations()) {
      const defaultImport = importDeclaration.getDefaultImport();
      if (!defaultImport) {
        continue;
      }
      const moduleSource = importDeclaration.getModuleSpecifierSourceFile();
      if (!moduleSource) {
        continue;
      }

      const exportedName = ensureDefaultExportName(moduleSource);
      if (!exportedName) {
        continue;
      }

      const localName = defaultImport.getText();
      importDeclaration.removeDefaultImport();
      updatedImportsCount++;

      const aliasNeeded = localName !== exportedName;
      const existingNamed = importDeclaration
        .getNamedImports()
        .map((named) => named.getNameNode().getText());

      if (!existingNamed.includes(exportedName) || aliasNeeded) {
        importDeclaration.addNamedImport(
          aliasNeeded ? { name: exportedName, alias: localName } : exportedName
        );
      }

      if (
        !importDeclaration.getNamedImports().length &&
        !importDeclaration.getNamespaceImport()
      ) {
        importDeclaration.remove();
      }
    }
  }
  console.log(`Updated ${updatedImportsCount} default imports`);

  console.log("Saving changes...");
  project.saveSync();
  console.log("✓ Stage 2 complete\n");

  if (requestedStage === STAGES.UPDATE_IMPORTS) process.exit(0);
}

function isBarrelFile(sourceFile) {
  const statements = sourceFile.getStatements();
  if (!statements.length) {
    return false;
  }
  return statements.every((statement) =>
    Node.isExportDeclaration(statement) || Node.isImportDeclaration(statement)
  );
}

function buildBarrelMapping(barrelFile) {
  const mapping = new Map();
  for (const exportDeclaration of barrelFile.getExportDeclarations()) {
    const moduleSource = exportDeclaration.getModuleSpecifierSourceFile();
    if (!moduleSource) {
      continue;
    }
    const modulePath = moduleSource.getFilePath();

    if (exportDeclaration.isNamespaceExport()) {
      const exportedDeclarations = moduleSource.getExportedDeclarations();
      for (const [exportedName] of exportedDeclarations) {
        if (exportedName === "default") {
          continue;
        }
        mapping.set(exportedName, {
          modulePath,
          importName: exportedName,
        });
      }
      continue;
    }

    for (const specifier of exportDeclaration.getNamedExports()) {
      const exportName = specifier.getAliasNode()
        ? specifier.getAliasNode().getText()
        : specifier.getName();
      const importName = specifier.getName();
      mapping.set(exportName, {
        modulePath,
        importName,
      });
    }
  }
  return mapping;
}

// Stage 3: Remove barrel files
if (requestedStage === 'all' || requestedStage === STAGES.REMOVE_BARRELS) {
  console.log("[Stage 3/3] Removing barrel files...");

  const barrelFiles = sourceFiles.filter((file) => isBarrelFile(file));
  const barrelPaths = new Set(barrelFiles.map((f) => f.getFilePath()));
  const nonBarrelFiles = sourceFiles.filter((f) => !barrelPaths.has(f.getFilePath()));

  console.log(`Found ${barrelFiles.length} barrel files to remove`);

  for (const barrel of barrelFiles) {
    const barrelPath = barrel.getFilePath();
    const mapping = buildBarrelMapping(barrel);

    for (const sourceFile of nonBarrelFiles) {
      for (const importDeclaration of sourceFile.getImportDeclarations()) {
        const moduleSource = importDeclaration.getModuleSpecifierSourceFile();
        if (!moduleSource) {
          continue;
        }
        if (moduleSource.getFilePath() !== barrelPath) {
          continue;
        }

        const namedImports = importDeclaration.getNamedImports();
        const namespaceImport = importDeclaration.getNamespaceImport();
        if (namespaceImport) {
          throw new Error(
            `Namespace import found for barrel ${barrelPath} in ${sourceFile.getFilePath()}`
          );
        }

        const newImportsByModule = new Map();

        for (const namedImport of namedImports) {
          const exportedName = namedImport.getNameNode().getText();
          const aliasNode = namedImport.getAliasNode();
          const alias = aliasNode ? aliasNode.getText() : null;

          const target = mapping.get(exportedName);
          if (!target) {
            throw new Error(
              `Unable to resolve export ${exportedName} from barrel ${barrelPath}`
            );
          }

          if (!newImportsByModule.has(target.modulePath)) {
            newImportsByModule.set(target.modulePath, []);
          }

          newImportsByModule.get(target.modulePath).push({
            importName: target.importName,
            alias,
          });
        }

        importDeclaration.remove();

        for (const [modulePath, specifiers] of newImportsByModule) {
          const relativePath = path.relative(
            path.dirname(sourceFile.getFilePath()),
            modulePath
          );
          const normalizedPath =
            relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
          const cleanedPath = normalizedPath.split("\\").join("/");

          const moduleSpecifier = cleanedPath.replace(/\.(tsx?|jsx?)$/, "");
          sourceFile.addImportDeclaration({
            moduleSpecifier,
            namedImports: specifiers.map((specifier) =>
              specifier.alias && specifier.alias !== specifier.importName
                ? { name: specifier.importName, alias: specifier.alias }
                : specifier.importName
            ),
          });
        }
      }
    }

    const filePath = barrel.getFilePath();
    barrel.delete();
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  console.log("Saving changes...");
  project.saveSync();
  console.log("✓ Stage 3 complete\n");
}

console.log("\n" + "=".repeat(60));
console.log("✓ All stages complete!");
console.log("=".repeat(60));
