import User from '../models/userModel.js';
import Zip  from '../models/zipModel.js';
import { GridFSBucket } from 'mongodb';
import connectDB from '../config/db.js';

// ─── Get Dashboard Data ───────────────────────────────────────────────────────
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const [user, zips] = await Promise.all([
      User.findById(userId).lean(),
      Zip.find({ userId }).sort({ uploadedAt: -1 }).lean(),
    ]);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Daily upload count (reset-aware — compare UTC date strings)
    const todayUTC = new Date().toISOString().slice(0, 10);
    const lastDate = user.lastUploadDate
      ? new Date(user.lastUploadDate).toISOString().slice(0, 10) : null;
    const dailyUploadCount = lastDate === todayUTC ? (user.dailyUploadCount ?? 0) : 0;

    const totalUsedStorage = zips.reduce((acc, z) => acc + (z.fileSize || 0), 0);

    // ── Insights aggregation ──────────────────────────────────────────────────
    const totalImages    = zips.reduce((acc, z) => acc + (z.images?.length || 0), 0);
    const totalUploads   = zips.length;
    let textImages       = 0;
    let noTextImages     = 0;
    let totalProcTime    = 0;
    let procTimeCount    = 0;
    const categoryCount  = {};

    zips.forEach((zip) => {
      (zip.images || []).forEach((img) => {
        if (img.hasText === true)  textImages++;
        if (img.hasText === false) noTextImages++;
        if (img.processingTimeMs) { totalProcTime += img.processingTimeMs; procTimeCount++; }
        if (img.topCategory) categoryCount[img.topCategory] = (categoryCount[img.topCategory] || 0) + 1;
      });
    });

    const avgProcessingTime    = procTimeCount > 0 ? Math.round(totalProcTime / procTimeCount) : 0;
    const categoryDistribution = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.json({
      userInfo: {
        firstName:        user.firstName || '',
        lastName:         user.lastName  || '',
        email:            user.email     || '',
        profession:       user.profession || '',
        organization:     user.organization || '',
        planType:         user.planType  || 'Free',
        lastLogin:        user.lastLogin,
        dailyUploadLimit: user.dailyUploadLimit || 2,
        dailyUploadCount,
        storageLimit:     user.storageLimit || 10_000_000,
        usedStorage:      totalUsedStorage,
      },
      uploads: zips.map((zip) => ({
        _id:              zip._id,
        originalFileName: zip.originalFileName,
        fileSize:         zip.fileSize,
        uploadedAt:       zip.uploadedAt,
        images:           zip.images,
      })),
      insights: { totalUploads, totalImages, textImages, noTextImages, avgProcessingTime, categoryDistribution },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ─── Delete Single ZIP ────────────────────────────────────────────────────────
/**
 * DELETE /api/zip/:zipId
 * Deletes:
 *   1. All image files from GridFS
 *   2. The Zip document from MongoDB
 *   3. Reclaims usedStorage on the user record
 */
export const deleteZip = async (req, res) => {
  try {
    const userId = req.user._id;
    const zip    = await Zip.findById(req.params.zipId);

    if (!zip)
      return res.status(404).json({ message: 'Upload not found' });
    if (zip.userId.toString() !== userId.toString())
      return res.status(403).json({ message: 'Forbidden' });

    // Delete each image file from GridFS
    const db     = await connectDB();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    await Promise.all(
      (zip.images || []).map(async (img) => {
        try {
          const files = await db.collection('images.files')
            .find({ filename: img.filename })
            .toArray();
          await Promise.all(files.map((f) => bucket.delete(f._id)));
        } catch (e) {
          console.warn(`Could not delete GridFS file ${img.filename}:`, e.message);
        }
      })
    );

    // Reclaim storage on user record
    const freedBytes = zip.images.reduce((s, img) => s + (img.fileSize || 0), 0);
    await User.findByIdAndUpdate(userId, {
      $inc: { usedStorage: -Math.abs(freedBytes) },
    });

    await Zip.findByIdAndDelete(req.params.zipId);

    return res.status(200).json({
      message:    'Upload deleted successfully',
      freedBytes,
    });
  } catch (error) {
    console.error('Delete zip error:', error);
    return res.status(500).json({ message: 'Failed to delete upload' });
  }
};

// ─── Delete ALL ZIPs for user ─────────────────────────────────────────────────
/**
 * DELETE /api/zip/all
 * Deletes every upload belonging to the current user and resets usedStorage to 0.
 */
export const deleteAllZips = async (req, res) => {
  try {
    const userId = req.user._id;
    const zips   = await Zip.find({ userId }).lean();

    if (zips.length === 0)
      return res.status(200).json({ message: 'No uploads to delete', deletedCount: 0 });

    const db     = await connectDB();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    // Remove all GridFS files across all zips
    const allFilenames = zips.flatMap((z) => (z.images || []).map((i) => i.filename));
    await Promise.all(
      allFilenames.map(async (filename) => {
        try {
          const files = await db.collection('images.files')
            .find({ filename })
            .toArray();
          await Promise.all(files.map((f) => bucket.delete(f._id)));
        } catch (e) {
          console.warn(`Could not delete GridFS file ${filename}:`, e.message);
        }
      })
    );

    await Zip.deleteMany({ userId });

    // Reset storage counter
    await User.findByIdAndUpdate(userId, { $set: { usedStorage: 0 } });

    return res.status(200).json({
      message:      `${zips.length} upload${zips.length !== 1 ? 's' : ''} deleted`,
      deletedCount: zips.length,
    });
  } catch (error) {
    console.error('Delete all error:', error);
    return res.status(500).json({ message: 'Failed to delete uploads' });
  }
};