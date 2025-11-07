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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://dummyjson.com/products");
        console.log(res);
        
        const data = await res.json();
        console.log(data);
        
        setProducts(data.products);
        const uniqueCategories = [...new Set(data.products.map((p) => p.category))];
        setCategories(uniqueCategories);
        setSelectedCategory(uniqueCategories[0]);
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

  const filteredProducts = products?.filter((p) => p.category === selectedCategory);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="text.primary"
        mb={4}
        textAlign="center"
      >
        Browse Products by Category
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="product categories"
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 1,
            px: { xs: 1, sm: 2 },
          }}
        >
          {categories?.map((cat) => (
            <Tab
              key={cat}
              label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              value={cat}
              sx={{
                textTransform: "capitalize",
                px: 2,
                py: 1,
                fontWeight: 500,
              }}
            />
          ))}
        </Tabs>
      </Box>

   
      <Grid
        container
        justifyContent="center"
        spacing={{ xs: 2, sm: 3, md: 4 }}
      >
        {filteredProducts?.map((product, i) => (
          <Grid
            item
            key={product.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: "flex" }}
          >
            <motion.div
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              style={{ width: "100%", display: "flex" }}
            >
              <Card
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/dashboard/product/${product.id}`}
                  sx={{ display: "flex", flexDirection: "column", height: "100%" }}
                >
                  <CardMedia
                    component="img"
                    image={product?.thumbnail}
                    alt={product?.title}
                    sx={{
                      width: "100%",
                      height: { xs: 180, sm: 200, md: 220 },
                      objectFit: "cover",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="text.primary"
                      noWrap
                    >
                      {product?.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {product?.category}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight={700}
                      >
                        ${product?.price}
                      </Typography>
                      <Rating
                        name="read-only"
                        value={product?.rating}
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
