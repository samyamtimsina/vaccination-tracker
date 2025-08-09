export const getMe = (req, res) => {
  if (req.user) {
    const user = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };
    res.json({ user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
