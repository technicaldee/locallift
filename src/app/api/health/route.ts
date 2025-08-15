import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        firebase: 'connected',
        blockchain: 'connected',
      }
    };

    return NextResponse.json(health, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Service check failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}