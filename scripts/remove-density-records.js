const fs = require("fs");
const path = require("path");

const APP_TOKEN = "GXuSb3quXaQGuos7C4ncGyMZn8e";
const TABLE_ID = "tbl30F3J3SBAawcN";
const FIELD_ID = "唯一ID";

const idsToDelete = [
  "LGDBGC-006",
  "AKN-013",
  "JSN-004",
  "JSN-005",
  "JSN-009",
  "AMYPJ-002",
  "AMYPJ-008",
  "AMYPJ-011",
  "YOJ-001",
  "HF-001",
  "HF-002",
  "HF-005",
  "HF-006",
  "HF-007",
  "HF-008",
  "HF-012",
  "SP-002",
  "SP-005",
  "SP-006",
  "XJHY-002",
  "XJHY-003",
  "XJHY-007",
  "SNWT-001",
  "SNWT-006",
  "SNWT-007",
  "SNWT-008",
  "SNWT-010",
  "BLSMY-009",
  "BLSMY-004",
  "BLSMY-011",
  "BLSMY-012",
  "BLSMY-007",
  "XDD-002",
  "XDD-004",
  "XDD-006",
  "XDD-008",
  "XDD-009",
  "BCSJ-001",
  "FNDPT-006",
  "GL-007",
  "ZYP-020",
  "ZYP-021",
  "FSD-002",
  "FSD-008",
  "FSD-006",
  "FYZ-002",
  "FYZ-004",
  "FYZ-007",
  "FYZ-010",
  "BJ-004",
  "BJ-007",
  "RP-001",
  "RP-002",
  "RP-003",
  "RP-005",
  "RP-006",
  "RP-007",
  "RP-008",
  "RP-010",
  "RP-013",
  "RP-018",
  "MY-009",
  "AQ-001",
  "AQ-003",
  "AQ-004",
  "AQ-006",
  "AQ-007",
  "AQ-009",
  "AKS-010",
  "AKS-012",
  "WDGE-010",
  "WDGE-003",
  "WDGE-006",
  "PIAO-005",
];

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = value;
  }
}

async function getTenantAccessToken() {
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("Missing FEISHU_APP_ID or FEISHU_APP_SECRET");
  }

  const res = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: appId,
      app_secret: appSecret,
    }),
  });
  const data = await res.json();

  if (!data.tenant_access_token) {
    throw new Error(`Failed to get tenant access token: ${JSON.stringify(data)}`);
  }

  return data.tenant_access_token;
}

async function fetchAllRecords(token) {
  const records = [];
  let pageToken;

  do {
    const url = new URL(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`,
    );
    url.searchParams.set("page_size", "500");
    if (pageToken) url.searchParams.set("page_token", pageToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.code !== 0) {
      throw new Error(`Failed to fetch records: ${JSON.stringify(data)}`);
    }

    records.push(...(data.data?.items ?? []));
    pageToken = data.data?.has_more ? data.data.page_token : undefined;
  } while (pageToken);

  return records;
}

async function deleteRecord(token, recordId) {
  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records/${recordId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  if (data.code !== 0) {
    throw new Error(JSON.stringify(data));
  }
}

async function main() {
  loadEnvLocal();

  const duplicateIds = idsToDelete.filter((id, index) => idsToDelete.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    throw new Error(`Duplicate IDs in delete list: ${duplicateIds.join(", ")}`);
  }

  const token = await getTenantAccessToken();
  const records = await fetchAllRecords(token);
  const byUniqueId = new Map();

  for (const record of records) {
    const uniqueId = record.fields?.[FIELD_ID];
    if (typeof uniqueId === "string" && uniqueId) {
      byUniqueId.set(uniqueId, record.record_id);
    }
  }

  let deleted = 0;
  let skipped = 0;
  const failures = [];

  for (const uniqueId of idsToDelete) {
    const recordId = byUniqueId.get(uniqueId);

    if (!recordId) {
      skipped += 1;
      console.log(`SKIP missing: ${uniqueId}`);
      continue;
    }

    try {
      await deleteRecord(token, recordId);
      deleted += 1;
      console.log(`DELETED: ${uniqueId} (${recordId})`);
    } catch (error) {
      failures.push({ uniqueId, message: error instanceof Error ? error.message : String(error) });
      console.error(`FAILED: ${uniqueId} (${recordId})`);
    }
  }

  console.log("");
  console.log(`成功删除条数: ${deleted}`);
  console.log(`不存在跳过条数: ${skipped}`);
  console.log(`失败条数: ${failures.length}`);

  if (failures.length > 0) {
    console.log("失败明细:");
    for (const failure of failures) {
      console.log(`- ${failure.uniqueId}: ${failure.message}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
