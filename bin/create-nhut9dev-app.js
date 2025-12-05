#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import minimist from 'minimist';
import { fileURLToPath } from 'url';

const args = minimist(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
	// Select template first
	let template = args.template;
	if (!template) {
		const templateChoice = await prompts({
			type: 'select',
			name: 'selectedTemplate',
			message: 'Choose a project template',
			choices: [
				{
					title: 'Next.js 16 Clean Architecture',
					value: 'nextjs16-clean-architecture'
				},
				{
					title: 'Clean Architecture Express',
					value: 'clean-architecture-express'
				},
				{ title: 'API Gateway', value: 'api-gateway' },
				{
					title: 'Turbo Nextjs + Expo',
					value: 'turbo-nextjs-expo'
				}
			],
			initial: 0
		});
		template = templateChoice.selectedTemplate || 'nextjs';
	}

	// Prompt for project name
	const response = await prompts({
		type: 'text',
		name: 'projectName',
		message: 'What is your project name?',
		initial: 'nhut9dev-app'
	});

	const projectName = response.projectName;
	const cwd = process.cwd();
	const targetDir = path.join(cwd, projectName);

	const templateDir = path.join(__dirname, `../templates/${template}`);

	// Check if template exists
	if (!fs.existsSync(templateDir)) {
		console.log(chalk.red(`❌ Template '${template}' not found.`));
		process.exit(1);
	}

	// Check if project folder already exists
	if (fs.existsSync(targetDir)) {
		console.log(chalk.red(`❌ Directory '${projectName}' already exists.`));
		process.exit(1);
	}

	// Copy template
	await fs.copy(templateDir, targetDir, {
		filter: (src) => {
			const basename = path.basename(src);

			const ignoreList = [
				'.DS_Store',
				'node_modules',
				'dist',
				'out',
				'.git',
				'test-results',
				'jest-results',
				'.swc',
				'.next'
			];

			return !ignoreList.includes(basename);
		}
	});

	// Rename gitignore -> .gitignore
	const gitignoreSrc = path.join(targetDir, 'gitignore');
	const gitignoreDest = path.join(targetDir, '.gitignore');
	if (fs.existsSync(gitignoreSrc)) {
		await fs.move(gitignoreSrc, gitignoreDest);
	}

	// Replace placeholders in package.json
	const pkgPath = path.join(targetDir, 'package.json');
	if (fs.existsSync(pkgPath)) {
		let pkg = await fs.readFile(pkgPath, 'utf-8');
		pkg = pkg.replace(/{{projectName}}/g, projectName);
		await fs.writeFile(pkgPath, pkg);
	}

	// Replace placeholders in README.md
	const readmePath = path.join(targetDir, 'README.md');
	if (fs.existsSync(readmePath)) {
		let readme = await fs.readFile(readmePath, 'utf-8');
		readme = readme.replace(/{{projectName}}/g, projectName);
		await fs.writeFile(readmePath, readme);
	}

	// Replace placeholders in .env.example
	const envExamplePath = path.join(targetDir, '.env.example');
	if (fs.existsSync(envExamplePath)) {
		let envExample = await fs.readFile(envExamplePath, 'utf-8');
		envExample = envExample.replace(/{{projectName}}/g, projectName);
		await fs.writeFile(envExamplePath, envExample);
	}

	// Replace placeholders in app.json (for Expo projects)
	const appJsonPath = path.join(targetDir, 'apps/mobile/app.json');
	if (fs.existsSync(appJsonPath)) {
		let appJson = await fs.readFile(appJsonPath, 'utf-8');
		appJson = appJson.replace(/{{projectName}}/g, projectName);
		await fs.writeFile(appJsonPath, appJson);
	}

	console.log('');
	console.log(
		chalk.green(
			`✅ Project '${projectName}' has been successfully created using the '${template}' template.`
		)
	);
	console.log('');
	console.log(`👉 ${chalk.cyan(`cd ${projectName}`)}`);
	console.log(`👉 ${chalk.cyan('npm install')}`);
	console.log(`👉 ${chalk.cyan('npm run dev')} (or your preferred command)`);
})();
