import * as jsonDb from '../utils/jsonDb.js';

export const getProfile = async (req, res) => {
  try {
    let profile = await jsonDb.findOne('profile');
    if (!profile) {
      profile = await jsonDb.create('profile', {});
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

    let profile = await jsonDb.findOne('profile');
    const updateData = {
      name: name || profile?.name || 'Sahil',
      role: role || profile?.role || 'Full Stack Developer',
      bio: bio ?? profile?.bio ?? '',
      about: about ?? profile?.about ?? '',
      email: email ?? profile?.email ?? '',
      phone: phone ?? profile?.phone ?? '',
      location: location ?? profile?.location ?? '',
      github: github ?? profile?.github ?? '',
      linkedin: linkedin ?? profile?.linkedin ?? '',
      twitter: twitter ?? profile?.twitter ?? '',
      website: website ?? profile?.website ?? '',
      avatar: avatar || profile?.avatar || '',
      cvFile: cvFile || profile?.cvFile || '',
      skills: parseJSON(skills, profile?.skills),
      experience: parseJSON(experience, profile?.experience),
      education: parseJSON(education, profile?.education)
    };

    if (!profile) {
      profile = await jsonDb.create('profile', updateData);
    } else {
      profile = await jsonDb.findOneAndUpdate('profile', { _id: profile._id }, updateData);
    }
    res.json(profile);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

