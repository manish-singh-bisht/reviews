const cloudinary = require("cloudinary").v2;
const { validationResult, matchedData } = require("express-validator");
const prisma = require("../lib/prisma");
const { uploadImage } = require("../utils/imageUpload");

exports.addSpace = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const data = matchedData(req);
  const userId = req.user.id;
  try {
    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    const existingSpace = await prisma.space.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingSpace) {
      return res
        .status(400)
        .json({ error: "Space with this name already exists." });
    }

    let logoJson = null;
    let thankYouPageLogoJson = null;

    if (data.logo && data.thankYouPage.logo) {
      logoJson = await uploadImage(data.logo);
      thankYouPageLogoJson = await uploadImage(data.thankYouPage.logo);
    }
    const space = await prisma.space.create({
      data: {
        ...data,
        logo: logoJson,
        thankYouPage: {
          ...data.thankYouPage,
          logo: thankYouPageLogoJson,
        },
        userId: req.user.id,
      },
      select: {
        id: true,
        name: true,
        logo: true,
        createdAt: true,
        headerTitle: true,
        customMessage: true,
        questions: true,
        customButtonColor: true,
        theme: true,
        thankYouPage: true,
      },
    });

    return res.status(201).json({
      space,
    });
  } catch (error) {
    console.error("Error during space creation:", error);
    return res.status(500).json({ error: "Failed to create space" });
  }
};
exports.editSpace = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const data = matchedData(req);
  const { id } = matchedData(req);
  const userId = req.user.id;
  try {
    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    const existingSpace = await prisma.space.findFirst({
      where: {
        userId: userId,
        name: data.name,
      },
    });

    if (existingSpace && existingSpace.id !== id) {
      return res
        .status(400)
        .json({ error: "Space with this name already exists." });
    }

    const space = await prisma.space.findUnique({
      where: {
        id,
      },
    });

    if (!space) {
      return res.status(400).json({ error: "Space not found" });
    }

    let logoJson = space.logo;
    let thankYouPageLogoJson = space.thankYouPage.logo;

    if (data.logo && data.logo.startsWith("data:")) {
      logoJson = await uploadImage(data.logo);
    }

    if (data.thankYouPage.logo && data.thankYouPage.logo.startsWith("data:")) {
      thankYouPageLogoJson = await uploadImage(data.thankYouPage.logo);
    }

    const updatedSpace = await prisma.space.update({
      where: { id: id },
      data: {
        ...data,
        logo: logoJson,
        thankYouPage: {
          ...data.thankYouPage,
          logo: thankYouPageLogoJson,
        },
        userId: req.user.id,
      },
      select: {
        id: true,
        name: true,
        logo: true,
        createdAt: true,
        headerTitle: true,
        customMessage: true,
        questions: true,
        customButtonColor: true,
        theme: true,
        thankYouPage: true,
      },
    });

    return res.status(200).json({
      updatedSpace,
    });
  } catch (error) {
    console.error("Error during space update:", error);
    return res.status(500).json({ error: "Failed to update space" });
  }
};
exports.deleteSpace = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  const { id } = matchedData(req);

  try {
    const space = await prisma.space.findUnique({
      where: {
        id,
      },
    });

    if (!space) {
      return res.status(400).json({ error: "Space not found" });
    }

    await prisma.space.delete({
      where: { id: id },
    });

    await Promise.all([
      cloudinary.uploader.destroy(space.logo.public_id),
      cloudinary.uploader.destroy(space.thankYouPage.logo.public_id),
    ]);

    return res.status(200).json({ message: "Space deleted successfully" });
  } catch (error) {
    console.error("Error during space deletion:", error);
    return res.status(500).json({ error: "Failed to delete space" });
  }
};
exports.getSpacesForUser = async (req, res) => {
  const id = req.user.id;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const skip = (page - 1) * limit;

  try {
    if (!id) {
      return res.status(400).json({ error: "User not found" });
    }

    const [{ _count: totalItems }, spaces] = await Promise.all([
      prisma.space.aggregate({
        where: {
          userId: id,
        },
        _count: true,
      }),
      prisma.space.findMany({
        where: {
          userId: id,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          logo: true,
          createdAt: true,
          headerTitle: true,
          customMessage: true,
          questions: true,
          customButtonColor: true,
          theme: true,
          thankYouPage: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      items: spaces,
      pagination: {
        currentPage: page,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching spaces for user:", error);
    return res.status(500).json({ error: "Failed to fetch spaces" });
  }
};
exports.getSpaceById = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const data = matchedData(req);
  const userId = req.user.id;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    const space = await prisma.space.findUnique({
      where: {
        userId: userId,
        id: data.id,
      },

      select: {
        id: true,
        name: true,
        headerTitle: true,
        logo: true,
        customMessage: true,
        questions: true,
        customButtonColor: true,
        theme: true,
        thankYouPage: true,
        createdAt: true,
      },
    });

    if (!space) {
      return res.status(400).json({ error: "Space not found" });
    }

    return res.status(200).json(space);
  } catch (error) {
    console.error("Error fetching space by ID:", error);
    return res.status(500).json({ error: "Failed to fetch space" });
  }
};
exports.getSpaceByNameForReview = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const data = matchedData(req);

  try {
    const space = await prisma.space.findUnique({
      where: {
        name: data.name,
      },

      select: {
        name: true,
        headerTitle: true,
        logo: true,
        customMessage: true,
        questions: true,
        customButtonColor: true,
        theme: true,
        thankYouPage: true,
        createdAt: true,
      },
    });

    if (!space) {
      return res.status(400).json({ error: "Space not found" });
    }

    return res.status(200).json(space);
  } catch (error) {
    console.error("Error fetching space by ID:", error);
    return res.status(500).json({ error: "Failed to fetch space" });
  }
};
