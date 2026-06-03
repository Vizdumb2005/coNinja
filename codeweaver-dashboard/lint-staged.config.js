import { ESLint } from 'eslint';

const eslintCli = new ESLint();

export default {
  '*.{ts,tsx,js,jsx}': async (files) => {
    const isIgnored = await Promise.all(
      files.map((file) => eslintCli.isPathIgnored(file))
    );
    const lintableFiles = files.filter((_, idx) => !isIgnored[idx]);
    
    const tasks = [];
    if (lintableFiles.length > 0) {
      tasks.push(`eslint --fix ${lintableFiles.map(f => `"${f}"`).join(' ')}`);
    }
    tasks.push(`prettier --check ${files.map(f => `"${f}"`).join(' ')}`);
    tasks.push(`vitest related --run --passWithNoTests ${files.map(f => `"${f}"`).join(' ')}`);
    return tasks;
  },
  '*.{ts,tsx}': [
    () => 'tsc --noEmit'
  ]
};
