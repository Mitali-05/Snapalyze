
export const updateUserPlan = async (req, res) => {
  const { plan } = req.body;

  if (!plan || !['Basic', 'Pro'].includes(plan)) {
    return res.status(400).json({ errors: [{ msg: 'Invalid or missing plan type' }] });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    user.plan = plan;
    await user.save();

    res.status(200).json({ message: 'Plan updated successfully', plan: user.plan });
  } catch (error) {
    console.error('Plan update error:', error.message || error);
    res.status(500).json({ errors: [{ msg: 'Failed to update plan, try again later' }] });
  }
};
