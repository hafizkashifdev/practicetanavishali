"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Rating,
  Container,
  Tabs,
  Tab,
  CardActionArea,
} from "@mui/material";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://dummyjson.com/products");
        const data = await res.json();
        setProducts(data.products);
        const uniqueCategories = [
          "All",
          ...new Set(data.products.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ✅ Page Title */}
      <Typography
        variant="h4"
        fontWeight={700}
        color="text.primary"
        mb={4}
        textAlign="center"
      >
        Browse Our Products
      </Typography>

      {/* ✅ Category Filter Tabs */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="product categories"
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
            px: 2,
          }}
        >
          {categories.map((cat) => (
            <Tab
              key={cat}
              label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              value={cat}
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Tabs>
      </Box>

      {/* ✅ Product Grid */}
      <Grid container spacing={4}>
        {filteredProducts.map((product, i) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              style={{ height: "100%" }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/dashboard/product/${product.id}`}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.thumbnail}
                    alt={product.title}
                    sx={{
                      height: { xs: 180, md: 220 },
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="text.primary"
                      noWrap
                    >
                      {product.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ textTransform: "capitalize" }}
                    >
                      {product.category}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2, // Added margin-top for spacing
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight={700}
                      >
                        ${product.price}
                      </Typography>
                      <Rating
                        name="read-only"
                        value={product.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}