import { NextResponse } from 'next/server';
import { getPasscode, savePasscode } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    const currentPasscode = getPasscode();
    
    if (code !== null) {
      const isValid = code === currentPasscode;
      return NextResponse.json({ success: true, isValid });
    }
    
    return NextResponse.json({ success: true, passcode: currentPasscode });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to verify auth' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentPasscode, newPasscode } = body;

    const actualPasscode = getPasscode();

    if (!currentPasscode || currentPasscode !== actualPasscode) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect!' },
        { status: 400 }
      );
    }

    if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 4) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 4 characters long.' },
        { status: 400 }
      );
    }

    savePasscode(newPasscode.trim());

    return NextResponse.json({
      success: true,
      message: 'Admin passcode updated successfully!'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update passcode' },
      { status: 500 }
    );
  }
}
