import { runTask } from "zx-run-task";

await runTask('Transpile static assets', $`make static`);

await runTask('Lint code', $`
	npx --no-install eslint \
		--max-warnings 0 \
		--parser @typescript-eslint/parser \
		--plugin @typescript-eslint/tslint \
		--config eslintrc.yml \
		--ext .ts .
`);

await runTask('Lint html', $`
	npx --no-install eslint \
		--max-warnings 0 \
		--parser @html-eslint/parser \
		--plugin @html-eslint \
		--config eslint-html.yml \
		--ext .html .
`);

await runTask('Check code formatting', $`npx --no-install dprint check`);
await runTask('Transpile for bundler', $`tsc`);

await runTask('Bundle for browser tag import', $`
	esbuild --platform=browser \
		--format=iife \
		--bundle \
		--minify main.ts \
		--outfile=./dist/cookies-ds.browser.min.js
`);
