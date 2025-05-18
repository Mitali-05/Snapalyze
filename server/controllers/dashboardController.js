import User from '../models/userModel.js';
import Zip from '../models/zipModel.js';

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const zips = await Zip.find({ userId }).sort({ uploadedAt: -1 }).lean();
    const totalUsedStorage = zips.reduce((acc, zip) => acc + zip.fileSize, 0);

    res.json({
      userInfo: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profession: user.profession || '',
        organization: user.organization || '',
        planType: user.planType || 'Free',
        lastLogin: user.lastLogin,
        dailyUploadLimit: user.dailyUploadLimit || 2,
        storageLimit: user.storageLimit || 100 * 1024 * 1024,
        usedStorage: totalUsedStorage,
      },
      uploads: zips.map(zip => ({
        _id: zip._id,
        originalFileName: zip.originalFileName,
        fileSize: zip.fileSize,
        uploadedAt: zip.uploadedAt,
        images: zip.images,
      })),
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
