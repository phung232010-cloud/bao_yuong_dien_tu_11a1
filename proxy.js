export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const directUrl = searchParams.get('url');

  let targetUrl = '';
  if (id) {
    targetUrl = `https://drive.google.com/uc?export=download&id=${id}&confirm=t`;
  } else if (directUrl) {
    targetUrl = directUrl;
  } else {
    return new Response('Thiếu tham số id hoặc url', { status: 400 });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Content-Type', res.headers.get('content-type') || 'application/pdf');

    return new Response(res.body, {
      status: res.status,
      headers,
    });
  } catch (err) {
    return new Response('Proxy Error: ' + err.message, { status: 500 });
  }
}

