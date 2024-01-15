import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const limit = +(req.query.limit ?? 5);
  const page = +(req.query.page ?? 0);
  const skip = page * 5;
  const category = req.query.category;
  const keywords = req.query.keywords;
  const query = {};
  if (!category && !keywords) {
    query;
  }
  if (category) {
    query.category = category;
  }
  if (keywords) {
    query.name = new RegExp(keywords, "i");
  }
  const collection = db.collection("products");
  try {
    const totalProducts = await collection.find(query).toArray();
    const totalPage = Math.ceil(totalProducts.length / limit);
    const newProducts = await collection
      .find(query)
      .sort({ created_time: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    return res.json({
      message: "Get products successfully.",
      data: newProducts,
      totalPage,
    });
  } catch {
    return res.status(500).json({
      message: "Server Error can't find product",
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);
  try {
    const newProduct = await collection.findOne({
      _id: id,
    });
    return res.json({
      message: "Get product successfully.",
      data: newProduct,
    });
  } catch {
    return res.status(500).json({
      message: "Error can't find item ",
    });
  }
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const date = new Date().toISOString();
  const productsData = { ...req.body, created_time: date };
  if (
    !req.body.name ||
    !req.body.image ||
    !req.body.price ||
    !req.body.description ||
    !req.body.category
  ) {
    return res.status(404).json({
      message: "Error can't find body.",
    });
  }
  try {
    const result = await collection.insertOne(productsData);

    return res.json({
      message: `Product record (${result.insertedId}) has been created successfully`,
    });
  } catch {
    return res.status(500).json({
      message: "Server can't record product data",
    });
  }
});

productRouter.put("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);
  const newProduct = { ...req.body };
  try {
    const result = await collection.updateOne(
      { _id: id },
      { $set: newProduct }
    );

    return res.json({
      message: "Product has been updated successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Server can't update product",
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);
  const product = await collection.findOne({ _id: id });
  if (!product) {
    return res.status(400).json({
      message: "Invalid request,Can't find product",
    });
  }

  try {
    const result = await collection.deleteOne({ _id: id });
    return res.json({
      message: `Delete item on id : ${id} successfully `,
    });
  } catch {
    return res.status(500).json({
      message: "Server can't delete product.",
    });
  }
});

export default productRouter;
