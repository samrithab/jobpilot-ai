import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: "us-east-2",
});

let cachedApiKey: string | null = null;

export async function getOpenAIKey() {
  if (cachedApiKey) return cachedApiKey;

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: "jobpilot/openai-api-key",
    })
  );

  if (!response.SecretString) {
    throw new Error("Secret not found");
  }

  const secret = JSON.parse(response.SecretString);

  cachedApiKey = secret.OPENAI_API_KEY;

  return cachedApiKey;
}