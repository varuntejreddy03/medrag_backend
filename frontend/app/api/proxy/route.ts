import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://medrag-final.loca.lt';

async function proxyRequest(request: NextRequest, endpoint: string) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || endpoint;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const body = request.method !== 'GET' ? await request.text() : undefined;
    
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: request.method,
      headers,
      body,
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proxy request failed' }, 
      { status: 500 }
    );
  }
}

// Handle /gi endpoint specifically
export async function handleGiRequest(request: NextRequest) {
  return proxyRequest(request, '/gi');
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, '/auth/login');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, '/auth/login');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, '/auth/login');
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, '/auth/login');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
  });
}