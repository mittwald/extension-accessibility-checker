import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ScanProfile } from "@/app/scanProfile/scanProfile.model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;

  await dbConnect();

  const scanProfile = await ScanProfile.findOne({ projectId, _id: profileId });
  if (!scanProfile) {
    return NextResponse.json(
      { message: "Scan profile not found" },
      { status: 404 },
    );
  }
  return NextResponse.json(scanProfile.toJSON());
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  await dbConnect();

  const project = await ScanProfile.findOne({ projectId, _id: profileId });
  if (!project) {
    return NextResponse.json(
      { message: "Scan profile not found" },
      { status: 404 },
    );
  }

  const input = await request.json();
  const updatedScanProfile = await ScanProfile.findByIdAndUpdate(
    profileId,
    { $set: { ...input, updatedAt: new Date(), projectId } },
    { new: true },
  );
  return NextResponse.json(updatedScanProfile!.toJSON());
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; profileId: string }> },
) {
  const { projectId, profileId } = await params;
  await dbConnect();

  const deletedScanProfile = await ScanProfile.findOneAndDelete({
    projectId,
    _id: profileId,
  });
  if (!deletedScanProfile) {
    return NextResponse.json(
      { message: "Scan profile not found" },
      { status: 404 },
    );
  }
  return NextResponse.json(deletedScanProfile.toJSON());
}
