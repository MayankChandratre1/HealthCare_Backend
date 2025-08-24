// api/src/utils/secrets.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(secretName: string): Promise<string> {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    
    const [version] = await client.accessSecretVersion({ name });
    const secretValue = version.payload?.data?.toString();
    
    if (!secretValue) {
      throw new Error(`Secret ${secretName} is empty`);
    }
    
    return secretValue;
  } catch (error) {
    console.error(`Failed to get secret ${secretName}:`, error);
    throw error;
  }
}

export async function initializeSecrets() {
  if (process.env.NODE_ENV === 'production') {
    process.env.JWT_SECRET = await getSecret('JWT_SECRET');
    process.env.DATABASE_URL = await getSecret('DATABASE_URL');
    process.env.GOOGLE_CLOUD_PROJECT = await getSecret('GOOGLE_PROJECT_ID');
    // Add other secrets as needed
  }
}
