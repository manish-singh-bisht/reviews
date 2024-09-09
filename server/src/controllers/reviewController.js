const { validationResult, matchedData } = require("express-validator");
const prisma = require("../lib/prisma");

exports.createReview = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { rating, name, email, reviewMsg, spaceName } = matchedData(req);

  try {
    const space = await prisma.space.findUnique({
      where: { name: spaceName },
      select: {
        id: true,
      },
    });

    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    const existedReview = await prisma.review.findFirst({
      where: {
        email: email,
        spaceId: space.id,
      },
    });

    if (existedReview) {
      return res
        .status(409)
        .json({ error: "You already sent the review. Thank you!!" });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        name,
        email,
        reviewMsg,
        spaceId: space.id,
      },
    });

    return res.status(201).json({ message: "successfully received." });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Failed to create review" });
  }
};

//just update the isAmongTop, but still keeping a scope to expand in future.
exports.editReview = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { id: reviewId } = matchedData(req);

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        isAmongTop: !review.isAmongTop,
      },
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

exports.getAllReviews = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { id } = matchedData(req);
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 50;
  const skip = (page - 1) * limit;

  try {
    const [{ _count: totalItems }, items] = await Promise.all([
      prisma.review.aggregate({
        where: { id },
        _count: true,
      }),
      prisma.review.findMany({
        where: { spaceId: id },
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
