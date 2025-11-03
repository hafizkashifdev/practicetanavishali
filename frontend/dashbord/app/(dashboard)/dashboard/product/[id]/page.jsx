"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  CircularProgress,
  Rating,
  Grid,
  Chip,
  Paper,
  Container, // ✅ Used Container for better padding and max-width
  Button, // ✅ Added Button
  Stack, // ✅ Added Stack for cleaner layouts
  Avatar, // ✅ Added Avatar for reviews
} from "@mui/material";
import { motion } from "framer-motion"; // ✅ Added framer-motion
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"; // ✅ Added an icon

// Helper function to calculate discounted price
const getDiscountedPrice = (price, discount) => {
  return (price - (price * discount) / 100).toFixed(2);
};

// --- Animation Variants ---
const mainFadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] =useState(null);

  useEffect(() => {
    if (!id) return; // Guard clause if id is not ready
    async function fetchProduct() {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "grey[50]", // ✅ Added BG color
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );

  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  return (
    <Box sx={{ py: 4, bgcolor: "grey[50]" }}> {/* ✅ Page background */}
      <Container maxWidth="lg">
        {/* ✅ Product Card */}
        <motion.div variants={mainFadeIn} initial="hidden" animate="visible">
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              boxShadow: 4,
              borderRadius: 4, // Slightly more rounded
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            {/* Product Thumbnail */}
            <CardMedia
              component="img"
              image={product.thumbnail}
              alt={product.title}
              sx={{
                width: { xs: "100%", md: "40%" },
                height: { xs: 300, md: 500 }, // Taller image
                objectFit: "cover",
              }}
            />

            {/* Product Info */}
            <CardContent sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
              <Stack spacing={2}>
                <Chip
                  label={product.category}
                  color="primary"
                  size="small"
                  sx={{ width: "fit-content", textTransform: "capitalize" }}
                />
                <Typography variant="h4" fontWeight={700} color="text.primary">
                  {product.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Rating
                    value={product.rating}
                    precision={0.5}
                    readOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({product.reviews?.length || 0} reviews)
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {product.description}
                </Typography>

                {/* ✅ Price & Action Box */}
                <Paper
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 2, bgcolor: "grey[50]" }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="h4"
                        color="primary.main"
                        fontWeight={700}
                      >
                        ${discountedPrice}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        ${product.price}
                      </Typography>
                      <Chip
                        label={`${product.discountPercentage}% OFF`}
                        color="error"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    <Chip
                      label={
                        product.stock > 0
                          ? `In Stock (${product.stock} left)`
                          : "Out of Stock"
                      }
                      color={product.stock > 0 ? "success" : "error"}
                      sx={{ width: "fit-content" }}
                    />

                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddShoppingCartIcon />}
                      disabled={product.stock === 0}
                      sx={{ mt: 1, fontWeight: 600 }}
                    >
                      Add to Cart
                    </Button>
                  </Stack>
                </Paper>

                <Divider sx={{ my: 1 }} />

                {/* ✅ Details Stack */}
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    <b>Brand:</b> {product.brand}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>Warranty:</b>{" "}
                    {product.warrantyInformation || "No warranty"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>Shipping:</b> {product.shippingInformation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>Return Policy:</b> {product.returnPolicy}
                  </Typography>
                </Stack>

                {/* Tags */}
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {product.tags?.map((tag, i) => (
                    <Chip key={i} label={tag} color="secondary" size="small" />
                  ))}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Product Gallery */}
        {product.images && product.images.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <motion.div variants={mainFadeIn} initial="hidden" animate="visible">
              <Typography
                variant="h5"
                fontWeight={600}
                color="text.primary"
                mb={2}
              >
                Product Gallery
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={2}>
                {product.images.map((img, i) => (
                  <Grid key={i} item xs={6} sm={4} md={3}>
                    <motion.div variants={mainFadeIn}>
                      <Paper
                        elevation={3}
                        sx={{
                          borderRadius: 2,
                          overflow: "hidden",
                          transition: "box-shadow 0.3s ease, transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: 8, // ✅ Enhanced hover
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={img}
                          alt={`Product image ${i + 1}`}
                          sx={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                          }}
                        />
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Box>
        )}

        {/* ✅ Reviews Section */}
        <motion.div variants={mainFadeIn} initial="hidden" animate="visible">
          <Paper
            elevation={2}
            sx={{ p: 3, mt: 5, borderRadius: 3, bgcolor: "background.paper" }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              color="text.primary"
              mb={2}
            >
              Customer Reviews
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((r, i) => (
                  <motion.div variants={mainFadeIn} key={i}>
                    <Box sx={{ mb: 2 }}>
                      {/* ✅ Improved Review Layout */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{ bgcolor: "primary.main" }}
                          alt={r.reviewerName}
                        >
                          {r.reviewerName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>
                            {r.reviewerName}
                          </Typography>
                          <Rating value={r.rating} size="small" readOnly />
                        </Box>
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, pl: "56px" }} // Align with text
                      >
                        {r.comment}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </motion.div>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No reviews available.
                </Typography>
              )}
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}