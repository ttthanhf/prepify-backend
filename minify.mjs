import fs from 'fs';
import path from 'path';
import { minify } from 'terser';

const buildDir = 'build';
const distDir = 'dist';
const opts = {
	mangle: {
		toplevel: true
	},
	compress: {
		toplevel: true
	}
};

function traverseDirectory(currentDir) {
	const files = fs.readdirSync(currentDir);

	files.forEach(async file => {
		const filePath = path.join(currentDir, file);
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			const distDirPath = filePath.replace(buildDir, distDir);
			fs.mkdirSync(distDirPath, { recursive: true });
			traverseDirectory(filePath);
		} else if (filePath.endsWith('.js')) {
			const distFilePath = filePath.replace(buildDir, distDir);
			const fileContent = fs.readFileSync(filePath, 'utf8');

			if (fileContent.length === 0) {
				fs.copyFileSync(filePath, distFilePath);
			} else {
				const minifiedCode = await minify(fileContent, opts);
				fs.writeFileSync(distFilePath, minifiedCode.code);
			}
		} else {
			const distFilePath = filePath.replace(buildDir, distDir);
			fs.copyFileSync(filePath, distFilePath);
		}
	});
}

traverseDirectory(buildDir);
