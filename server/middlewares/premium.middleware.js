export const checkPremium = (req, _res, next) => {
  if (!req.user) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }

  const isExpired = req.user.premiumExpiry && new Date(req.user.premiumExpiry).getTime() < Date.now();

  req.user.isPremium = req.user.isPremium && !isExpired;
  req.showAds = !req.user.isPremium;

  next();
};

export const injectAds = (req, _res, next) => {
  req.showAds = !req.user?.isPremium;
  next();
};