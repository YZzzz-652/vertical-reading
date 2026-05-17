import { NextResponse } from 'next/server';

const FEISHU_APP_ID = process.env.FEISHU_APP_ID!;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET!;
const TABLE_ID = 'tbl30F3J3SBAawcN';
const APP_TOKEN = 'GXuSb3quXaQGuos7C4ncGyMZn8e';

type FeishuFieldValue = string | number | null | undefined | Array<string | { text?: string; name?: string }>;
type FeishuFields = Record<string, FeishuFieldValue>;

type FeishuRecord = {
  fields: FeishuFields;
};

async function getTenantAccessToken(): Promise<string> {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET,
    }),
  });
  const data = await res.json();
  if (!data.tenant_access_token) {
    throw new Error(`获取 token 失败: ${JSON.stringify(data)}`);
  }
  return data.tenant_access_token;
}

async function fetchAllRecords(token: string): Promise<FeishuRecord[]> {
  const allRecords: FeishuRecord[] = [];
  let pageToken: string | undefined = undefined;

  do {
    const url = new URL(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`
    );
    url.searchParams.set('page_size', '500');
    if (pageToken) url.searchParams.set('page_token', pageToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.code !== 0) {
      throw new Error(`飞书 API 错误: ${JSON.stringify(data)}`);
    }

    allRecords.push(...(data.data?.items ?? []));
    pageToken = data.data?.has_more ? data.data.page_token : undefined;
  } while (pageToken);

  return allRecords;
}

function formatRecord(item: FeishuRecord) {
  const f = item.fields;
  const normalizeMultiSelect = (value: FeishuFieldValue) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === 'string') return item;
          return item.text ?? item.name ?? '';
        })
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (typeof value === 'string') {
      return value
        .split(/[,，、]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  return {
    id: f['唯一ID'] ?? '',
    book: f['书名'] ?? '',
    author: f['作者'] ?? '',
    region: f['国家地区'] ?? '',
    character: f['人物姓名'] ?? '',
    class: f['阶层标签'] ?? '',
    gender: f['性别标签'] ?? '',
    tags: f['细描标签'] ?? '',
    event: f['事件描述'] ?? '',
    quote: f['原文摘录'] ?? '',
    position: f['书中位置'] ?? '',
    year: f['显示年份'] ? Number(f['显示年份']) : null,
    timeType: f['时间类型'] ?? '',
    timeNote: f['时间备注'] ?? '',
    locationName: f['地点显示名'] ?? '',
    city: f['参考城市'] ?? '',
    lng: f['经度'] ? Number(f['经度']) : null,
    lat: f['纬度'] ? Number(f['纬度']) : null,
    locationType: f['地点类型'] ?? '',
    eventTypes: normalizeMultiSelect(f['事件类型']),
  };
}

export async function GET() {
  try {
    const token = await getTenantAccessToken();
    const records = await fetchAllRecords(token);
    const events = records.map(formatRecord);
    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : '未知错误';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
