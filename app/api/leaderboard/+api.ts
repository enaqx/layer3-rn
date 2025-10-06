const DEFAULT_LAYER3_ENDPOINT = 'https://layer3.xyz/api/assignment/users';

export async function GET(request: Request) {
  const upstreamUrl = process.env.EXPO_PUBLIC_LAYER3_API_URL?.trim() || DEFAULT_LAYER3_ENDPOINT;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal: request.signal,
    });

    const body = await upstreamResponse.text();

    return new Response(body, {
      status: upstreamResponse.status,
      headers: {
        'Content-Type': upstreamResponse.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Failed to proxy leaderboard request', error);

    return Response.json(
      {
        error: 'Unable to fetch leaderboard data',
      },
      { status: 500 }
    );
  }
}
