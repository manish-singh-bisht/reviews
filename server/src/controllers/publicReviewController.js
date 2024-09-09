const { validationResult, matchedData } = require("express-validator");
const prisma = require("../lib/prisma");

exports.getAllReviewsWhenRequestedByUser = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { name } = matchedData(req);
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 50;
  const skip = (page - 1) * limit;

  const isAmongTop = req.query.liked === "true";

  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    const space = await prisma.space.findUnique({
      where: {
        userId: userId,
        name: name,
      },

      select: {
        id: true,
      },
    });

    if (!space) {
      return res.status(400).json({ error: "Space not found" });
    }

    const whereCondition = { spaceId: space.id };
    if (isAmongTop) {
      whereCondition.isAmongTop = true;
    }

    const [{ _count: totalItems }, items] = await Promise.all([
      prisma.review.aggregate({
        where: whereCondition,
        _count: true,
      }),
      prisma.review.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    return res.status(500).json({ error: "Failed to retrieve reviews" });
  }
};
