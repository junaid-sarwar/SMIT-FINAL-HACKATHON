import { User } from "../models/User.js";

// ➕ Add Family Member
export const addFamilyMember = async (req, res) => {
  try {
    const { name, age, relation, gender } = req.body;

    if (!name || !relation) {
      return res.status(400).json({
        success: false,
        message: "Name and relation are required",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const newMember = { name, age: age || "", relation, gender: gender || "" };
    user.familyMembers.push(newMember);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Family member added successfully",
      familyMembers: user.familyMembers,
    });
  } catch (error) {
    console.error("Add Family Member Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✏️ Update Family Member
export const updateFamilyMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { name, age, relation, gender } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const member = user.familyMembers.id(memberId);
    if (!member) return res.status(404).json({ success: false, message: "Family member not found" });

    if (name) member.name = name;
    if (age) member.age = age;
    if (relation) member.relation = relation;
    if (gender) member.gender = gender;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Family member updated successfully",
      familyMembers: user.familyMembers,
    });
  } catch (error) {
    console.error("Update Family Member Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
