import { NextRequest, NextResponse } from 'next/server';
import { appendGuestRow } from '@/lib/googleSheets';

function sanitizeText(value: unknown, maxLength = 500): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const website = sanitizeText(body.website, 200);
    if (website) {
      return NextResponse.json({ success: true });
    }

    const guestName = sanitizeText(body.guestName, 150);
    const attendance = sanitizeText(body.attendance, 10);
    const plusOne = sanitizeText(body.plusOne, 10);
    const guestCount = Number(body.guestCount ?? 0);
    const drinks = Array.isArray(body.drinks)
      ? body.drinks.map((item: unknown) => sanitizeText(item, 100)).join(', ')
      : '';
    const allergies = sanitizeText(body.allergies, 700);
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '';
    const userAgent = request.headers.get('user-agent') || '';

    if (!guestName) {
      return NextResponse.json(
        { error: 'Поле "Имя и фамилия" обязательно.' },
        { status: 400 }
      );
    }

    if (!['yes', 'no'].includes(attendance)) {
      return NextResponse.json(
        { error: 'Некорректное значение attendance.' },
        { status: 400 }
      );
    }

    if (!['yes', 'no'].includes(plusOne)) {
      return NextResponse.json(
        { error: 'Некорректное значение plusOne.' },
        { status: 400 }
      );
    }

    if (Number.isNaN(guestCount) || guestCount < 0 || guestCount > 5) {
      return NextResponse.json(
        { error: 'Некорректное количество гостей.' },
        { status: 400 }
      );
    }

    await appendGuestRow([
      new Date().toISOString(),
      guestName,
      attendance,
      plusOne,
      String(guestCount),
      drinks,
      allergies,
      ip,
      userAgent,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('RSVP route error:', error);
    const detail =
      error instanceof Error
        ? error.message
        : JSON.stringify(error);
    console.error('RSVP route error detail:', detail);

    return NextResponse.json(
      { error: 'Ошибка сервера при сохранении данных.' },
      { status: 500 }
    );
  }
}
