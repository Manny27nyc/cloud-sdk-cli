/* Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. */

import * as path from 'path';
import { recordWarning, readFile, writeFile } from '../utils';

export async function modifyGitIgnore(
  projectDir: string,
  addCds: boolean
): Promise<void> {
  const pathToGitignore = path.resolve(projectDir, '.gitignore');
  const pathsToIgnore = ['credentials.json', '/s4hana_pipeline', '/deployment'];

  if (addCds) {
    const cdsPathsToIgnore = [
      '_out',
      '.cds_gen.log',
      '*.db',
      'connection.properties',
      'default-*.json',
      'gen/',
      'target/'
    ];
    pathsToIgnore.push(...cdsPathsToIgnore);
  }

  try {
    const fileContent = await readFile(pathToGitignore, 'utf8');
    const newPaths = pathsToIgnore.filter(
      filePath => !fileContent.includes(filePath)
    );
    const newFileContent =
      fileContent + (newPaths.length > 0 ? `\n${newPaths.join('\n')}\n` : '');

    await writeFile(pathToGitignore, newFileContent, 'utf8').catch(() =>
      recordWarning(
        'There was a problem writing to the .gitignore.',
        'If your project is using a different version control system,',
        'please make sure the following paths are not tracked:',
        ...pathsToIgnore.map(filePath => '  ' + filePath)
      )
    );
  } catch {
    recordWarning(
      'No .gitignore file found!',
      'If your project is using a different version control system,',
      'please make sure the following paths are not tracked:',
      ...pathsToIgnore.map(filePath => '  ' + filePath)
    );
  }
}
