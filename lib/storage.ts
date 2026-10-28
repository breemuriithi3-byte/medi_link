import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const client = new S3Client({ region: process.env.SPACES_REGION || "nyc3", endpoint: process.env.SPACES_ENDPOINT, credentials: process.env.SPACES_KEY && process.env.SPACES_SECRET ? { accessKeyId: process.env.SPACES_KEY, secretAccessKey: process.env.SPACES_SECRET } : undefined });
const bucket = process.env.SPACES_BUCKET;
export async function uploadPrivate(key: string, body: Buffer, contentType: string) { if (!bucket) throw new Error("SPACES_BUCKET is not configured"); await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType, ACL: "private" })); }
export async function signedDownload(key: string) { if (!bucket) throw new Error("SPACES_BUCKET is not configured"); return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 300 }); }
export async function deletePrivate(key: string) { if (!bucket) throw new Error("SPACES_BUCKET is not configured"); await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key })); }
