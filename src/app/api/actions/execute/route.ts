import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ScanExecutor } from "@/scan/ScanExecutor";

export async function POST(request: NextRequest) {
  await dbConnect();

  await ScanExecutor.executeQueuedScans();

  return NextResponse.json(null, { status: 202 });
}
