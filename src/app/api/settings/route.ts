import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import Settings from '@/models/Settings';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getSession(req);

    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        configs: {}
      });
    }

    return NextResponse.json({
      configs: settings.configs,
      user: session ? {
        email: session.email,
        role: session.role
      } : null
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    await dbConnect();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      settings.configs = new Map(Object.entries(body.configs));
      await settings.save();
    }

    return NextResponse.json({
      configs: settings.configs,
      user: {
        email: session.email,
        role: session.role
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
