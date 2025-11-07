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
  Container, 
  Button, 
  Stack, 
    Avatar, 
} from "@mui/material";
import { motion } from "framer-motion"; 
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"; 

const getDiscountedPrice = (price, discount) => {
  return (price - (price * discount) / 100).toFixed(2);
};

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
    if (!id) return; 
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
          bgcolor: "grey[50]", 
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
    <Box sx={{ py: 4, bgcolor: "grey[50]" }}>
 <Button
        href="/dashboard"
        variant="contained"
        size="medium"
        sx={{mb:5}}
      >
        Go to Dashboard
      </Button> 
                    
                         <Container maxWidth="lg">
        <motion.div variants={mainFadeIn} initial="hidden" animate="visible">
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              boxShadow: 2,
              borderRadius: 1, 
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            <CardMedia
              component="img"
              image={product.thumbnail}
              alt={product.title}
              sx={{
                width: { xs: "100%", md: "40%" },
                height: { xs: 300, md: 500 }, 
                objectFit: "cover",
              }}
            />

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

                <Paper 
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 1, bgcolor: "background.default" }}
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
                      size="medium"
                      startIcon={<AddShoppingCartIcon />}
                      disabled={product.stock === 0}
                      sx={{ mt: 1 }}
                    >
                      Add to Cart
                    </Button>
                     
                  </Stack>
                </Paper>

                <Divider sx={{ my: 1 }} />

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

                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {product.tags?.map((tag, i) => (
                    <Chip key={i} label={tag} color="primary" size="small" />
                  ))}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {product?.images && product?.images.length > 0 && (
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
                          borderRadius: 1,
                          overflow: "hidden",
                          transition: "box-shadow 0.3s ease, transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: 5, 
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

        <motion.div variants={mainFadeIn} initial="hidden" animate="visible">
          <Paper
            elevation={2}
            sx={{ p: 3, mt: 5, borderRadius: 1, bgcolor: "background.default" }}
          >
            <Typography
              variant="h5"
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
                        sx={{ mt: 1, pl: "56px" }} 
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