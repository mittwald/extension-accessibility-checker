const path = require("path");

const ALIAS = "~";
const ALIAS_TARGET = "app";

module.exports = {
  "prefer-relative-for-local": {
    meta: {
      type: "suggestion",
      docs: {
        description:
          "Enforce relative paths for local imports instead of using a path alias.",
      },
      fixable: "code",
      schema: [],
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const importSource = node.source.value;
          if (
            typeof importSource !== "string" ||
            !importSource.startsWith(`${ALIAS}/`)
          ) {
            return;
          }

          const fullFilePath = context.getFilename();
          const fileDir = path.dirname(fullFilePath);
          const projectRoot = context.getCwd();
          const aliasRootDir = path.join(projectRoot, ALIAS_TARGET);

          const importPathWithoutAlias = importSource.substring(
            ALIAS.length + 1,
          );
          const resolvedImportPath = path.join(
            aliasRootDir,
            importPathWithoutAlias,
          );

          if (resolvedImportPath.startsWith(fileDir)) {
            context.report({
              node,
              message: `Use a relative path instead of the '${ALIAS}/' alias for this local import.`,
              fix(fixer) {
                let relativePath = path.relative(fileDir, resolvedImportPath);
                if (!relativePath.startsWith(".")) {
                  relativePath = "./" + relativePath;
                }
                const fileExtension = path.extname(relativePath);
                const finalPath = relativePath.substring(
                  0,
                  relativePath.length - fileExtension.length,
                );
                return fixer.replaceText(node.source, `'${finalPath}'`);
              },
            });
          }
        },
      };
    },
  },
};
