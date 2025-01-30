import { NextRequest, NextResponse } from "next/server";
import { ScanModel } from "extension-a11y-checker-storage/src/scan/scan.model";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; profileId: string; scanId: string }>;
  },
) {
  const { projectId, profileId, scanId } = await params;
  const scan = await ScanModel.findById(scanId).populate(
    "profileId",
    "_id name",
  );
  if (!scan || !scan.profileId || scan.profileId._id.toString() !== profileId) {
    return NextResponse.json({ message: "Scan not found" }, { status: 404 });
  }
  return NextResponse.json(scan.toJSON());
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; profileId: string; scanId: string }>;
  },
) {
  const { projectId, profileId, scanId } = await params;
  const scan = await ScanModel.findByIdAndDelete(scanId);
  if (!scan || !scan.profileId || scan.profileId._id.toString() !== profileId) {
    return NextResponse.json({ message: "Scan not found" }, { status: 404 });
  }
  return NextResponse.json(scan.toJSON());
}
