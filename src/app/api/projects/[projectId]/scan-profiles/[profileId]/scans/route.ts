import { NextRequest, NextResponse } from "next/server";
import { Scan } from "@/app/scan/scan.model";
import { ScanProfile } from "@/app/scanProfile/scanProfile.model";
import dbConnect from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  await dbConnect();

  const scans = await Scan.find({ profileId });
  return NextResponse.json(scans);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  await dbConnect();

  // todo: add the scan to queue

  const profile = await ScanProfile.findOne({ _id: profileId, projectId });
  if (!profile) {
    return NextResponse.json(
      { message: "Scan profile not found" },
      { status: 404 },
    );
  }

  const scan = await Scan.create({
    profileId,
    projectId,
    status: "queued",
    urls: profile.paths.map((path) => `https://${profile.domain}${path}`),
  });

  return NextResponse.json(scan.toJSON(), { status: 202 });
}
