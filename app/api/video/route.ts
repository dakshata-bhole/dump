import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const videoPath = 'E:\\ed\\001102868.mp4';

  if (!fs.existsSync(videoPath)) {
    return new NextResponse('Video file not found', { status: 404 });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize.toString(),
      'Content-Type': 'video/mp4',
    };

    // @ts-expect-error Node stream to Web stream conversion
    return new NextResponse(file, { status: 206, headers });
  } else {
    const headers = {
      'Content-Length': fileSize.toString(),
      'Content-Type': 'video/mp4',
    };
    const file = fs.createReadStream(videoPath);
    // @ts-expect-error Node stream to Web stream conversion
    return new NextResponse(file, { status: 200, headers });
  }
}
