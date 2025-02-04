import { NextRequest, NextResponse } from "next/server";
import {
  dbConnect,
  ScanModel,
  ScanProfileModel,
} from "extension-a11y-checker-storage";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  await dbConnect();

  const scans = await ScanModel.find({ profile: profileId });
  return NextResponse.json(scans);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  await dbConnect();

  const profile = await ScanProfileModel.findOne({
    _id: profileId,
    project: projectId,
  }).populate("project");
  if (!profile) {
    return NextResponse.json(
      { message: "Scan profile not found" },
      { status: 404 },
    );
  }

  const scan = await ScanModel.create({
    _id: new ObjectId(),
    profile: profileId,
    project: projectId,
    status: "queued",
    urls: profile.paths.map((path) => `https://${profile.domain}${path}`),
  });

  return NextResponse.json(scan.toJSON(), { status: 202 });
}
