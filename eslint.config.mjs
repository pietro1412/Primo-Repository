import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "next-env.d.ts",
    ],
  },
  {
    // Il dominio deve restare puro: niente UI, DB o framework.
    files: ["src/domain/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: ["@/lib/*", "@/services/*", "@/components/*", "@prisma/*", "next/*", "react"] },
      ],
    },
  },
];

export default config;
