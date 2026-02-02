import { CognitoJwtVerifier } from "aws-jwt-verify";

// Replace with your Amazon Cognito user pool ID
const userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
const clientId = process.env.AWS_COGNITO_USER_POOL_CLIENT_ID;
export async function verifyJWT(token: string) {
  try {
    if (!userPoolId || !clientId) {
      throw new Error("User Pool ID or Client ID is not defined");
    }
    const verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: "id", // or 'id' for ID tokens
      clientId: clientId, // Optional, only if you need to verify the token audience
    });

    const payload = await verifier.verify(token, { clientId });
    return payload;
  } catch (err) {
    console.error("Error verifying JWT:", err);
  }
}
