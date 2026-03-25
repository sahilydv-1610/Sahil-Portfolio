import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, role, bio, about, email, phone, location, github, linkedin, twitter, website, skills, experience, education } = req.body;
    let avatar = req.body.existingAvatar || '';
    let cvFile = req.body.existingCvFile || '';
    
    if (req.files) {
      if (req.files.avatar) avatar = `/uploads/${req.files.avatar[0].filename}`;
      if (req.files.cvFile) cvFile = `/uploads/${req.files.cvFile[0].filename}`;
    }
    const parseJSON = (val, fallback = []) => {
      if (!val) return fallback;
      if (typeof val === 'string') { try { return JSON.parse(val); } catch { return fallback; } }
      return val;
    };

    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({ name, role, bio, about, email, phone, location, github, linkedin, twitter, website, avatar, cvFile, skills: parseJSON(skills), experience: parseJSON(experience), education: parseJSON(education) });
    } else {
      profile.name = name || profile.name;
      profile.role = role || profile.role;
      profile.bio = bio ?? profile.bio;
      profile.about = about ?? profile.about;
      profile.email = email ?? profile.email;
      profile.phone = phone ?? profile.phone;
      profile.location = location ?? profile.location;
      profile.github = github ?? profile.github;
      profile.linkedin = linkedin ?? profile.linkedin;
      profile.twitter = twitter ?? profile.twitter;
      profile.website = website ?? profile.website;
      if (avatar) profile.avatar = avatar;
      if (cvFile) profile.cvFile = cvFile;
      if (skills) profile.skills = parseJSON(skills);
      if (experience) profile.experience = parseJSON(experience);
      if (education) profile.education = parseJSON(education);
      await profile.save();
    }
    res.json(profile);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
