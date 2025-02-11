/* Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. */

import * as path from 'path';
import cli from 'cli-ux';
import { writeFile } from './fs';

export async function usageAnalytics(
  projectDir: string,
  agreeToAnalytics: boolean | undefined,
  salt?: string
): Promise<void> {
  const analyticsFilePath = path.resolve(
    projectDir,
    'sap-cloud-sdk-analytics.json'
  );
  if (agreeToAnalytics === false) {
    return writeFile(analyticsFilePath, JSON.stringify({ enabled: false }));
  }

  if (
    agreeToAnalytics ||
    (await cli.confirm(
      'Do you want to provide anonymous usage analytics to help us improve the SDK? (y|n)'
    ))
  ) {
    const jsonContent = salt ? { enabled: true, salt } : { enabled: true };
    await writeFile(analyticsFilePath, JSON.stringify(jsonContent));
  } else {
    await writeFile(analyticsFilePath, JSON.stringify({ enabled: false }));
  }
}
